'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTask } from '@/actions/tasks'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTaskPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams<{ projectId: string }>()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<any[]>([])
    const [taskLists, setTaskLists] = useState<any[]>([])
    const [selectedListId, setSelectedListId] = useState<string>('')

    const defaultStatus = searchParams.get('status') || 'Pending'

    useEffect(() => {
        // Fetch users and task lists for this project
        async function fetchData() {
            const response = await fetch(`/api/projects/${params.projectId}/data`)
            if (response.ok) {
                const data = await response.json()
                setUsers(data.members || [])
                const lists = data.taskLists || []
                setTaskLists(lists)

                // Set default selection based on status param
                if (lists.length > 0) {
                    const defaultList = lists.find((l: any) => l.listName === defaultStatus)
                    if (defaultList) {
                        setSelectedListId(defaultList.id)
                    } else if (!selectedListId) {
                        setSelectedListId(lists[0].id)
                    }
                }
            }
        }
        if (params.projectId) {
            fetchData()
        }
    }, [params.projectId, defaultStatus])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const listId = formData.get('listId') as string

        try {
            const result = await createTask(listId, formData)

            if (result.error) {
                setError(result.error)
            } else {
                router.push(`/projects/${params.projectId}/board`)
                router.refresh()
            }
        } catch (err) {
            setError('Failed to create task')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href={`/projects/${params.projectId}/board`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Board
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Task Details</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Title *
                                </label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                                    placeholder="Enter task description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="priority" className="text-sm font-medium">
                                        Priority *
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        required
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="listId" className="text-sm font-medium">
                                        Status *
                                    </label>
                                    <select
                                        id="listId"
                                        name="listId"
                                        required
                                        value={selectedListId}
                                        onChange={(e) => setSelectedListId(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <option value="" disabled>Select a status</option>
                                        {taskLists.map((list) => (
                                            <option key={list.id} value={list.id} className='text-black'>
                                                {list.listName}
                                            </option>
                                        ))}
                                    </select>
                                    <input type="hidden" name="status" value={taskLists.find(l => l.id === selectedListId)?.listName || defaultStatus} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="assignedToId" className="text-sm font-medium">
                                        Assign To
                                    </label>
                                    <select
                                        id="assignedToId"
                                        name="assignedToId"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((user) => (
                                            <option key={user.userId} value={user.userId}>
                                                {user.user.name || user.user.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="dueDate" className="text-sm font-medium">
                                        Due Date
                                    </label>
                                    <Input
                                        id="dueDate"
                                        name="dueDate"
                                        type="date"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Task'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </div>
    )
}
