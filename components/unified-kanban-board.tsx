'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { KanbanColumn } from './kanban-column' // Reuse existing column UI
import { TaskCard } from './task-card' // Reuse existing card UI
import { setTaskStatus } from '@/actions/tasks' // Use status update instead of move
import { TaskDetailsPanel } from './board/task-details-panel'

// Type alignment
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
    TaskLists?: {
        Projects?: {
            ProjectName: string
        }
    }
}

interface UnifiedKanbanBoardProps {
    initialTasks: Task[]
}

export function UnifiedKanbanBoard({ initialTasks }: UnifiedKanbanBoardProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [activeId, setActiveId] = useState<string | null>(null)

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    // Virtual Columns
    const columns = ['Pending', 'In Progress', 'Completed']

    // Construct virtual TaskLists for the KanbanColumn component
    const taskLists = columns.map((status, index) => ({
        ListID: index + 1000, // Virtual ID
        ListName: status,
        Tasks: tasks.filter(t => t.Status === status)
    }))

    const findTask = (id: string) => {
        return tasks.find(task => task.TaskID.toString() === id)
    }

    const activeTask = activeId ? findTask(activeId) : null

    function handleDragStart(event: DragStartEvent) {
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

        const task = findTask(activeIdStr)
        if (!task) {
            setActiveId(null)
            return
        }

        let newStatus = task.Status

        // Dropped on a Column
        // We know our virtual columns have IDs like "list-1000" (if KanbanColumn uses that prefix) 
        // OR the KanbanColumn might use the raw ListID as the ID in the Droppable.
        // Let's assume KanbanColumn uses `list-${ListID}` or just `ListID`. 
        // We need to match the overIdStr to our virtual ListIDs.

        // Check if dropped on a Status Column (container)
        const droppedOnColumn = taskLists.find(list => overIdStr.includes(list.ListID.toString()) || overIdStr === list.ListID.toString())

        if (droppedOnColumn) {
            newStatus = droppedOnColumn.ListName
        } else {
            // Check if dropped on another Task
            const overTask = findTask(overIdStr)
            if (overTask) {
                newStatus = overTask.Status
            }
        }

        if (newStatus !== task.Status) {
            // Optimistic Update
            setTasks(prev => prev.map(t =>
                t.TaskID === task.TaskID ? { ...t, Status: newStatus } : t
            ))

            // API Call
            await setTaskStatus(task.TaskID.toString(), newStatus)
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
                <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[500px]">
                    {taskLists.map((list) => (
                        <KanbanColumn
                            key={list.ListID}
                            list={list}
                            projectId="unified" // No specific project ID
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
