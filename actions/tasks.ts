'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const tasksSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    priority: z.enum(['Low', 'Medium', 'High']),
    status: z.enum(['Pending', 'In Progress', 'Completed']),
    assignedToId: z.string().optional(),
    dueDate: z.string().optional(),
})

export async function createtasks(listId: string, formData: FormData) {
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

        const validated = tasksSchema.parse(data)

        // Get the max position
        const maxPosition = await prisma.tasks.aggregate({
            where: { ListID: Number(listId) },
            _max: { Position: true },
        })

        const tasks = await prisma.tasks.create({
            data: {
                ...validated,
                ListID: Number(listId),
                Position: (maxPosition._max.Position ?? -1) + 1,
                DueDate: validated.dueDate ? new Date(validated.dueDate) : null,
            },
        })

        // Create history
        await prisma.taskHistory.create({
            data: {
                TaskID: tasks.TaskID,
                ChangedBy: (session.user as any).id,
                ChangeType: 'created',
                NewValue: tasks.Title,
            },
        })

        revalidatePath('/projects')
        revalidatePath('/my-taskss')
        return { success: true, tasksId: tasks.TaskID }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        }
        return { error: 'Failed to create tasks' }
    }
}

export async function updatetasks(tasksId: string, formData: FormData) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const existingtasks = await prisma.tasks.findUnique({
            where: { TaskID: tasksId },
        })

        if (!existingtasks) {
            return { error: 'tasks not found' }
        }

        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            priority: formData.get('priority') as 'Low' | 'Medium' | 'High',
            status: formData.get('status') as 'Pending' | 'In Progress' | 'Completed',
            assignedToId: formData.get('assignedToId') as string || null,
            dueDate: formData.get('dueDate') as string,
        }

        const validated = tasksSchema.parse(data)

        const tasks = await prisma.tasks.update({
            where: { TaskID: Number(tasksId) },
            data: {
                ...validated,
                DueDate: validated.dueDate ? new Date(validated.dueDate) : null,
            },
        })

        // Create history entries for changes
        if (existingtasks.Status !== tasks.Status) {
            await prisma.taskHistory.create({
                data: {
                    HistoryID: tasks.TaskID,
                    ChangedBy: (session.user as any).id,
                    ChangeType: 'status_changed',
                    OldValue: existingtasks.Status,
                    NewValue: tasks.Status,
                },
            })
        }

        if (existingtasks.AssignedTo !== tasks.AssignedTo) {
            await prisma.taskHistory.create({
                data: {
                    HistoryID: tasks.TaskID,
                    ChangedBy: (session.user as any).id,
                    ChangeType: 'assigned',
                    OldValue: existingtasks.AssignedTo || 'none',
                    NewValue: tasks.AssignedTo || 'none',
                },
            })
        }

        revalidatePath('/projects')
        revalidatePath('/my-taskss')
        revalidatePath(`/taskss/${tasksId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.message }
        }
        return { error: 'Failed to update tasks' }
    }
}

export async function deletetasks(tasksId: string) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.tasks.delete({
            where: { TaskID: Number(tasksId) },
        })

        revalidatePath('/projects')
        revalidatePath('/my-taskss')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to delete tasks' }
    }
}

export async function movetasks(tasksId: string, newListId: string, newPosition: number) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const tasks = await prisma.tasks.findUnique({
            where: { TaskID: Number(tasksId) },
            include: {
                TaskLists: {
                    select: { ListName: true },
                },
            },
        })

        if (!tasks) {
            return { error: 'tasks not found' }
        }

        const newList = await prisma.taskLists.findUnique({
            where: { ListID: Number(newListId) },
            select: { ListName: true },
        })

        if (!newList) {
            return { error: 'List not found' }
        }

        // Update tasks list and position
        await prisma.tasks.update({
            where: { TaskID: Number(tasksId) },
            data: {
                ListID: Number(newListId),
                Status: newList.ListName as 'Pending' | 'In Progress' | 'Completed',
                Position: newPosition,
            },
        })

        // Create history if list changed
        if (tasks.ListID !== Number(newListId)) {
            await prisma.taskHistory.create({
                data: {
                    TaskID: tasks.TaskID,
                    ChangedBy: (session.user as any).id,
                    ChangeType: 'moved',
                    OldValue: tasks.TaskLists.ListName,
                    NewValue: newList.ListName,
                },
            })
        }

        revalidatePath('/projects')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to move tasks' }
    }
}

export async function getMyTasks() {
    const session = await auth()
    if (!session?.user) {
        return []
    }

    const tasks = await prisma.tasks.findMany({
        where: {
            AssignedTo: parseInt((session.user as any).id),
        },
        include: {
            TaskLists: {
                select: {
                    ListName: true,
                    Projects: {
                        select: {
                            ProjectName: true,
                            ProjectID: true,
                        },
                    },
                },
            },
        },
        orderBy: [
            { DueDate: 'asc' },
            { CreatedAt: 'desc' },
        ],
    })

    return tasks
}

export async function getTask(taskId: string) {
    const session = await auth()
    if (!session?.user) {
        return null
    }

    const task = await prisma.tasks.findUnique({
        where: { TaskID: parseInt(taskId) },
        include: {
            Users: {
                select: {
                    UserID: true,
                    UserName: true,
                    Email: true,
                },
            },
            TaskLists: {
                select: {
                    ListName: true,
                    Projects: {
                        select: {
                            ProjectName: true,
                            ProjectID: true,
                        },
                    },
                },
            },
            TaskComments: {
                include: {
                    Users: {
                        select: {
                            UserName: true,
                        },
                    },
                },
                orderBy: {
                    CreatedAt: 'desc',
                },
            },
            TaskHistory: {
                include: {
                    Users: {
                        select: {
                            UserName: true,
                        },
                    },
                },
                orderBy: {
                    ChangeTime: 'desc',
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
        await prisma.taskComments.create({
            data: {
                TaskID: parseInt(taskId),
                UserID: parseInt((session.user as any).id),
                CommentText: commentText,
            },
        })

        revalidatePath(`/tasks/${taskId}`)
        return { success: true }
    } catch (error) {
        return { error: 'Failed to add comment' }
    }
}
