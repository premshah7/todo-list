'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTask } from './sortable-task'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

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
}

export function KanbanColumn({ list, projectId }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: `list-${list.id}`,
    })

    const columnColors = {
        Pending: 'bg-orange-100 dark:bg-orange-900/20',
        'In Progress': 'bg-blue-100 dark:bg-blue-900/20',
        Completed: 'bg-green-100 dark:bg-green-900/20',
    }

    const headerColors = {
        Pending: 'text-orange-700 dark:text-orange-400',
        'In Progress': 'text-blue-700 dark:text-blue-400',
        Completed: 'text-green-700 dark:text-green-400',
    }

    return (
        <div className="flex flex-col min-w-[320px] max-w-[320px]">
            <div className={`rounded-t-lg p-4 ${columnColors[list.listName as keyof typeof columnColors] || 'bg-gray-100'}`}>
                <h3 className={`font-semibold text-lg ${headerColors[list.listName as keyof typeof headerColors] || 'text-gray-700'}`}>
                    {list.listName}
                    <span className="ml-2 text-sm font-normal">({list.tasks.length})</span>
                </h3>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-b-lg min-h-[400px]"
            >
                <SortableContext
                    items={list.tasks.map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {list.tasks.map((task) => (
                            <SortableTask key={task.id} task={task} />
                        ))}
                    </div>
                </SortableContext>

                {list.tasks.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">
                        No tasks in this column
                    </div>
                )}

                <Button
                    asChild
                    variant="outline"
                    className="w-full mt-4 border-dashed"
                    size="sm"
                >
                    <Link href={`/projects/${projectId}/tasks/new?status=${list.listName}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                    </Link>
                </Button>
            </div>
        </div>
    )
}
