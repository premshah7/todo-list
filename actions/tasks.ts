'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const tasksSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    priority: z.enum(['Low', 'Medium', 'High']),
    status: z.string().min(1),
    assignedToId: z.string().optional(),
    dueDate: z.string().optional(),
    estimation: z.string().optional(),
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
            status: formData.get('status') as string,
            assignedToId: formData.get('assignedToId') as string || undefined,
            dueDate: (() => {
                const date = formData.get('dueDate') as string
                const time = formData.get('dueTime') as string
                if (!date) return undefined
                return time ? `${date}T${time}` : date
            })(),
            estimation: (() => {
                const val = formData.get('estimationValue') as string
                const unit = formData.get('estimationUnit') as string
                return val ? `${val} ${unit}` : undefined
            })(),
        }

        const validated = tasksSchema.parse(data)

        // Get the max position
        const maxPosition = await prisma.tasks.aggregate({
            where: { ListID: Number(listId) },
            _max: { Position: true },
        })

        const task = await prisma.tasks.create({
            data: {
                Title: validated.title,
                Description: validated.description,
                Priority: validated.priority,
                Status: validated.status,
                AssignedTo: validated.assignedToId ? Number(validated.assignedToId) : Number(session.user.id),
                DueDate: validated.dueDate ? new Date(validated.dueDate) : null,
                Estimation: validated.estimation,
                ListID: Number(listId),
                Position: (maxPosition._max.Position ?? -1) + 1,
            },
        })

        // Create history
        await prisma.taskHistory.create({
            data: {
                TaskID: task.TaskID,
                ChangedBy: Number(session.user.id),
                ChangeType: 'created',
                NewValue: task.Title,
            },
        })

        revalidatePath('/projects')
        revalidatePath('/my-tasks')
        return { success: true, taskId: task.TaskID }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.message }
        }
        console.error('Create task error:', error)
        return { error: 'Failed to create task' }
    }
}

export async function updateTask(taskId: string, formData: FormData) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const existingTask = await prisma.tasks.findUnique({
            where: { TaskID: Number(taskId) },
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
            dueDate: (() => {
                const date = formData.get('dueDate') as string
                const time = formData.get('dueTime') as string
                if (!date) return undefined
                return time ? `${date}T${time}` : date
            })(),
            estimation: (() => {
                const val = formData.get('estimationValue') as string
                const unit = formData.get('estimationUnit') as string
                return val ? `${val} ${unit}` : undefined
            })(),
        }

        const validated = tasksSchema.parse(data)

        const task = await prisma.tasks.update({
            where: { TaskID: Number(taskId) },
            data: {
                Title: validated.title,
                Description: validated.description,
                Priority: validated.priority,
                Status: validated.status,
                AssignedTo: validated.assignedToId ? Number(validated.assignedToId) : null,
                DueDate: validated.dueDate ? new Date(validated.dueDate) : null,
                Estimation: validated.estimation,
            },
        })

        // Create history entries for changes
        if (existingTask.Status !== task.Status) {
            await prisma.taskHistory.create({
                data: {
                    TaskID: task.TaskID,
                    ChangedBy: Number(session.user.id),
                    ChangeType: 'status_changed',
                    OldValue: existingTask.Status,
                    NewValue: task.Status,
                },
            })
        }

        if (existingTask.AssignedTo !== task.AssignedTo) {
            await prisma.taskHistory.create({
                data: {
                    TaskID: task.TaskID,
                    ChangedBy: Number(session.user.id),
                    ChangeType: 'assigned',
                    OldValue: existingTask.AssignedTo ? existingTask.AssignedTo.toString() : 'none',
                    NewValue: task.AssignedTo ? task.AssignedTo.toString() : 'none',
                },
            })
        }

        revalidatePath('/projects')
        revalidatePath('/my-tasks')
        revalidatePath(`/tasks/${taskId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.message }
        }
        console.error('Update task error:', error)
        return { error: 'Failed to update task' }
    }
}

export async function deleteTask(taskId: string) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.tasks.delete({
            where: { TaskID: Number(taskId) },
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
        const task = await prisma.tasks.findUnique({
            where: { TaskID: Number(taskId) },
            include: {
                TaskLists: {
                    select: { ListName: true },
                },
            },
        })

        if (!task) {
            return { error: 'Task not found' }
        }

        const newList = await prisma.taskLists.findUnique({
            where: { ListID: Number(newListId) },
            select: { ListName: true },
        })

        if (!newList) {
            return { error: 'List not found' }
        }

        // Update task list and position
        await prisma.tasks.update({
            where: { TaskID: Number(taskId) },
            data: {
                ListID: Number(newListId),
                Status: newList.ListName as 'Pending' | 'In Progress' | 'Completed',
                Position: newPosition,
            },
        })

        // Create history if list changed
        if (task.ListID !== Number(newListId)) {
            await prisma.taskHistory.create({
                data: {
                    TaskID: task.TaskID,
                    ChangedBy: Number(session.user.id),
                    ChangeType: 'moved',
                    OldValue: task.TaskLists.ListName,
                    NewValue: newList.ListName,
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

    const tasks = await prisma.tasks.findMany({
        where: {
            Status: {
                not: 'In Progress'
            },
            OR: [
                { AssignedTo: Number(session.user.id) },
                {
                    TaskLists: {
                        Projects: {
                            CreatedBy: Number(session.user.id)
                        }
                    }
                }
            ]
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
            Subtasks: {
                orderBy: {
                    CreatedAt: 'asc',
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
                UserID: Number(session.user.id),
                CommentText: commentText,
            },
        })

        revalidatePath(`/tasks/${taskId}`)
        return { success: true }
    } catch (error) {
        return { error: 'Failed to add comment' }
    }
}

export async function setTaskStatus(taskId: string, status: string) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const existingTask = await prisma.tasks.findUnique({
            where: { TaskID: Number(taskId) },
            include: {
                TaskLists: true
            }
        })

        if (!existingTask) {
            return { error: 'Task not found' }
        }

        // Find the target list in the same project based on the new status
        // Assuming list names match status names ('Pending', 'In Progress', 'Completed')
        const targetList = await prisma.taskLists.findFirst({
            where: {
                ProjectID: existingTask.TaskLists.ProjectID,
                ListName: status
            }
        })

        console.log('DEBUG: setTaskStatus', {
            taskId,
            newStatus: status,
            projectId: existingTask.TaskLists.ProjectID,
            foundTargetList: !!targetList,
            targetListId: targetList?.ListID,
            targetListName: targetList?.ListName
        })

        const updateData: any = { Status: status }

        // If a matching list exists, move the task to that list
        if (targetList) {
            updateData.ListID = targetList.ListID
        }

        const task = await prisma.tasks.update({
            where: { TaskID: Number(taskId) },
            data: updateData
        })

        // Create history
        await prisma.taskHistory.create({
            data: {
                TaskID: task.TaskID,
                ChangedBy: Number(session.user.id),
                ChangeType: 'status_changed',
                OldValue: existingTask.Status,
                NewValue: status,
            },
        })

        // Also track movement if list changed
        if (targetList && targetList.ListID !== existingTask.ListID) {
            await prisma.taskHistory.create({
                data: {
                    TaskID: task.TaskID,
                    ChangedBy: Number(session.user.id),
                    ChangeType: 'moved',
                    OldValue: existingTask.TaskLists.ListName,
                    NewValue: targetList.ListName,
                },
            })
        }

        revalidatePath('/projects')
        revalidatePath('/my-tasks')
        revalidatePath(`/tasks/${taskId}`)
        return { success: true }
    } catch (error) {
        console.error('Set status error:', error)
        return { error: 'Failed to update status' }
    }
}
