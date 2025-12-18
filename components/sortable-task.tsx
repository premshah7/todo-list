'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard } from './task-card'

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

interface SortableTaskProps {
    task: Task
}

export function SortableTask({ task }: SortableTaskProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <TaskCard task={task} />
        </div>
    )
}
