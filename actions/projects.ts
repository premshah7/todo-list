'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const projectSchema = z.object({
    projectName: z.string().min(1).max(100),
    description: z.string().optional(),
})

export async function createProject(formData: FormData) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const data = {
            projectName: formData.get('projectName') as string,
            description: formData.get('description') as string,
        }

        const validated = projectSchema.parse(data)

        const project = await prisma.project.create({
            data: {
                ...validated,
                createdById: (session.user as any).id,
                members: {
                    create: {
                        userId: (session.user as any).id,
                        role: 'Owner',
                    },
                },
                taskLists: {
                    create: [
                        { listName: 'Pending', position: 0 },
                        { listName: 'In Progress', position: 1 },
                        { listName: 'Completed', position: 2 },
                    ],
                },
            },
        })

        revalidatePath('/projects')
        return { success: true, projectId: project.id }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        }
        return { error: 'Failed to create project' }
    }
}

export async function updateProject(projectId: string, formData: FormData) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        const data = {
            projectName: formData.get('projectName') as string,
            description: formData.get('description') as string,
        }

        const validated = projectSchema.parse(data)

        await prisma.project.update({
            where: { id: projectId },
            data: validated,
        })

        revalidatePath('/projects')
        revalidatePath(`/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        }
        return { error: 'Failed to update project' }
    }
}

export async function deleteProject(projectId: string) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.project.delete({
            where: { id: projectId },
        })

        revalidatePath('/projects')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to delete project' }
    }
}

export async function getProjects() {
    const session = await auth()
    if (!session?.user) {
        return []
    }

    const projects = await prisma.project.findMany({
        where: {
            members: {
                some: {
                    userId: (session.user as any).id,
                },
            },
        },
        include: {
            createdBy: {
                select: {
                    username: true,
                    name: true,
                },
            },
            _count: {
                select: {
                    members: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return projects
}

export async function getProject(projectId: string) {
    const session = await auth()
    if (!session?.user) {
        return null
    }

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            members: {
                some: {
                    userId: (session.user as any).id,
                },
            },
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                },
            },
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            taskLists: {
                include: {
                    tasks: {
                        include: {
                            assignedTo: {
                                select: {
                                    id: true,
                                    username: true,
                                    name: true,
                                },
                            },
                        },
                        orderBy: {
                            position: 'asc',
                        },
                    },
                },
                orderBy: {
                    position: 'asc',
                },
            },
        },
    })

    return project
}
