import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const queueID = searchParams.get('queueID')

    if (!queueID) {
        return NextResponse.json({ error: 'Queue ID is required' }, { status: 400 })
    }

    try {
        const queueRecord = await prisma.userRegistrationQueue.findUnique({
            where: { QueueID: queueID }
        })

        if (!queueRecord) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 })
        }

        // Calculate Position
        const position = await prisma.userRegistrationQueue.count({
            where: {
                Status: 'PENDING',
                SubmittedAt: {
                    lt: queueRecord.SubmittedAt
                }
            }
        }) + 1

        // Total Queue
        const totalQueue = await prisma.userRegistrationQueue.count({
            where: { Status: 'PENDING' }
        })

        // Stats for "Section 5"
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const approvalsToday = await prisma.userRegistrationQueue.count({
            where: {
                Status: 'APPROVED',
                ReviewedAt: { gte: today }
            }
        })

        // Mock Avg Time (Replace with real calc if needed)
        const avgWaitTime = "18 hours"

        const progress = Math.max(5, Math.min(95, Math.round(((totalQueue - position + 1) / totalQueue) * 100)))

        return NextResponse.json({
            queueID: queueRecord.QueueID,
            status: queueRecord.Status,
            userName: queueRecord.UserName,
            email: queueRecord.Email,
            position,
            totalQueue,
            usersAhead: Math.max(0, position - 1),
            approvalsToday,
            avgWaitTime,
            submittedAt: queueRecord.SubmittedAt,
            estimatedApprovalTime: "24-48 Hours",
            approvalPercentage: isNaN(progress) ? 0 : progress
        })

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
