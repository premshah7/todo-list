'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { TaskCard } from './task-card'
import { moveTask } from '@/actions/tasks'
import { TaskDetailsPanel } from './board/task-details-panel'

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
    // Add other fields as necessary from your Prisma type
}

interface TaskList {
    ListID: number
    ListName: string
    Tasks: Task[]
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

    // Helper to find task by ID (handling string/number mismatch for dnd-kit)
    const findTask = (id: string) => {
        return taskLists.flatMap(list => list.Tasks).find(task => task.TaskID.toString() === id)
    }

    const activeTask = activeId ? findTask(activeId) : null

    async function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) {
            setActiveId(null)
            return
        }

        const activeIdStr = active.id as string
        const overIdStr = over.id as string

        // Find the task being dragged
        const activeTask = findTask(activeIdStr)
        if (!activeTask) {
            setActiveId(null)
            return
        }

        const activeList = taskLists.find(list =>
            list.Tasks.some(task => task.TaskID === activeTask.TaskID)
        )

        if (!activeList) {
            setActiveId(null)
            return
        }

        // Determine which list the task is being dropped into
        let targetListId: number
        let targetPosition: number = 0

        // Check if dropped on another task
        const targetTask = findTask(overIdStr)

        if (targetTask) {
            const targetList = taskLists.find(list => list.Tasks.some(task => task.TaskID === targetTask.TaskID))
            if (targetList) {
                targetListId = targetList.ListID
                targetPosition = targetList.Tasks.findIndex(task => task.TaskID === targetTask.TaskID)
            } else {
                setActiveId(null)
                return
            }
        } else {
            // Dropped on a column
            // We expect column IDs to be `list-{ListID}`
            const listIdMatch = overIdStr.match(/^list-(\d+)$/)
            if (listIdMatch) {
                const listId = parseInt(listIdMatch[1])
                const targetList = taskLists.find(list => list.ListID === listId)
                if (targetList) {
                    targetListId = targetList.ListID
                    targetPosition = targetList.Tasks.length
                } else {
                    setActiveId(null)
                    return
                }
            } else {
                setActiveId(null)
                return
            }
        }

        // Move the task
        // Only move if position or list changed
        if (activeList.ListID !== targetListId ||
            activeList.Tasks.findIndex(t => t.TaskID === activeTask.TaskID) !== targetPosition) {
            await moveTask(activeTask.TaskID.toString(), targetListId.toString(), targetPosition)
        }

        setActiveId(null)
    }

    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

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
                            key={list.ListID}
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
                task={selectedTask ? {
                    id: selectedTask.TaskID.toString(),
                    title: selectedTask.Title,
                    priority: selectedTask.Priority,
                    status: selectedTask.Status,
                    description: selectedTask.Description,
                    dueDate: selectedTask.DueDate,
                    assignedTo: selectedTask.Users ? {
                        username: selectedTask.Users.UserName,
                        name: selectedTask.Users.UserName
                    } : null
                } : null}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
            />
        </>
    )
}
