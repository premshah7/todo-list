'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard } from './task-card'

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

interface SortableTaskProps {
    task: Task
    onClick: (task: Task) => void
}

export function SortableTask({ task, onClick }: SortableTaskProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.TaskID.toString() })

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
            <TaskCard task={task} onClick={() => onClick(task)} />
        </div>
    )
}
