"use client"

import { useState } from "react"
import Link from 'next/link'
import { formatDate, cn } from '@/lib/utils'
import { Layout, CheckCircle2, AlertCircle, TrendingUp, Plus, ArrowRight, Activity, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { RightPanel } from '@/components/layout/right-panel'
import { StatusDoughnut } from '@/components/dashboard/status-doughnut'

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

interface DashboardViewProps {
    stats: any[]
    recentActivity: any[]
    totalTasks: number
    completedTasks: number
    statusData: any[]
}

export function DashboardView({ stats, recentActivity, totalTasks, completedTasks, statusData = [] }: DashboardViewProps) {
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)

    return (
        <div className="flex min-h-screen relative overflow-hidden">
            <div
                className={cn(
                    "flex-1 p-8 transition-all duration-300 ease-in-out",
                    isRightPanelOpen ? "xl:mr-80 pr-12" : "mr-0 pr-8"
                )}
            >
                <div className="max-w-7xl mx-auto h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-10 flex justify-between items-end">
                        <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Overview</p>
                            <h1 className="text-4xl font-bold text-white tracking-tight text-glow">Dashboard</h1>
                        </div>

                        {!isRightPanelOpen && (
                            <button
                                onClick={() => setIsRightPanelOpen(true)}
                                className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-muted-foreground hover:text-white transition-colors border border-white/5"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-muted-foreground">Show Activity</span>
                            </button>
                        )}
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        {stats.map((stat) => {
                            let Icon = Activity
                            if (stat.label === 'Total Projects') Icon = Layout
                            if (stat.label === 'Total Tasks') Icon = CheckCircle2
                            if (stat.label === 'Completed') Icon = Activity
                            if (stat.label === 'Overdue') Icon = AlertCircle

                            return (
                                <div key={stat.label} className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/5 hover:border-primary/50 hover:bg-[#202025] transition-all group relative overflow-hidden">
                                    {/* Glow Effect */}
                                    <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity", stat.bg.replace('/10', ''))} />

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                                            <Icon className={cn("w-5 h-5", stat.color)} />
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
                            )
                        })}
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 items-start">
                        {/* Chart Section */}
                        <div className="lg:col-span-1 h-full">
                            <StatusDoughnut data={statusData} />
                        </div>

                        {/* Recent Activity & Quick Actions */}
                        <div className="lg:col-span-2 grid grid-cols-1 gap-8">
                            {/* Recent Activity (Mobile/Tablet fallback or just distinct section) */}
                            <div className="rounded-2xl bg-[#16181f] border border-white/5 p-6 flex flex-col min-h-[300px]">
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
                                                            <span className="text-primary">{activity.Users.UserName}</span> {activity.ChangeType.toLowerCase().includes('status') ? `moved task to ${activity.NewValue}` : 'updated task'}
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Link href="/projects/new" className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-blue-100">New Project</span>
                                        </div>
                                    </Link>

                                    <Link href="/my-tasks" className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 hover:from-green-500/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-green-100">My Tasks</span>
                                        </div>
                                    </Link>

                                    <Link href="/reports" className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-purple-100">Reports</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <RightPanel
                activities={recentActivity}
                taskStats={{ total: totalTasks, completed: completedTasks }}
                isOpen={isRightPanelOpen}
                onToggle={() => setIsRightPanelOpen(!isRightPanelOpen)}
            />
        </div>
    )
}
