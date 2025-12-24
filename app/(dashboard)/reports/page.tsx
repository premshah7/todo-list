'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
    Briefcase, CheckCircle2, TrendingUp, AlertCircle,
    Calendar, Users, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'



export default function ReportsPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/reports/stats')
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Failed to fetch stats')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Activity className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        )
    }

    // Colors for charts
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

    // Calculate totals for KPIs
    const totalProjects = stats?.projectStats?.length || 0
    const totalTasks = stats?.statusDistribution?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0
    const completedTasks = stats?.statusDistribution?.find((s: any) => s.name === 'COMPLETED' || s.name === 'DONE' || s.name === 'Completed')?.value || 0
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your team's performance and project health.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Calendar className="h-4 w-4" />
                    <span>Last 7 Days</span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Projects"
                    value={totalProjects}
                    icon={Briefcase}
                    trend="+2 this week"
                    trendUp={true}
                    color="text-blue-500"
                />
                <KPICard
                    title="Active Tasks"
                    value={totalTasks}
                    icon={CheckCircle2}
                    trend="12 due soon"
                    trendUp={false} // usage as alert
                    color="text-emerald-500"
                />
                <KPICard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    icon={TrendingUp}
                    trend="+5% vs last week"
                    trendUp={true}
                    color="text-violet-500"
                />
                <KPICard
                    title="Team Members"
                    value={stats?.userWorkload?.length || 0}
                    icon={Users}
                    trend="Active today"
                    trendUp={true}
                    color="text-orange-500"
                />
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Activity Area Chart (Span 2) */}
                <Card className="lg:col-span-2 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle>Task Activity</CardTitle>
                        <CardDescription>Work completed vs new tasks assigned</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.activityData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <CartesianGrid vertical={false} stroke="#262626" strokeDasharray="3 3" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e5e5e5' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
                                <Area type="monotone" dataKey="added" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdded)" name="New Tasks" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status Donut Chart */}
                <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                        <CardDescription>Distribution across all projects</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center relative">
                        {/* Center Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold">{totalTasks}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Tasks</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.statusDistribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(stats?.statusDistribution || []).map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e5e5e5' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Team Workload */}
                <Card className="lg:col-span-3 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle>Team Workload</CardTitle>
                        <CardDescription>Active tasks per member</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.userWorkload || []} layout="horizontal" margin={{ top: 20 }}>
                                <CartesianGrid vertical={false} stroke="#262626" strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e5e5e5' }}
                                />
                                <Bar dataKey="tasks" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40}>
                                    {
                                        (stats?.userWorkload || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function KPICard({ title, value, icon: Icon, trend, trendUp, color }: any) {
    return (
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl hover:bg-white/5 transition-colors duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg bg-white/5 ${color} bg-opacity-10`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {trend}
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
