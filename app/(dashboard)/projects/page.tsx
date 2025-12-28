import { getProjects } from '@/actions/projects'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, FolderKanban, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const revalidate = 0

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage your projects and teams</p>
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
                        <FolderKanban className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                        <p className="text-muted-foreground mb-4 text-center max-w-sm">
                            Get started by creating your first project to organize your tasks
                        </p>
                        <Link href="/projects/new">
                            <Button variant="secondary">Create Project</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition-shadow group flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="truncate group-hover:text-primary transition-colors">{project.projectName}</span>
                                </CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px]">
                                    {project.description || 'No description provided.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-end">
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1 opacity-70" />
                                        <span>{project._count.members} Tasks</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1 opacity-70" />
                                        <span>{formatDate(project.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-auto">
                                    <Link href={`/projects/${project.id}/board`} className="flex-1">
                                        <Button variant="default" className="w-full">
                                            Open Board
                                        </Button>
                                    </Link>
                                    <Link href={`/projects/${project.id}`}>
                                        <Button variant="outline" size="icon">
                                            <FolderKanban className="h-4 w-4" />
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
