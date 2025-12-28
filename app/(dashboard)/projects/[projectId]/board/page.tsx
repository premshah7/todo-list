import { getProject } from '@/actions/projects'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { BoardView } from '@/components/projects/board-view'

// Revalidate project data every minute
export const revalidate = 60

export default async function BoardPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params
    const project = await getProject(projectId)

    if (!project) {
        notFound()
    }

    // Fetch recent activities for this project
    const activities = await prisma.taskHistory.findMany({
        where: {
            Tasks: {
                TaskLists: {
                    ProjectID: parseInt(projectId)
                }
            }
        },
        include: {
            Users: true,
            Tasks: true
        },
        orderBy: {
            ChangeTime: 'desc'
        },
        take: 20
    })

    // Calculate Stats
    const allTasks = project.TaskLists.flatMap((list: any) => list.Tasks) || []
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((t: any) => t.Status === 'Completed').length
    const uniqueMembers = new Set([
        project.CreatedBy,
        ...(project.ProjectMembers?.map((m: any) => m.UserID) || []),
        ...allTasks.map((t: any) => t.AssignedTo).filter(Boolean)
    ])
    const teamSize = uniqueMembers.size

    const stats = [
        {
            label: 'Total Tasks',
            value: totalTasks.toString(),
            trend: '+0%', // Dynamic trend requires historical data, using placeholder
            trendUp: true,
            chartData: [40, 55, 45, 60, 50, 65, totalTasks > 0 ? totalTasks * 2 : 10],
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            iconKey: 'total',
        },
        {
            label: 'Completed',
            value: completedTasks.toString(),
            trend: completedTasks > 0 ? '+10%' : '0%',
            trendUp: true,
            chartData: [20, 30, 25, 35, 30, 45, completedTasks > 0 ? completedTasks * 2 : 5],
            color: 'text-green-400',
            bg: 'bg-green-400/10',
            iconKey: 'completed',
        },
        {
            label: 'Team Members',
            value: teamSize.toString(),
            trend: '+0%',
            trendUp: true,
            chartData: [2, 2, 3, 3, 3, 4, 4],
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            iconKey: 'team',
        }
    ]

    return (
        <BoardView
            project={project}
            taskLists={project.TaskLists.filter((list: any) => list.ListName !== 'In Progress')}
            activities={activities}
            stats={stats}
            taskStats={{
                total: totalTasks,
                completed: completedTasks
            }}
        />
    )
}
