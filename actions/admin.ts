'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getPendingApprovals(
    search?: string,
    status: string = 'PENDING'
) {
    try {
        const where: any = {}

        if (status && status !== 'ALL') {
            where.Status = status
        }

        if (search) {
            where.OR = [
                { FullName: { contains: search, mode: 'insensitive' } },
                { Email: { contains: search, mode: 'insensitive' } },
                { UserName: { contains: search, mode: 'insensitive' } },
            ]
        }

        const pendingUsers = await prisma.userRegistrationQueue.findMany({
            where,
            orderBy: { SubmittedAt: 'desc' }
        })
        return pendingUsers
    } catch (error) {
        console.error('Failed to fetch pending approvals:', error)
        return []
    }
}

export async function getApprovalStats() {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [totalPending, approvedToday, totalProcessed] = await Promise.all([
            prisma.userRegistrationQueue.count({ where: { Status: 'PENDING' } }),
            prisma.userRegistrationQueue.count({
                where: {
                    Status: 'APPROVED',
                    ReviewedAt: { gte: today }
                }
            }),
            prisma.userRegistrationQueue.count({ where: { Status: { not: 'PENDING' } } }) // Approximate
        ])

        // Average wait time calculation could be complex, skipping for MVP or doing simple avg on recent 100

        return {
            totalPending,
            approvedToday,
            avgWaitTime: "4.2 Hours" // Placeholder or calc real time if needed
        }
    } catch (error) {
        return { totalPending: 0, approvedToday: 0, avgWaitTime: "N/A" }
    }
}

export async function approveUser(queueId: string, adminId: number, data?: { role?: string, department?: string }) {
    try {
        // 1. Get Queue Record
        const queueRecord = await prisma.userRegistrationQueue.findUnique({
            where: { QueueID: queueId }
        })

        if (!queueRecord) {
            return { success: false, error: "Request not found" }
        }

        // 2. Create User Account
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { Email: queueRecord.Email },
                    { UserName: queueRecord.UserName }
                ]
            }
        })

        if (existingUser) {
            // If user already exists, just update queue status? Or error?
            // Let's mark queue as REJECTED (Duplicate) to clean it up?
            // Or maybe they are re-applying? 
            // For now, return error.
            return { success: false, error: "User already exists" }
        }

        const newUser = await prisma.users.create({
            data: {
                UserName: queueRecord.UserName,
                Email: queueRecord.Email,
                PasswordHash: queueRecord.PasswordHash,
                Role: (data?.role || queueRecord.Role).toUpperCase(), // Allow override
                RegistrationStatus: "ACTIVE",
                ApprovedAt: new Date(),
                ApprovedBy: adminId,
                profile: {
                    create: {
                        Department: data?.department || queueRecord.Department, // Allow override
                        JobTitle: queueRecord.Role
                    }
                }
            }
        })

        // 3. Update Queue Status
        await prisma.userRegistrationQueue.update({
            where: { QueueID: queueId },
            data: {
                Status: 'APPROVED',
                ReviewedAt: new Date(),
                ReviewedBy: adminId
            }
        })

        // 4. Log Action
        await prisma.adminApprovalLog.create({
            data: {
                AdminID: adminId,
                QueueID: queueId,
                Action: 'APPROVED',
                Notes: 'Approved via Admin Dashboard'
            }
        })

        revalidatePath('/admin/approvals')
        return { success: true, user: newUser }

    } catch (error: any) {
        console.error('Approval Error:', error)
        return { success: false, error: error.message }
    }
}

export async function rejectUser(queueId: string, adminId: number, reason?: string) {
    try {
        // 1. Update Queue Status
        await prisma.userRegistrationQueue.update({
            where: { QueueID: queueId },
            data: {
                Status: 'REJECTED',
                ReviewedAt: new Date(),
                ReviewedBy: adminId,
                RejectionReason: reason
            }
        })

        // 2. Log Action
        await prisma.adminApprovalLog.create({
            data: {
                AdminID: adminId,
                QueueID: queueId,
                Action: 'REJECTED',
                Notes: reason
            }
        })

        revalidatePath('/admin/approvals')
        return { success: true }

    } catch (error: any) {
        console.error('Rejection Error:', error)
        return { success: false, error: error.message }
    }
}

export async function batchApproveUsers(queueIds: string[], adminId: number) {
    // Naive implementation: loop. Better: Prisma transaction or specific query (but `users` creation needs items)
    // We'll iterate for now to reuse `approveUser` logic (which handles User creation + Queue update safely)
    let successCount = 0
    let failCount = 0

    for (const id of queueIds) {
        const res = await approveUser(id, adminId)
        if (res.success) successCount++
        else failCount++
    }

    revalidatePath('/admin/approvals')
    return { success: true, successCount, failCount }
}

export async function batchRejectUsers(queueIds: string[], adminId: number, reason: string = "Batch Rejection") {
    try {
        await prisma.userRegistrationQueue.updateMany({
            where: { QueueID: { in: queueIds } },
            data: {
                Status: 'REJECTED',
                ReviewedAt: new Date(),
                ReviewedBy: adminId,
                RejectionReason: reason
            }
        })

        // Logs (would need separate createMany)
        await prisma.adminApprovalLog.createMany({
            data: queueIds.map(id => ({
                AdminID: adminId,
                QueueID: id,
                Action: 'REJECTED',
                Notes: reason
            }))
        })

        revalidatePath('/admin/approvals')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
