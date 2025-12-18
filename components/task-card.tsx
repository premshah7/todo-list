'use client'

import Link from 'next/link'
import { Calendar, User, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

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
}

const priorityColors = {
    Low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function TaskCard({ task }: TaskCardProps) {
    return (
        <Link href={`/tasks/${task.id}`}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm line-clamp-2 flex-1">{task.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Medium}`}>
                        {task.priority}
                    </span>
                </div>

                {task.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {task.description}
                    </p>
                )}

                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {task.assignedTo && (
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{task.assignedTo.name || task.assignedTo.username}</span>
                        </div>
                    )}

                    {task.dueDate && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.dueDate)}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
