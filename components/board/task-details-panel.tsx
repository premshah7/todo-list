'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, User, Tag, Clock, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TaskDetailsPanelProps {
    task: any | null
    isOpen: boolean
    onClose: () => void
}

export function TaskDetailsPanel({ task, isOpen, onClose }: TaskDetailsPanelProps) {
    if (!task) return null

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Slide-over Panel */}
            <div
                className={cn(
                    "fixed top-4 right-4 bottom-4 w-[400px] glass-panel rounded-2xl z-50 transition-all duration-500 ease-in-out transform flex flex-col shadow-2xl border-l-0",
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/20">
                            {task.status}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            {task.id}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 rounded-full h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Title */}
                    <div>
                        <h2 className="text-2xl font-bold text-white leading-tight mb-2">{task.title}</h2>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <span className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />
                                {task.assignedTo?.name || 'Unassigned'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {task.dueDate ? new Date(task.dueDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'No due date'}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300 leading-relaxed min-h-[100px]">
                            {task.description || 'No description provided.'}
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</label>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    task.priority === 'High' ? "bg-red-500" :
                                        task.priority === 'Medium' ? "bg-yellow-500" : "bg-blue-500"
                                )} />
                                <span className="text-sm text-white">{task.priority}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimation</label>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-white">{task.estimation || 'Not estimated'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Subtasks Placeholder */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtasks</label>
                            <span className="text-xs text-muted-foreground">0/3</span>
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors cursor-pointer group">
                                    <div className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center group-hover:border-primary/50">
                                        <CheckSquare className="h-3 w-3 text-transparent group-hover:text-primary/50" />
                                    </div>
                                    <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Subtask item placeholder</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-black/20">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 shadow-lg shadow-primary/20">
                        Mark Complete
                    </Button>
                </div>
            </div>
        </>
    )
}
