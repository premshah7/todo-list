import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatDate, cn } from '@/lib/utils'
import { Layout, CheckCircle2, AlertCircle, Users, TrendingUp, Plus, ArrowRight, Activity, Zap } from 'lucide-react'
import { RightPanel } from '@/components/layout/right-panel'

export const revalidate = 60

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

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch stats
    const totalProjects = await prisma.projects.count({
        where: { CreatedBy: Number(user.id) }
    })

    const totalTasks = await prisma.tasks.count({
        where: { AssignedTo: Number(user.id) }
    })

    const completedTasks = await prisma.tasks.count({
        where: {
            AssignedTo: Number(user.id),
            Status: 'Completed'
        }
    })

    const overdueTasks = await prisma.tasks.count({
        where: {
            AssignedTo: Number(user.id),
            Status: { not: 'Completed' },
            DueDate: { lt: new Date() }
        }
    })

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

    const stats = [
        {
            label: 'Total Projects',
            value: totalProjects,
            icon: Layout,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: '+12%',
            trendUp: true,
            chartData: [40, 60, 45, 70, 85, 60, 75]
        },
        {
            label: 'Total Tasks',
            value: totalTasks,
            icon: CheckCircle2,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            trend: '+5%',
            trendUp: true,
            chartData: [20, 30, 40, 35, 50, 45, 60]
        },
        {
            label: 'Completed',
            value: completedTasks,
            icon: Activity,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            trend: '+8%',
            trendUp: true,
            chartData: [30, 45, 40, 50, 60, 55, 70]
        },
        {
            label: 'Overdue',
            value: overdueTasks,
            icon: AlertCircle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            trend: '+1',
            trendUp: false,
            chartData: [10, 15, 10, 20, 15, 10, 5]
        },
    ]

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 p-8 pr-12 xl:mr-80 transition-all duration-300">
                <div className="max-w-7xl mx-auto h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-10">
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Overview</p>
                        <h1 className="text-4xl font-bold text-white tracking-tight text-glow">Dashboard</h1>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
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

                    {/* Recent Activity & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                        {/* Recent Activity */}
                        <div className="rounded-2xl bg-[#16181f] border border-white/5 p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary" />
                                    Recent Activity
                                </h2>
                                <Link href="/reports" className="text-xs text-primary hover:text-white transition-colors">View All</Link>
                            </div>

                            <div className="flex-1 space-y-4">
                                {recentActivity.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground/40">
                                        <Activity className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-sm">No recent activity</p>
                                    </div>
                                ) : (
                                    recentActivity.map((activity) => (
                                        <div key={activity.HistoryID} className="relative pl-6 group">
                                            {/* Timeline Line */}
                                            <div className="absolute left-[3px] top-2 bottom-0 w-[1px] bg-white/5 group-last:bg-transparent" />
                                            <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-125 transition-all" />

                                            <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm text-gray-200 font-medium">
                                                        <span className="text-primary">{activity.Users.UserName}</span> {activity.ChangeType.toLowerCase()}
                                                    </p>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(activity.ChangeTime)}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    task <span className="text-gray-300 font-medium">"{activity.Tasks.Title}"</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-2xl bg-[#16181f] border border-white/5 p-6 h-fit">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                <Link href="/projects/new" className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-blue-100">Create New Project</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                                </Link>

                                <Link href="/my-tasks" className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 hover:from-green-500/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-green-100">View My Tasks</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                                </Link>

                                <Link href="/reports" className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-purple-100">View Reports</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <RightPanel />
        </div>
    )
}
