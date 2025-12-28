'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, User, Tag, Clock, CheckSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createSubtask, toggleSubtask, deleteSubtask } from '@/actions/subtasks'

interface Subtask {
    SubtaskID: number
    Title: string
    IsCompleted: boolean
}

interface TaskDetailsPanelProps {
    task: any | null
    isOpen: boolean
    onClose: () => void
}

export function TaskDetailsPanel({ task, isOpen, onClose }: TaskDetailsPanelProps) {
    const [subtasks, setSubtasks] = useState<Subtask[]>([])
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

    useEffect(() => {
        if (task?.Subtasks) {
            setSubtasks(task.Subtasks)
        } else {
            setSubtasks([])
        }
    }, [task])

    const handleAddSubtask = async () => {
        if (!newSubtaskTitle.trim() || !task) return

        const result = await createSubtask(parseInt(task.id || task.TaskID), newSubtaskTitle)
        if (result.success && result.subtask) {
            setSubtasks([...subtasks, result.subtask])
            setNewSubtaskTitle('')
        }
    }

    const handleToggleSubtask = async (id: number, isCompleted: boolean) => {
        // Optimistic update
        setSubtasks(prev => prev.map(s => s.SubtaskID === id ? { ...s, IsCompleted: isCompleted } : s))
        await toggleSubtask(id, isCompleted)
    }

    const handleDeleteSubtask = async (id: number) => {
        // Optimistic update
        setSubtasks(prev => prev.filter(s => s.SubtaskID !== id))
        await deleteSubtask(id)
    }

    if (!task) return null

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300"
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
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {task.status}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            {task.id}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted rounded-full h-8 w-8 hover:text-foreground">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Title */}
                    <div>
                        <h2 className="text-2xl font-bold text-foreground leading-tight mb-2">{task.title}</h2>
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
                        <div className="p-4 rounded-xl bg-muted/30 border border-border text-sm text-foreground leading-relaxed min-h-[100px]">
                            {task.description || 'No description provided.'}
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</label>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border">
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    task.priority === 'High' ? "bg-red-500" :
                                        task.priority === 'Medium' ? "bg-amber-500" : "bg-blue-500"
                                )} />
                                <span className="text-sm text-foreground">{task.priority}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimation</label>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">{task.estimation || 'Not estimated'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtasks</label>
                            <span className="text-xs text-muted-foreground">
                                {subtasks.filter(s => s.IsCompleted).length}/{subtasks.length}
                            </span>
                        </div>

                        {/* Subtask List */}
                        <div className="space-y-2">
                            {subtasks.map((subtask) => (
                                <div
                                    key={subtask.SubtaskID}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors group"
                                >
                                    <button
                                        onClick={() => handleToggleSubtask(subtask.SubtaskID, !subtask.IsCompleted)}
                                        className={cn(
                                            "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                                            subtask.IsCompleted
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "border-muted-foreground/30 hover:border-primary/50 text-transparent"
                                        )}
                                    >
                                        <CheckSquare className="h-3.5 w-3.5" />
                                    </button>

                                    <span className={cn(
                                        "text-sm flex-1 transition-colors",
                                        subtask.IsCompleted ? "text-muted-foreground line-through" : "text-foreground"
                                    )}>
                                        {subtask.Title}
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteSubtask(subtask.SubtaskID)}
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Add Subtask Input */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="relative flex-1">
                                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                    placeholder="Add a subtask..."
                                    className="w-full bg-muted/30 border border-border rounded-xl py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                            <Button
                                size="sm"
                                onClick={handleAddSubtask}
                                disabled={!newSubtaskTitle.trim()}
                                className="rounded-lg h-10"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-muted/20">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 shadow-lg shadow-primary/20">
                        Mark Complete
                    </Button>
                </div>
            </div>
        </>
    )
}
