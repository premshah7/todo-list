import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import { KanbanBoard } from '@/components/kanban-board'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeft, CheckCircle2, AlertCircle, Users, Layout, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export const revalidate = 60

export default async function ProjectBoardPage({
    params,
}: {
    params: Promise<{ projectId: string }>
}) {
    const { projectId } = await params
    console.log('[ProjectBoardPage] Rendering for projectId:', projectId)
    const project = await getProject(projectId)
    console.log('[ProjectBoardPage] getProject result:', project ? `Found project ${project.ProjectID}` : 'null')

    if (!project) {
        notFound()
    }

    const taskLists = project.TaskLists.map(list => ({
        id: list.ListID.toString(),
        listName: list.ListName,
        tasks: list.Tasks.map(task => ({
            id: task.TaskID.toString(),
            title: task.Title,
            description: task.Description,
            priority: task.Priority,
            status: task.Status,
            dueDate: task.DueDate,
            assignedTo: task.Users ? {
                username: task.Users.UserName,
                name: task.Users.UserName
            } : null
        }))
    }))

    // Calculate stats
    const totalTasks = taskLists.reduce((acc, list) => acc + list.tasks.length, 0)
    const completedTasks = taskLists.find(l => l.listName === 'Completed')?.tasks.length || 0
    // Mocking other stats for visual demo as they require more complex backend queries
    const overdueTasks = 2
    const activeUsers = 4

    const stats = [
        {
            label: 'Total Tasks',
            value: totalTasks,
            icon: Layout,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            trend: '+12%',
            trendUp: true
        },
        {
            label: 'Completed',
            value: completedTasks,
            icon: CheckCircle2,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
            trend: '+5%',
            trendUp: true
        },
        {
            label: 'Overdue',
            value: overdueTasks,
            icon: AlertCircle,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            trend: '-2%',
            trendUp: false
        },
        {
            label: 'Active Users',
            value: activeUsers,
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            trend: '+1',
            trendUp: true
        },
    ]

    return (
        <div className="p-8 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/projects" className="text-muted-foreground hover:text-white transition-colors">
                                <span className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
                                    <ArrowLeft className="w-3 h-3" /> Projects
                                </span>
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-xs uppercase tracking-wider font-semibold text-primary">Board</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{project.ProjectName}</h1>
                    </div>
                    <Link href={`/projects/${project.ProjectID}/tasks/new`}>
                        <Button className="rounded-xl h-10 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                            <Plus className="h-4 w-4 mr-2" />
                            New Task
                        </Button>
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-start justify-between mb-2">
                                <div className={cn("p-2 rounded-xl", stat.bg)}>
                                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                                </div>
                                <div className={cn("flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/5", stat.trendUp ? "text-green-400" : "text-red-400")}>
                                    <TrendingUp className={cn("w-3 h-3", !stat.trendUp && "rotate-180")} />
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
                                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 min-h-0">
                <KanbanBoard taskLists={taskLists} projectId={project.ProjectID.toString()} />
            </div>
        </div>
    )
}
