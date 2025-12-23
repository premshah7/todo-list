import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import { KanbanBoard } from '@/components/kanban-board'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeft, CheckCircle2, AlertCircle, Users, Layout, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

import { getCurrentUser } from '@/lib/auth'

export const revalidate = 60

import { RightPanel } from '@/components/layout/right-panel'

// Simple Sparkline Component
function Sparkline({ data, color }: { data: number[], color: string }) {
    return (
        <div className="flex items-end gap-[2px] h-8 w-16">
            {data.map((h, i) => (
                <div
                    key={i}
                    className={cn("w-full opacity-60 rounded-t-sm", color.replace('text-', 'bg-'))}
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>
    )
}

export default async function ProjectBoardPage({
    params,
    searchParams,
}: {
    params: Promise<{ projectId: string }>
    searchParams: Promise<{ search?: string; filter?: string }>
}) {
    const { projectId } = await params
    const { search, filter } = await searchParams
    const currentUser = await getCurrentUser()

    console.log('[ProjectBoardPage] Rendering for projectId:', projectId)
    const project = await getProject(projectId)
    console.log('[ProjectBoardPage] getProject result:', project ? `Found project ${project.ProjectID}` : 'null')

    if (!project) {
        notFound()
    }

    const taskLists = project.TaskLists.map(list => {
        let tasks = list.Tasks.map(task => ({
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

        // Apply filters
        if (search) {
            tasks = tasks.filter(task =>
                task.title.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (filter === 'My Tasks' && currentUser) {
            tasks = tasks.filter(task =>
                task.assignedTo?.username === currentUser.username
            )
        } else if (filter === 'High') {
            tasks = tasks.filter(task => task.priority === 'High')
        }

        return {
            id: list.ListID.toString(),
            listName: list.ListName,
            tasks
        }
    })

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
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: '+12%',
            trendUp: true,
            chartData: [40, 60, 45, 70, 85, 60, 75]
        },
        {
            label: 'Completed',
            value: completedTasks,
            icon: CheckCircle2,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            trend: '+5%',
            trendUp: true,
            chartData: [20, 30, 40, 35, 50, 45, 60]
        },
        {
            label: 'Overdue',
            value: overdueTasks,
            icon: AlertCircle,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            trend: '-2%',
            trendUp: false,
            chartData: [10, 15, 10, 20, 15, 10, 5]
        },
        {
            label: 'Active Users',
            value: activeUsers,
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            trend: '+1',
            trendUp: true,
            chartData: [60, 65, 70, 75, 70, 80, 85]
        },
    ]

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 p-8 pr-12 xl:mr-80 transition-all duration-300">
                <div className="h-full flex flex-col">
                    {/* Header Section */}
                    <div className="flex flex-col gap-8 mb-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Link href="/projects" className="text-muted-foreground hover:text-white transition-colors">
                                        <span className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
                                            <ArrowLeft className="w-3 h-3" /> Projects
                                        </span>
                                    </Link>
                                    <span className="text-white/20">/</span>
                                    <span className="text-xs uppercase tracking-wider font-semibold text-primary glow-text-sm">Board</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white tracking-tight text-glow">{project.ProjectName}</h1>
                            </div>
                            <Link href={`/projects/${project.ProjectID}/tasks/new`}>
                                <Button className="rounded-xl h-11 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all bg-primary text-white border-0 font-semibold tracking-wide">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Task
                                </Button>
                            </Link>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {stats.map((stat) => (
                                <div key={stat.label} className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/5 hover:border-primary/50 hover:bg-[#202025] transition-all group relative overflow-hidden">
                                    {/* Glow Effect */}
                                    <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity", stat.bg.replace('/10', ''))} />

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                                            <stat.icon className={cn("w-5 h-5", stat.color)} />
                                        </div>
                                        <Sparkline data={stat.chartData} color={stat.color} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-end gap-2 mb-1">
                                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                                            <div className={cn("flex items-center gap-0.5 text-[10px] font-bold mb-1.5 px-1.5 py-0.5 rounded-full bg-black/20", stat.trendUp ? "text-green-400" : "text-red-400")}>
                                                <TrendingUp className={cn("w-3 h-3", !stat.trendUp && "rotate-180")} />
                                                {stat.trend}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
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
            </div>

            {/* Right Panel */}
            <RightPanel />
        </div>
    )
}
