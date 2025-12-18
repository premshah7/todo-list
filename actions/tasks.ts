'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const taskSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    priority: z.enum(['Low', 'Medium', 'High']),
    status: z.enum(['Pending', 'In Progress', 'Completed']),
    assignedToId: z.string().optional(),
    dueDate: z.string().optional(),
})

export async function createTask(listId: string, formData: FormData) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            priority: formData.get('priority') as 'Low' | 'Medium' | 'High',
            status: formData.get('status') as 'Pending' | 'In Progress' | 'Completed',
            assignedToId: formData.get('assignedToId') as string || undefined,
            dueDate: formData.get('dueDate') as string,
        }

        const validated = taskSchema.parse(data)

        // Get the max position
        const maxPosition = await prisma.task.aggregate({
            where: { listId },
            _max: { position: true },
        })

        const task = await prisma.task.create({
            data: {
                ...validated,
                listId,
                position: (maxPosition._max.position ?? -1) + 1,
                dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
            },
        })

        // Create history
        await prisma.taskHistory.create({
            data: {
                taskId: task.id,
                changedBy: (session.user as any).id,
                changeType: 'created',
                newValue: task.title,
            },
        })

        revalidatePath('/projects')
        revalidatePath('/my-tasks')
        return { success: true, taskId: task.id }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        }
        return { error: 'Failed to create task' }
    }
}

export async function updateTask(taskId: string, formData: FormData) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const existingTask = await prisma.task.findUnique({
            where: { id: taskId },
        })

        if (!existingTask) {
            return { error: 'Task not found' }
        }

        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            priority: formData.get('priority') as 'Low' | 'Medium' | 'High',
            status: formData.get('status') as 'Pending' | 'In Progress' | 'Completed',
            assignedToId: formData.get('assignedToId') as string || null,
            dueDate: formData.get('dueDate') as string,
        }

        const validated = taskSchema.parse(data)

        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...validated,
                dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
            },
        })

        // Create history entries for changes
        if (existingTask.status !== task.status) {
            await prisma.taskHistory.create({
                data: {
                    taskId: task.id,
                    changedBy: (session.user as any).id,
                    changeType: 'status_changed',
                    oldValue: existingTask.status,
                    newValue: task.status,
                },
            })
        }

        if (existingTask.assignedToId !== task.assignedToId) {
            await prisma.taskHistory.create({
                data: {
                    taskId: task.id,
                    changedBy: (session.user as any).id,
                    changeType: 'assigned',
                    oldValue: existingTask.assignedToId || 'none',
                    newValue: task.assignedToId || 'none',
                },
            })
        }

        revalidatePath('/projects')
        revalidatePath('/my-tasks')
        revalidatePath(`/tasks/${taskId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        }
        return { error: 'Failed to update task' }
    }
}

export async function deleteTask(taskId: string) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.task.delete({
            where: { id: taskId },
        })

        revalidatePath('/projects')
        revalidatePath('/my-tasks')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to delete task' }
    }
}

export async function moveTask(taskId: string, newListId: string, newPosition: number) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                taskList: {
                    select: { listName: true },
                },
            },
        })

        if (!task) {
            return { error: 'Task not found' }
        }

        const newList = await prisma.taskList.findUnique({
            where: { id: newListId },
            select: { listName: true },
        })

        if (!newList) {
            return { error: 'List not found' }
        }

        // Update task list and position
        await prisma.task.update({
            where: { id: taskId },
            data: {
                listId: newListId,
                status: newList.listName as 'Pending' | 'In Progress' | 'Completed',
                position: newPosition,
            },
        })

        // Create history if list changed
        if (task.listId !== newListId) {
            await prisma.taskHistory.create({
                data: {
                    taskId: task.id,
                    changedBy: (session.user as any).id,
                    changeType: 'moved',
                    oldValue: task.taskList.listName,
                    newValue: newList.listName,
                },
            })
        }

        revalidatePath('/projects')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to move task' }
    }
}

export async function getMyTasks() {
    const session = await auth()
    if (!session?.user) {
        return []
    }

    const tasks = await prisma.task.findMany({
        where: {
            assignedToId: (session.user as any).id,
        },
        include: {
            taskList: {
                select: {
                    listName: true,
                    project: {
                        select: {
                            projectName: true,
                            id: true,
                        },
                    },
                },
            },
        },
        orderBy: [
            { dueDate: 'asc' },
            { createdAt: 'desc' },
        ],
    })

    return tasks
}

export async function getTask(taskId: string) {
    const session = await auth()
    if (!session?.user) {
        return null
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            assignedTo: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                },
            },
            taskList: {
                select: {
                    listName: true,
                    project: {
                        select: {
                            id: true,
                            projectName: true,
                        },
                    },
                },
            },
            comments: {
                include: {
                    user: {
                        select: {
                            username: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            histories: {
                include: {
                    user: {
                        select: {
                            username: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    })

    return task
}

export async function addComment(taskId: string, commentText: string) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.taskComment.create({
            data: {
                taskId,
                userId: (session.user as any).id,
                commentText,
            },
        })

        revalidatePath(`/tasks/${taskId}`)
        return { success: true }
    } catch (error) {
        return { error: 'Failed to add comment' }
    }
}
