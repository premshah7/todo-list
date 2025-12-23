"use client"

import { Clock, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function RightPanel() {
    const activities = [
        {
            id: 1,
            user: { name: "Sarah", initial: "S", color: "from-pink-500 to-rose-500" },
            action: "moved to Review",
            target: "Design Homepage",
            time: "2m ago",
            icon: ArrowRight,
        },
        {
            id: 2,
            user: { name: "Mike", initial: "M", color: "from-blue-500 to-cyan-500" },
            action: "commented on",
            target: "Fix Auth Bug",
            time: "15m ago",
            icon: MessageSquare,
        },
        {
            id: 3,
            user: { name: "You", initial: "Y", color: "from-primary to-violet-600" },
            action: "completed",
            target: "Update Readme",
            time: "1h ago",
            icon: CheckCircle2,
        },
    ]

    return (
        <aside className="hidden xl:flex flex-col w-80 fixed right-0 top-0 h-screen bg-[#0f1117] border-l border-white/5 p-6 pt-24 z-20">

            {/* Team Activity Section */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Team Activity
                </h3>

                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                    {activities.map((activity) => (
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
                                    {activity.action} <span className="text-primary/90 font-medium hover:underline cursor-pointer">{activity.target}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Progress Section */}
            <div>
                <h3 className="text-sm font-semibold text-white mb-4">Sprint Progress</h3>

                <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-xs text-muted-foreground">Sprint 3</p>
                            <p className="text-lg font-bold text-white">65%</p>
                        </div>
                        <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full mb-1">+12% vs last</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-violet-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-3 text-right">12/18 tasks completed</p>
                </div>
            </div>

        </aside>
    )
}
