import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { Layout, CheckCircle2, AlertCircle, Activity } from 'lucide-react'

export const revalidate = 60

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch stats
    // Helper to get daily counts for the last 7 days (for sparklines)
    const getDailyCounts = async (model: any, dateField: string, where: any) => {
        const days = 7
        const data = []
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)

            const nextDate = new Date(date)
            nextDate.setDate(date.getDate() + 1)

            // For cumulative stats (Total Projects, Total Tasks), we count everything created BEFORE end of that day
            // For status-based stats (Completed), ideally we check history, but for MVP we'll use createdAt of completed taks
            const count = await model.count({
                where: {
                    ...where,
                    [dateField]: { lt: nextDate }
                }
            })
            data.push(count)
        }
        return data
    }

    // specific helper for overdue (snapshot based, hard to trace back exactly without history, we'll mock trends for overdue or use current)
    // For MVP, we'll just track creation of currently overdue tasks? No, that doesn't make sense.
    // We'll simulate overdue sparkline by checking due dates in the past.

    // 1. Projects Stats
    const totalProjects = await prisma.projects.count({ where: { CreatedBy: Number(user.id) } })
    const projectsData = await getDailyCounts(prisma.projects, 'CreatedAt', { CreatedBy: Number(user.id) })
    const projectsTrend = projectsData[0] > 0 ? Math.round(((totalProjects - projectsData[0]) / projectsData[0]) * 100) : 0

    // 2. Total Tasks Stats
    const totalTasks = await prisma.tasks.count({ where: { AssignedTo: Number(user.id) } })
    const tasksData = await getDailyCounts(prisma.tasks, 'CreatedAt', { AssignedTo: Number(user.id) })
    const tasksTrend = tasksData[0] > 0 ? Math.round(((totalTasks - tasksData[0]) / tasksData[0]) * 100) : 0

    // 3. Completed Tasks Stats
    const completedTasks = await prisma.tasks.count({
        where: { AssignedTo: Number(user.id), Status: 'Completed' }
    })
    // For completed trend, we ideally check TaskHistory for status changes to 'Completed'
    // Simplified: We'll count tasks that are currently completed and when they were created (not accurate but trend-ish)
    // Better: We'll fetch completed tasks and group by updated at (assuming completion is last update)
    // Even better for this scale: Just fetch all completed tasks and process in JS
    const allCompletedTasks = await prisma.tasks.findMany({
        where: { AssignedTo: Number(user.id), Status: 'Completed' },
        select: { CreatedAt: true } // Using CreatedAt as proxy if no completion date field. 
        // Actually, let's just use the same getDailyCounts logic on 'CreatedAt' for now to show "Knowledge Base Growth" style trend
    })
    // Re-using getDailyCounts logic for simplicity but filtering by Status=Completed
    const completedData = await getDailyCounts(prisma.tasks, 'CreatedAt', { AssignedTo: Number(user.id), Status: 'Completed' })
    const completedTrend = completedData[0] > 0 ? Math.round(((completedTasks - completedData[0]) / completedData[0]) * 100) : 0


    // 4. Overdue Tasks
    const overdueTasks = await prisma.tasks.count({
        where: {
            AssignedTo: Number(user.id),
            Status: { not: 'Completed' },
            DueDate: { lt: new Date() }
        }
    })
    // For overdue sparkline, we can show count of tasks due in the last 7 days that are NOT completed
    // This isn't "history of overdue count", but "distribution of overdue dates"
    const overdueData = [] // mock for now or complex query
    for (let i = 0; i < 7; i++) overdueData.push(Math.round(Math.random() * 5)) // Placeholder for overdue volatility

    // Fetch recent activity (Task History)
    const recentActivity = await prisma.taskHistory.findMany({
        where: {
            OR: [
                { ChangedBy: Number(user.id) },
                { Tasks: { AssignedTo: Number(user.id) } }
            ]
        },
        take: 5,
        orderBy: { ChangeTime: 'desc' },
        include: {
            Tasks: {
                select: { Title: true }
            },
            Users: {
                select: { UserName: true }
            }
        }
    })

    // 5. Status Distribution (for Doughnut Chart)
    const statusDistribution = await prisma.tasks.groupBy({
        by: ['Status'],
        where: {
            OR: [
                { AssignedTo: Number(user.id) },
                {
                    TaskLists: {
                        Projects: {
                            CreatedBy: Number(user.id)
                        }
                    }
                }
            ]
        },
        _count: {
            Status: true // Count tasks in each status
        }
    })

    console.log('DEBUG: User ID:', user.id)
    console.log('DEBUG: Status Distribution:', statusDistribution)

    // Map database statuses to chart friendly format with colors
    const statusColors: Record<string, string> = {
        'Pending': '#eab308', // Yellow-500
        'In Progress': '#3b82f6', // Blue-500
        'Completed': '#22c55e', // Green-500
        'Overdue': '#ef4444', // Red-500 - Note: Status might not be 'Overdue', checklogic
        'High': '#a855f7' // Purple - fallback
    }

    const chartData = statusDistribution.map((item) => ({
        name: item.Status,
        value: item._count.Status,
        color: statusColors[item.Status] || '#94a3b8' // Slate-400 fallback
    }))


    const stats = [
        {
            label: 'Total Projects',
            value: totalProjects,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: `${projectsTrend > 0 ? '+' : ''}${projectsTrend}%`,
            trendUp: projectsTrend >= 0,
            chartData: projectsData.map(d => totalProjects > 0 ? (d / totalProjects) * 100 : 0) // Normalize for sparkline height
        },
        {
            label: 'Total Tasks',
            value: totalTasks,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            trend: `${tasksTrend > 0 ? '+' : ''}${tasksTrend}%`,
            trendUp: tasksTrend >= 0,
            chartData: tasksData.map(d => totalTasks > 0 ? (d / totalTasks) * 100 : 0)
        },
        {
            label: 'Completed',
            value: completedTasks,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            trend: `${completedTrend > 0 ? '+' : ''}${completedTrend}%`,
            trendUp: completedTrend >= 0,
            chartData: completedData.map(d => completedTasks > 0 ? (d / completedTasks) * 100 : 0)
        },
        {
            label: 'Overdue',
            value: overdueTasks,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            trend: '+1', // Keep hardcoded or Implement complex logic later
            trendUp: false,
            chartData: [10, 15, 10, 20, 15, 10, 5] // Keep hardcoded for now
        },
    ]

    return (
        <DashboardView
            stats={stats}
            recentActivity={recentActivity}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            statusData={chartData}
        />
    )
}
