'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { TaskCard } from './task-card'
import { moveTask } from '@/actions/tasks'
import { TaskDetailsPanel } from './board/task-details-panel'

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

interface KanbanBoardProps {
    taskLists: TaskList[]
    projectId: string
}

export function KanbanBoard({ taskLists, projectId }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const activeTask = activeId
        ? taskLists.flatMap(list => list.tasks).find(task => task.id === activeId)
        : null

    async function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) {
            setActiveId(null)
            return
        }

        const activeId = active.id as string
        const overId = over.id as string

        // Find the task being dragged
        const activeList = taskLists.find(list =>
            list.tasks.some(task => task.id === activeId)
        )

        if (!activeList) {
            setActiveId(null)
            return
        }

        // Determine which list the task is being dropped into
        let targetListId: string
        let targetPosition: number = 0

        // Check if dropped on another task
        const targetTask = taskLists.flatMap(list => list.tasks).find(task => task.id === overId)
        if (targetTask) {
            const targetList = taskLists.find(list => list.tasks.some(task => task.id === overId))
            if (targetList) {
                targetListId = targetList.id
                targetPosition = targetList.tasks.findIndex(task => task.id === overId)
            } else {
                setActiveId(null)
                return
            }
        } else {
            // Dropped on a column
            const targetList = taskLists.find(list => `list-${list.id}` === overId)
            if (targetList) {
                targetListId = targetList.id
                targetPosition = targetList.tasks.length
            } else {
                setActiveId(null)
                return
            }
        }

        // Move the task
        await moveTask(activeId, targetListId, targetPosition)
        setActiveId(null)
    }

    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    // ... (rest of sensors and activeTask logic)

    // ... (drag handlers)

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {taskLists.map((list) => (
                        <KanbanColumn
                            key={list.id}
                            list={list}
                            projectId={projectId}
                            onTaskClick={setSelectedTask}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="rotate-3 opacity-90">
                            <TaskCard task={activeTask} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Task Details Slide-over */}
            <TaskDetailsPanel
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
            />
        </>
    )
}
