'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createSubtask(taskId: number, title: string) {
    const session = await auth()
    if (!session?.user) return { error: 'Unauthorized' }

    if (!title || title.trim() === '') {
        return { error: 'Title is required' }
    }

    try {
        const subtask = await prisma.subtasks.create({
            data: {
                TaskID: taskId,
                Title: title.trim(),
            }
        })

        revalidatePath(`/tasks/${taskId}`)
        return { success: true, subtask }
    } catch (error) {
        console.error('Error creating subtask:', error)
        return { error: 'Failed to create subtask' }
    }
}

export async function toggleSubtask(subtaskId: number, isCompleted: boolean) {
    const session = await auth()
    if (!session?.user) return { error: 'Unauthorized' }

    try {
        await prisma.subtasks.update({
            where: { SubtaskID: subtaskId },
            data: { IsCompleted: isCompleted }
        })

        // We should ideally find the task ID to revalidate the specific task path
        // For now, revalidate globally or rely on client state updates
        revalidatePath('/projects')
        return { success: true }
    } catch (error) {
        console.error('Error toggling subtask:', error)
        return { error: 'Failed to update subtask' }
    }
}

export async function deleteSubtask(subtaskId: number) {
    const session = await auth()
    if (!session?.user) return { error: 'Unauthorized' }

    try {
        await prisma.subtasks.delete({
            where: { SubtaskID: subtaskId }
        })

        revalidatePath('/projects')
        return { success: true }
    } catch (error) {
        console.error('Error deleting subtask:', error)
        return { error: 'Failed to delete subtask' }
    }
}
