'use client'

import { Calendar, User, MessageSquare, Paperclip, MoreHorizontal, Clock, AlertCircle } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

interface Task {
    TaskID: number
    Title: string
    Description?: string | null
    Priority: string
    Status: string
    DueDate?: Date | null
    Users?: {
        UserID: number
        UserName: string
    } | null
}

interface TaskCardProps {
    task: Task
    onClick?: () => void
}

const priorityConfig = {
    Low: { color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
    Medium: { color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
    High: { color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
}

export function TaskCard({ task, onClick }: TaskCardProps) {
    const priorityStyle = priorityConfig[task.Priority as keyof typeof priorityConfig] || priorityConfig.Low

    return (
        <div
            onClick={onClick}
            className="group relative bg-card border border-border/60 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
            {/* Header: Priority & More Menu */}
            <div className="flex items-center justify-between mb-3">
                <div className={cn("h-1.5 w-8 rounded-full",
                    task.Priority === 'High' ? 'bg-red-500 shadow-sm shadow-red-500/20' :
                        task.Priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                )} />

                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Title */}
            <h4 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">
                {task.Title}
            </h4>

            {/* Description Preview */}
            {task.Description && (
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {task.Description}
                </p>
            )}

            {/* Footer: Meta & Assignee */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 group-hover:border-border transition-colors">
                <div className="flex items-center gap-3">
                    {/* Mock Comment/Attach Counts */}
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-foreground/70 transition-colors">
                        <MessageSquare className="w-3 h-3" />
                        <span>2</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-foreground/70 transition-colors">
                        <Paperclip className="w-3 h-3" />
                        <span>1</span>
                    </div>

                    {task.DueDate && (
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(task.DueDate)}</span>
                        </div>
                    )}
                </div>

                {/* Assignee Avatar */}
                {task.Users ? (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-[1px] shadow-sm">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                            <span className="text-[9px] font-bold text-foreground leading-none">
                                {task.Users.UserName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                        <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                )}
            </div>
        </div>
    )
}
