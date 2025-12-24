import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/next-auth'

export async function GET() {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Task Status Distribution
        const statusStats = await prisma.tasks.groupBy({
            by: ['Status'],
            _count: true,
        })
        const statusDistribution = statusStats.map(stat => ({
            name: stat.Status,
            value: stat._count,
        }))

        // 2. Task Priority Distribution
        const priorityStats = await prisma.tasks.groupBy({
            by: ['Priority'],
            _count: true,
        })
        const priorityDistribution = priorityStats.map(stat => ({
            name: stat.Priority,
            value: stat._count,
        }))

        // 3. Project Stats (Top 5 by task count)
        const projects = await prisma.projects.findMany({
            include: {
                TaskLists: {
                    include: {
                        Tasks: true
                    }
                }
            },
            take: 10,
        })

        const projectStats = projects.map(proj => {
            const taskCount = proj.TaskLists.reduce((acc, list) => acc + list.Tasks.length, 0)
            return {
                name: proj.ProjectName,
                tasks: taskCount
            }
        }).sort((a, b) => b.tasks - a.tasks).slice(0, 5)

        // 4. User Workload
        const users = await prisma.users.findMany({
            include: {
                Tasks: true // Tasks assigned to this user
            },
            take: 10,
        })

        const userWorkload = users
            .filter(u => u.Tasks.length > 0)
            .map(u => ({
                name: u.UserName,
                tasks: u.Tasks.length,
            }))
            .sort((a, b) => b.tasks - a.tasks)
            .slice(0, 5)

        // 5. Activity Over Time (Last 7 Days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const history = await prisma.taskHistory.findMany({
            where: {
                ChangeTime: {
                    gte: sevenDaysAgo
                },
                OR: [
                    { ChangeType: 'created' },
                    { ChangeType: 'status_changed', NewValue: 'Completed' }
                ]
            }
        })

        // Initialize last 7 days data
        const activityMap = new Map()
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }) // e.g., "Mon"
            // Use ISO string date part for uniqueness if needed, but weekday is fine for simple view
            // Better to use a standard key and format for display
            activityMap.set(dateStr, { name: dateStr, completed: 0, added: 0 })
        }

        history.forEach(h => {
            const dayName = new Date(h.ChangeTime).toLocaleDateString('en-US', { weekday: 'short' })
            if (activityMap.has(dayName)) {
                const entry = activityMap.get(dayName)
                if (h.ChangeType === 'created') {
                    entry.added++
                } else if (h.ChangeType === 'status_changed' && h.NewValue === 'Completed') {
                    entry.completed++
                }
            }
        })

        const activityData = Array.from(activityMap.values())

        return NextResponse.json({
            statusDistribution,
            priorityDistribution,
            projectStats,
            userWorkload,
            activityData
        })

    } catch (error) {
        console.error('Reports API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }
}
