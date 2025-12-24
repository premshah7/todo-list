"use client"

import { Clock, CheckCircle2, MessageSquare, ArrowRight, Edit, Trash2, ChevronRight } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

interface Activity {
    HistoryID: number
    Action: string // e.g., "moved", "commented", "completed" (mapped from ChangeType or implicit)
    Target: string // Task Title
    Time: Date
    User: {
        name: string
        initial: string
        color: string
    }
}

interface RightPanelProps {
    activities: any[] // We'll map the raw Prisma result to a cleaner interface in the parent or here
    taskStats: {
        total: number
        completed: number
    }
    isOpen?: boolean
    onToggle?: () => void
}

export function RightPanel({ activities = [], taskStats = { total: 0, completed: 0 }, isOpen = true, onToggle }: RightPanelProps) {
    const progress = taskStats.total > 0
        ? Math.round((taskStats.completed / taskStats.total) * 100)
        : 0

    // Helper to format activity for display
    const mappedActivities = activities.map(activity => {
        // Simple heuristic for color based on user name length/char code to be consistent but "random"
        const name = activity.Users.UserName
        const colors = [
            "from-pink-500 to-rose-500",
            "from-blue-500 to-cyan-500",
            "from-primary to-violet-600",
            "from-green-500 to-emerald-500",
            "from-orange-500 to-amber-500"
        ]
        const colorIndex = name.charCodeAt(0) % colors.length

        // ... (rest of mapping logic is same)
        let actionText = "updated"
        let icon = Edit

        const changeType = activity.ChangeType.toLowerCase()
        if (changeType.includes("status") && activity.NewValue === "Completed") {
            actionText = "completed"
            icon = CheckCircle2
        } else if (changeType.includes("comment")) {
            actionText = "commented on"
            icon = MessageSquare
        } else if (changeType.includes("status")) {
            actionText = `moved to ${activity.NewValue}`
            icon = ArrowRight
        }

        return {
            id: activity.HistoryID,
            user: {
                name: name,
                initial: name.charAt(0).toUpperCase(),
                color: colors[colorIndex]
            },
            action: actionText,
            target: activity.Tasks.Title,
            time: formatDate(activity.ChangeTime),
            icon: icon
        }
    })

    return (
        <aside
            className={cn(
                "hidden xl:flex flex-col w-80 fixed right-0 top-0 h-screen bg-[#0f1117] border-l border-white/5 p-6 pt-24 z-40 transition-transform duration-300 ease-in-out",
                !isOpen && "translate-x-full"
            )}
        >
            {/* Header with Close Button */}
            <div className="absolute top-6 right-6 z-30">
                <button
                    onClick={onToggle}
                    className="p-1 rounded-md text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                    title="Close Sidebar"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Team Activity Section */}
            <div className="mb-8 flex-1 overflow-y-auto no-scrollbar">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 sticky top-0 bg-[#0f1117] z-10 py-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Team Activity
                </h3>

                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                    {mappedActivities.length === 0 ? (
                        <div className="pl-10 text-xs text-muted-foreground">No recent activity</div>
                    ) : (
                        mappedActivities.map((activity) => (
                            <div key={activity.id} className="relative pl-10">
                                {/* Timeline Node */}
                                <div className="absolute left-[9px] top-1 w-3.5 h-3.5 rounded-full bg-[#0f1117] border-2 border-primary/50 z-10" />

                                <div className="group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white", activity.user.color)}>
                                            {activity.user.initial}
                                        </div>
                                        <span className="text-xs font-medium text-white">{activity.user.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                                    </div>

                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {activity.action} <span className="text-primary/90 font-medium hover:underline cursor-pointer line-clamp-1">{activity.target}</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Project Progress Section */}
            <div className="mt-auto">
                <h3 className="text-sm font-semibold text-white mb-4">Overall Progress</h3>

                <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-xs text-muted-foreground">All Tasks</p>
                            <p className="text-lg font-bold text-white">{progress}%</p>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-3 text-right">{taskStats.completed}/{taskStats.total} tasks completed</p>
                </div>
            </div>

        </aside>
    )
}
