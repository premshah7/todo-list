'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar, AlertCircle, Loader2, Check } from 'lucide-react'
import { createTask } from '@/actions/tasks'
import Link from 'next/link'

interface Project {
    ProjectID: number
    ProjectName: string
    TaskLists: {
        ListID: number
        ListName: string
    }[]
}

interface TaskFormProps {
    projects?: any[] // Optional: if provided, allows selecting project. If not, assumes we are in context
    initialProjectId?: string
    cancelHref?: string
}

export function TaskForm({ projects = [], initialProjectId, cancelHref = '/my-tasks' }: TaskFormProps) {
    const router = useRouter()
    const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || '')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Ensure we have a valid project selected if initialProjectId provided
    // OR if there is only one project available and none selected yet
    useEffect(() => {
        if (initialProjectId) {
            setSelectedProjectId(initialProjectId)
        } else if (projects.length === 1 && !selectedProjectId) {
            setSelectedProjectId(projects[0].ProjectID.toString())
        }
    }, [initialProjectId, projects, selectedProjectId])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!selectedProjectId) {
            setError('Please select a project')
            setLoading(false)
            return
        }

        // Determine which project list to use
        // If projects passed, find in list. If not, we might need another way or assume passed projects has it.
        // The calling page should pass the project(s). 
        // Case 1: Global Add -> projects has all projects.
        // Case 2: Project Add -> projects might have just one or we just use IDs.

        const project = projects.find(p => p.ProjectID.toString() === selectedProjectId)
        if (!project) {
            setError('Invalid project selected')
            setLoading(false)
            return
        }

        const pendingList = project.TaskLists.find((l: any) => l.ListName === 'Pending') || project.TaskLists[0]
        if (!pendingList) {
            setError('Selected project has no task lists to add tasks to.')
            setLoading(false)
            return
        }

        const formData = new FormData(e.currentTarget)
        // Ensure status is sent even if hidden/disabled in UI
        if (!formData.get('status')) {
            formData.append('status', 'Pending')
        }

        const result = await createTask(pendingList.ListID.toString(), formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        router.push(cancelHref === '/my-tasks' ? '/my-tasks' : `/projects/${selectedProjectId}/board`)
        router.refresh()
    }

    return (
        <Card className="max-w-2xl mx-auto border-white/5 bg-[#09090b] shadow-2xl">
            <CardHeader>
                <CardTitle className="text-white">Create New Task</CardTitle>
                <CardDescription>Add a task to your project</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {/* Project Selection - Only show if we have choices and not pre-fixed context */}
                    {projects.length > 1 && !initialProjectId && (
                        <div className="space-y-2">
                            <label htmlFor="project" className="text-sm font-medium text-gray-200">
                                Project
                            </label>
                            <select
                                id="project"
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all duration-200"
                                required
                            >
                                <option value="" className="bg-[#121212]">Select a project...</option>
                                {projects.map((project) => (
                                    <option key={project.ProjectID} value={project.ProjectID} className="bg-[#121212] text-white">
                                        {project.ProjectName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-gray-200">
                            Task Title
                        </label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. Implement authentication"
                            required
                            className="bg-white/5 border-white/5 text-white placeholder:text-gray-500 focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-200">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="flex w-full rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all duration-200"
                            placeholder="Add details about this task..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="priority" className="text-sm font-medium text-gray-200">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                className="flex h-11 w-full rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all duration-200"
                                required
                            >
                                <option value="Low" className="bg-[#121212]">Low</option>
                                <option value="Medium" className="bg-[#121212]">Medium</option>
                                <option value="High" className="bg-[#121212]">High</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="status" className="text-sm font-medium text-gray-200">
                                Status
                            </label>
                            <Input
                                id="status"
                                name="status"
                                value="Pending"
                                readOnly
                                className="bg-white/5 border-white/5 text-gray-400 cursor-not-allowed focus-visible:ring-0"
                            />
                            <p className="text-[10px] text-muted-foreground">New tasks are automatically added to the Pending list.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="dueDate" className="text-sm font-medium text-gray-200">
                            Due Date & Time (Optional)
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="dueDate"
                                    name="dueDate"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="bg-white/5 border-white/5 text-white placeholder:text-gray-500 focus-visible:ring-primary/50 pl-10 block"
                                />
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                            <div className="relative w-32">
                                <Input
                                    id="dueTime"
                                    name="dueTime"
                                    type="time"
                                    defaultValue={new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    className="bg-white/5 border-white/5 text-white placeholder:text-gray-500 focus-visible:ring-primary/50 block"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">
                            Estimation (Optional)
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="estimationValue"
                                    name="estimationValue"
                                    type="number"
                                    min="0"
                                    placeholder="Value (e.g. 2)"
                                    className="bg-white/5 border-white/5 text-white placeholder:text-gray-500 focus-visible:ring-primary/50 block"
                                />
                            </div>
                            <div className="relative w-32">
                                <select
                                    id="estimationUnit"
                                    name="estimationUnit"
                                    defaultValue="Hours"
                                    className="flex h-11 w-full rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all duration-200"
                                >
                                    <option value="Minutes" className="bg-[#121212]">Minutes</option>
                                    <option value="Hours" className="bg-[#121212]">Hours</option>
                                    <option value="Days" className="bg-[#121212]">Days</option>
                                    <option value="Weeks" className="bg-[#121212]">Weeks</option>
                                    <option value="Months" className="bg-[#121212]">Months</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Link href={cancelHref}>
                            <Button variant="outline" type="button" className="border-white/10 hover:bg-white/5 hover:text-white">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="min-w-[120px]">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>

                                    <Check className="mr-2 h-4 w-4" />
                                    Create Task
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
