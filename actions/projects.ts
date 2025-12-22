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

        const project = await prisma.projects.create({
            data: {
                ProjectName: validated.projectName,
                Description: validated.description,
                CreatedBy: parseInt((session.user as any).id),
                TaskLists: {
                    create: [
                        { ListName: 'Pending' },
                        { ListName: 'In Progress' },
                        { ListName: 'Completed' },
                    ],
                },
            },
        })

        revalidatePath('/projects')
        return { success: true, projectId: project.ProjectID }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.message }
        }
        console.error('Error creating project:', error)
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

        await prisma.projects.update({
            where: { ProjectID: parseInt(projectId) },
            data: {
                ProjectName: validated.projectName,
                Description: validated.description,
            },
        })

        revalidatePath('/projects')
        revalidatePath(`/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.message }
        }
        console.error('Error updating project:', error)
        return { error: 'Failed to update project' }
    }
}

export async function deleteProject(projectId: string) {
    const session = await auth()
    if (!session?.user) {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.projects.delete({
            where: { ProjectID: parseInt(projectId) },
        })

        revalidatePath('/projects')
        return { success: true }
    } catch (error) {
        console.error('Error deleting project:', error)
        return { error: 'Failed to delete project' }
    }
}

export async function getProjects() {
    const session = await auth()
    if (!session?.user) {
        return []
    }

    const isAdminOrManager = (session.user as any).roles?.some((role: string) =>
        ['Admin', 'Manager'].includes(role)
    )

    const whereClause: any = {}
    if (!isAdminOrManager) {
        whereClause.CreatedBy = parseInt((session.user as any).id)
    }

    const projects = await prisma.projects.findMany({
        where: whereClause,
        include: {
            Users: {
                select: {
                    UserName: true,
                },
            },
            TaskLists: {
                include: {
                    _count: {
                        select: {
                            Tasks: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            CreatedAt: 'desc',
        },
    })

    return projects
}

export async function getProject(projectId: string) {
    const session = await auth()
    if (!session?.user) {
        return null
    }

    console.log('[getProject] Querying for ProjectID:', projectId, 'CreatedBy:', (session.user as any).id)

    const isAdminOrManager = (session.user as any).roles?.some((role: string) =>
        ['Admin', 'Manager'].includes(role)
    )

    const whereClause: any = {
        ProjectID: parseInt(projectId),
    }

    if (!isAdminOrManager) {
        whereClause.CreatedBy = parseInt((session.user as any).id)
    }

    const project = await prisma.projects.findFirst({
        where: whereClause,
        include: {
            Users: {
                select: {
                    UserID: true,
                    UserName: true,
                    Email: true,
                },
            },
            TaskLists: {
                include: {
                    Tasks: {
                        include: {
                            Users: {
                                select: {
                                    UserID: true,
                                    UserName: true,
                                },
                            },
                        },
                        orderBy: {
                            CreatedAt: 'desc',
                        },
                    },
                },
                orderBy: {
                    ListID: 'asc',
                },
            },
        },
    })

    return project
}
