'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTask } from './sortable-task'
import { Plus, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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

interface TaskList {
    id: string
    listName: string
    tasks: Task[]
}

interface KanbanColumnProps {
    list: TaskList
    projectId: string
    onTaskClick: (task: Task) => void
}

export function KanbanColumn({ list, projectId, onTaskClick }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: `list-${list.id}`,
    })

    const headerColors = {
        Pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        'In Progress': 'text-primary bg-primary/10 border-primary/20',
        Completed: 'text-green-400 bg-green-400/10 border-green-400/20',
    }

    const headerStyle = headerColors[list.listName as keyof typeof headerColors] || 'text-muted-foreground bg-white/5 border-white/5'

    return (
        <div className="flex flex-col min-w-[320px] max-w-[320px] h-full">
            <div className="flex items-center justify-between p-1 mb-3">
                <div className="flex items-center gap-3">
                    <span className={cn("px-2.5 py-0.5 text-xs font-semibold rounded-full border", headerStyle)}>
                        {list.listName}
                        <span className="ml-2 opacity-70">
                            {list.tasks.length}
                        </span>
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <Link href={`/projects/${projectId}/tasks/new?status=${list.listName}`}>
                        <button className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors">
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
                    items={list.tasks.map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {list.tasks.map((task) => (
                            <SortableTask key={task.id} task={task} onClick={onTaskClick} />
                        ))}
                    </div>
                </SortableContext>

                <Link href={`/projects/${projectId}/tasks/new?status=${list.listName}`}>
                    <button className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground/50 border border-dashed border-white/5 rounded-xl hover:bg-white/5 hover:text-muted-foreground hover:border-white/10 transition-all group">
                        <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        Add Task
                    </button>
                </Link>

                {list.tasks.length === 0 && (
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
