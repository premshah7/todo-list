'use client'

import { Calendar, User, MessageSquare, Paperclip, MoreHorizontal, Clock, AlertCircle } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

interface Task {
    id: string
    title: string
    description?: string | null
    priority: string
    status: string
    dueDate?: Date | null
    assignedTo?: {
        username: string
        name?: string | null
    } | null
}

interface TaskCardProps {
    task: Task
    onClick?: () => void
}

const priorityConfig = {
    Low: { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
    Medium: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    High: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
}

export function TaskCard({ task, onClick }: TaskCardProps) {
    const priorityStyle = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.Low

    return (
        <div
            onClick={onClick}
            className="group relative bg-[#16181f] border border-transparent rounded-xl p-4 shadow-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-white/10 hover:bg-[#1a1d26] transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
            {/* Header: Priority & More Menu */}
            <div className="flex items-center justify-between mb-2">
                <div className={cn("h-1.5 w-8 rounded-full",
                    task.priority === 'High' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                        task.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-600'
                )} />

                <button className="text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Title */}
            <h4 className="font-semibold text-sm text-gray-200 line-clamp-2 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                {task.title}
            </h4>

            {/* Description Preview */}
            {task.description && (
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {task.description}
                </p>
            )}

            {/* Footer: Meta & Assignee */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 group-hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                    {/* Mock Comment/Attach Counts */}
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-gray-400 transition-colors">
                        <MessageSquare className="w-3 h-3" />
                        <span>2</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-gray-400 transition-colors">
                        <Paperclip className="w-3 h-3" />
                        <span>1</span>
                    </div>

                    {task.dueDate && (
                        <div className={cn("flex items-center gap-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded",
                            // Simple logic: highlight if date is close - for now just generic style
                            "text-gray-400 bg-white/5"
                        )}>
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(task.dueDate)}</span>
                        </div>
                    )}
                </div>

                {/* Assignee Avatar */}
                {task.assignedTo ? (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-primary p-[1px] shadow-sm">
                        <div className="w-full h-full rounded-full bg-[#1c1c1c] flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white leading-none">
                                {task.assignedTo.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                        <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                )}
            </div>
        </div>
    )
}
