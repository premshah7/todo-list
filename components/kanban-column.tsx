'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTask } from './sortable-task'
import { Plus, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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

interface TaskList {
    ListID: number
    ListName: string
    Tasks: Task[]
}

interface KanbanColumnProps {
    list: TaskList
    projectId: string
    onTaskClick: (task: Task) => void
}

export function KanbanColumn({ list, projectId, onTaskClick }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: `list-${list.ListID}`,
    })

    const headerColors = {
        Pending: 'text-amber-700 bg-amber-50 border-amber-200',
        'In Progress': 'text-indigo-700 bg-indigo-50 border-indigo-200',
        Completed: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    }

    const headerStyle = headerColors[list.ListName as keyof typeof headerColors] || 'text-slate-700 bg-slate-50 border-slate-200'

    return (
        <div className="flex flex-col min-w-[320px] max-w-[320px] h-full">
            <div className="flex items-center justify-between p-1 mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative pb-2">
                        <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">{list.ListName}</h3>
                        <div className={cn("absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-gradient-to-r",
                            list.ListName === 'Pending' ? 'from-amber-400 to-transparent' :
                                list.ListName === 'In Progress' ? 'from-indigo-500 to-transparent' :
                                    list.ListName === 'Completed' ? 'from-emerald-500 to-transparent' :
                                        'from-slate-400 to-transparent'
                        )} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                        {list.Tasks.length}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <Link href={`/projects/${projectId}/tasks/new?status=${list.ListName}`}>
                        <button className="p-1.5 text-primary hover:text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 p-2 bg-transparent rounded-2xl min-h-[150px] space-y-3"
            >
                <SortableContext
                    items={list.Tasks.map(task => task.TaskID.toString())}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {list.Tasks.map((task) => (
                            <SortableTask key={task.TaskID} task={task} onClick={onTaskClick} />
                        ))}
                    </div>
                </SortableContext>

                <Link href={`/projects/${projectId}/tasks/new?status=${list.ListName}`}>
                    <button className="w-full py-3 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground/60 hover:text-primary transition-all group border border-dashed border-transparent hover:border-primary/20 rounded-xl">
                        <Plus className="w-3.5 h-3.5 transition-transform" />
                        <span>Add New Task</span>
                    </button>
                </Link>

                {list.Tasks.length === 0 && (
                    <div className="hidden flex items-center justify-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground/30 text-xs">
                            <p>No tasks yet</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
