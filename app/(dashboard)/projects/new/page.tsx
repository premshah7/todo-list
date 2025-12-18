'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createProject } from '@/actions/projects'

export default function NewProjectPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createProject(formData)

            if (result.error) {
                setError(result.error)
            } else {
                router.push(`/projects/${result.projectId}`)
                router.refresh()
            }
        } catch (err) {
            setError('Failed to create project')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New Project</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>Enter the information for your new project</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="projectName" className="text-sm font-medium">
                                    Project Name *
                                </label>
                                <Input
                                    id="projectName"
                                    name="projectName"
                                    placeholder="Enter project name"
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
                                    placeholder="Enter project description"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Project'}
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
