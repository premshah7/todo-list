import { getProjects } from '@/actions/projects'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, FolderKanban } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function ProjectsPage() {
    const rawProjects = await getProjects()

    // Map Prisma data to frontend structure
    const projects = rawProjects.map(p => ({
        id: p.ProjectID,
        projectName: p.ProjectName,
        description: p.Description,
        createdAt: p.CreatedAt,
        _count: {
            members: p.TaskLists.reduce((acc, list) => acc + list._count.Tasks, 0) // Approximation or fix query later
        }
    }))

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your projects and teams</p>
                </div>
                <Link href="/projects/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            {projects.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FolderKanban className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-4 text-center max-w-sm">
                            Get started by creating your first project to organize your tasks
                        </p>
                        <Link href="/projects/new">
                            <Button>Create Project</Button>
                        </Link>
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
                                        Task Lists: {project._count.members} {/* Temporary filler */}
                                    </div>
                                    <span>{formatDate(project.createdAt)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/projects/${project.id}/board`} className="flex-1">
                                        <Button variant="default" className="w-full">
                                            View Board
                                        </Button>
                                    </Link>
                                    <Link href={`/projects/${project.id}`}>
                                        <Button variant="outline">
                                            Details
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
