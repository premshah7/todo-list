"use client"

import { useState } from "react"
import { createTodo, toggleTodo, deleteTodo } from "@/actions/todos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash2, CheckCircle2, Circle, Plus, Loader2, Folder, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Project {
    ProjectID: number
    ProjectName: string
}

interface Todo {
    TodoID: number
    Content: string
    IsCompleted: boolean
    Duration?: string | null
    Project?: { ProjectName: string } | null
}

export function TodoList({ initialTodos, projects }: { initialTodos: Todo[], projects: Project[] }) {
    const [todos, setTodos] = useState(initialTodos)
    const [newTodo, setNewTodo] = useState("")
    const [selectedProject, setSelectedProject] = useState<string>("")

    // Time Estimation States
    const [days, setDays] = useState("")
    const [hours, setHours] = useState("")
    const [minutes, setMinutes] = useState("")

    const [isAdding, setIsAdding] = useState(false)
    const [loadingIds, setLoadingIds] = useState<number[]>([])

    if (initialTodos !== todos) {
        setTodos(initialTodos)
    }

    async function handleAdd() {
        if (!newTodo.trim()) return

        setIsAdding(true)
        const formData = new FormData()
        formData.append("content", newTodo)
        if (selectedProject) {
            formData.append("projectId", selectedProject)
        }

        // Construct duration string
        const parts = []
        if (days) parts.push(`${days}d`)
        if (hours) parts.push(`${hours}h`)
        if (minutes) parts.push(`${minutes}m`)

        if (parts.length > 0) {
            formData.append("duration", parts.join(" "))
        }

        const result = await createTodo(formData)

        if (result?.success) {
            setNewTodo("")
            setSelectedProject("")
            setDays("")
            setHours("")
            setMinutes("")
        }
        setIsAdding(false)
    }

    async function handleToggle(id: number) {
        setLoadingIds(prev => [...prev, id])
        await toggleTodo(id)
        setLoadingIds(prev => prev.filter(lid => lid !== id))
    }

    async function handleDelete(id: number) {
        setLoadingIds(prev => [...prev, id])
        await deleteTodo(id)
        setLoadingIds(prev => prev.filter(lid => lid !== id))
    }

    const activeTodos = todos.filter(t => !t.IsCompleted)
    const completedTodos = todos.filter(t => t.IsCompleted)

    return (
        <div className="space-y-6">
            {/* Add New */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input
                            placeholder="Add a new task..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            className="h-12 text-md flex-1"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Project Selector */}
                        <select
                            className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-auto min-w-[150px]"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <option value="">No Project</option>
                            {projects.map(p => (
                                <option key={p.ProjectID} value={p.ProjectID}>
                                    {p.ProjectName}
                                </option>
                            ))}
                        </select>

                        <div className="h-6 w-px bg-border hidden md:block" />

                        {/* Time Estimation Inputs */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <Input
                                placeholder="0"
                                className="w-12 h-9 text-center px-1"
                                type="number"
                                min="0"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                            />
                            <span>d</span>
                            <Input
                                placeholder="0"
                                className="w-12 h-9 text-center px-1"
                                type="number"
                                min="0"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                            />
                            <span>h</span>
                            <Input
                                placeholder="0"
                                className="w-12 h-9 text-center px-1"
                                type="number"
                                min="0"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                            />
                            <span>m</span>
                        </div>

                        <div className="flex-1" />

                        <Button size="default" onClick={handleAdd} disabled={isAdding || !newTodo.trim()} className="w-full md:w-auto">
                            {isAdding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Task
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Lists */}
            <div className="grid gap-6 md:grid-cols-1">

                {/* Active List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Tasks</CardTitle>
                        <CardDescription>Things you need to get done</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {activeTodos.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No active tasks. Good job!
                            </div>
                        )}
                        {activeTodos.map(todo => (
                            <div key={todo.TodoID} className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3 w-full">
                                    <button
                                        onClick={() => handleToggle(todo.TodoID)}
                                        disabled={loadingIds.includes(todo.TodoID)}
                                        className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                                    >
                                        {loadingIds.includes(todo.TodoID) ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </button>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
                                        <span className="font-medium text-foreground">{todo.Content}</span>

                                        <div className="flex gap-2">
                                            {todo.Project && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary w-fit">
                                                    <Folder className="w-3 h-3 mr-1" />
                                                    {todo.Project.ProjectName}
                                                </span>
                                            )}
                                            {todo.Duration && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground w-fit">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {todo.Duration}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(todo.TodoID)} className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 flex-shrink-0">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Completed List */}
                {completedTodos.length > 0 && (
                    <Card className="opacity-80">
                        <CardHeader>
                            <CardTitle>Completed</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {completedTodos.map(todo => (
                                <div key={todo.TodoID} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                    <div className="flex items-center gap-3 w-full">
                                        <button
                                            onClick={() => handleToggle(todo.TodoID)}
                                            disabled={loadingIds.includes(todo.TodoID)}
                                            className="text-green-500 flex-shrink-0"
                                        >
                                            {loadingIds.includes(todo.TodoID) ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="w-5 h-5" />
                                            )}
                                        </button>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
                                            <span className="font-medium text-muted-foreground line-through decoration-muted-foreground/50">{todo.Content}</span>
                                            <div className="flex gap-2">
                                                {todo.Project && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground w-fit">
                                                        {todo.Project.ProjectName}
                                                    </span>
                                                )}
                                                {todo.Duration && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground w-fit">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {todo.Duration}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(todo.TodoID)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    )
}
