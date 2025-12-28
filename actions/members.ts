'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function addMember(projectId: string, email: string) {
    const session = await auth()
    if (!session?.user) return { error: 'Unauthorized' }

    try {
        // 1. Check if user exists
        const userToAdd = await prisma.users.findUnique({
            where: { Email: email }
        })

        if (!userToAdd) {
            return { error: 'User not found with this email' }
        }

        // 2. Check if already a member
        const existingMember = await prisma.projectMembers.findUnique({
            where: {
                ProjectID_UserID: {
                    ProjectID: Number(projectId),
                    UserID: userToAdd.UserID
                }
            }
        })

        if (existingMember) {
            return { error: 'User is already a member' }
        }

        // 3. Add to project
        await prisma.projectMembers.create({
            data: {
                ProjectID: Number(projectId),
                UserID: userToAdd.UserID,
                Role: 'Editor'
            }
        })



        revalidatePath(`/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        console.error('Add member error:', error)
        return { error: 'Failed to add member' }
    }
}

export async function removeMember(projectId: string, userId: number) {
    const session = await auth()
    if (!session?.user) return { error: 'Unauthorized' }

    try {
        await prisma.projectMembers.delete({
            where: {
                ProjectID_UserID: {
                    ProjectID: Number(projectId),
                    UserID: userId
                }
            }
        })

        revalidatePath(`/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        return { error: 'Failed to remove member' }
    }
}

export async function getProjectMembers(projectId: string) {
    const session = await auth()
    if (!session?.user) return []

    try {
        const members = await prisma.projectMembers.findMany({
            where: { ProjectID: Number(projectId) },
            include: {
                Users: {
                    select: {
                        UserID: true,
                        UserName: true,
                        Email: true
                    }
                }
            }
        })

        return members.map(m => ({
            id: m.Users.UserID,
            name: m.Users.UserName,
            email: m.Users.Email,
            role: m.Role,
            joinedAt: m.JoinedAt
        }))
    } catch (error) {
        return []
    }
}
