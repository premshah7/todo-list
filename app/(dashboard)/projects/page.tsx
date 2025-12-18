import { getProjects } from '@/actions/projects'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, FolderKanban } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your projects and teams</p>
                </div>
                <Button asChild>
                    <Link href="/projects/new">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Link>
                </Button>
            </div>

            {projects.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FolderKanban className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-4 text-center max-w-sm">
                            Get started by creating your first project to organize your tasks
                        </p>
                        <Button asChild>
                            <Link href="/projects/new">Create Project</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="truncate">{project.projectName}</span>
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {project.description || 'No description'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        {project._count.members} members
                                    </div>
                                    <span>{formatDate(project.createdAt)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button asChild variant="default" className="flex-1">
                                        <Link href={`/projects/${project.id}/board`}>
                                            View Board
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href={`/projects/${project.id}`}>
                                            Details
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
