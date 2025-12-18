import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/next-auth'

export async function GET() {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get task status distribution
    const statusStats = await prisma.task.groupBy({
        by: ['status'],
        _count: true,
    })

    const statusDistribution = statusStats.map(stat => ({
        name: stat.status,
        value: stat._count,
    }))

    // Get task priority distribution
    const priorityStats = await prisma.task.groupBy({
        by: ['priority'],
        _count: true,
    })

    const priorityDistribution = priorityStats.map(stat => ({
        name: stat.priority,
        value: stat._count,
    }))

    // Get project stats
    const projects = await prisma.project.findMany({
        include: {
            _count: {
                select: {
                    taskLists: true,
                },
            },
            taskLists: {
                include: {
                    _count: {
                        select: {
                            tasks: true,
                        },
                    },
                },
            },
        },
        take: 10,
    })

    const projectStats = projects.map(project => ({
        name: project.projectName.length > 20 ? project.projectName.substring(0, 20) + '...' : project.projectName,
        tasks: project.taskLists.reduce((sum, list) => sum + list._count.tasks, 0),
    }))

    // Get user workload
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: {
                    assignedTasks: true,
                },
            },
        },
        take: 10,
    })

    const userWorkload = users
        .filter(user => user._count.assignedTasks > 0)
        .map(user => ({
            name: user.name || user.username,
            tasks: user._count.assignedTasks,
        }))

    return NextResponse.json({
        statusDistribution,
        priorityDistribution,
        projectStats,
        userWorkload,
    })
}
