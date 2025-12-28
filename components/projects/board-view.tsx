"use client"

import { useState } from 'react'
import { KanbanBoard } from '@/components/kanban-board'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeft, CheckCircle2, AlertCircle, Users, Layout, TrendingUp, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RightPanel } from '@/components/layout/right-panel'
import { CompleteProjectButton } from '@/components/projects/complete-project-button'
import { TeamButton } from '@/components/project/team-button'
import { ThemeToggle } from '@/components/theme-toggle'

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

interface BoardViewProps {
    project: any
    taskLists: any[]
    activities: any[]
    stats: any[]
    taskStats: {
        total: number
        completed: number
    }
}

const ICON_MAP: Record<string, any> = {
    'total': Layout,
    'completed': CheckCircle2,
    'inprogress': AlertCircle,
    'team': Users
}

export function BoardView({ project, taskLists, activities, stats, taskStats }: BoardViewProps) {
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)

    return (
        <div className="flex min-h-screen relative overflow-hidden bg-background transition-colors duration-300">
            <div className={cn(
                "flex-1 p-8 pr-12 transition-all duration-300 ease-in-out",
                isRightPanelOpen ? "xl:mr-80" : "mr-0"
            )}>
                <div className="h-full flex flex-col">
                    {/* Header Section */}
                    <div className="flex flex-col gap-8 mb-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                                        <span className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
                                            <ArrowLeft className="w-3 h-3" /> Projects
                                        </span>
                                    </Link>
                                    <span className="text-muted-foreground/40">/</span>
                                    <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">Board</span>
                                </div>
                                <h1 className="text-3xl font-bold text-foreground tracking-tight">{project.ProjectName}</h1>
                            </div>
                            <div className="flex gap-3">
                                <ThemeToggle />
                                <TeamButton projectId={project.ProjectID.toString()} />
                                <CompleteProjectButton projectId={project.ProjectID.toString()} isCompleted={project.Status === 'Completed'} />
                                <Link href={`/projects/${project.ProjectID}/tasks/new`}>
                                    <Button className="rounded-xl h-11 px-6 shadow-sm hover:shadow-md transition-shadow bg-indigo-600 hover:bg-indigo-700 text-white border-0 font-medium">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Task
                                    </Button>
                                </Link>

                                {/* Toggle Button when panel is closed */}
                                {!isRightPanelOpen && (
                                    <Button
                                        onClick={() => setIsRightPanelOpen(true)}
                                        variant="outline"
                                        size="icon"
                                        className="rounded-xl h-11 w-11 border-border shadow-sm hover:bg-muted"
                                        title="Show Activity Panel"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat) => {
                                const Icon = ICON_MAP[stat.iconKey] || Layout
                                return (
                                    <div key={stat.label} className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={cn("p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-muted dark:text-indigo-400", stat.bg)}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <Sparkline data={stat.chartData} color={stat.color} />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-end gap-2 mb-1">
                                                <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                                                <div className={cn("flex items-center gap-0.5 text-xs font-semibold mb-1.5 px-2 py-0.5 rounded-full", stat.trendUp ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "text-red-500 bg-red-50 dark:bg-red-950/30")}>
                                                    <TrendingUp className={cn("w-3 h-3", !stat.trendUp && "rotate-180")} />
                                                    {stat.trend}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Kanban Board */}
                    <div className="flex-1 min-h-0">
                        <KanbanBoard taskLists={taskLists} projectId={project.ProjectID.toString()} />
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <RightPanel
                activities={activities}
                taskStats={taskStats}
                isOpen={isRightPanelOpen}
                onToggle={() => setIsRightPanelOpen(!isRightPanelOpen)}
            />
        </div>
    )
}
