import { auth } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
    const session = await auth()
    const userId = (session?.user as any)?.id

    // Get my tasks
    const myTasks = await prisma.tasks.findMany({
        where: { AssignedTo: userId },
        include: {
            TaskLists: {
                select: {
                    ListName: true,
                    Projects: {
                        select: {
                            ProjectName: true,
                            ProjectID: true,
                        },
                    },
                },
            },
        },
        orderBy: { DueDate: 'asc' },
        take: 5,
    })

    // Get task stats
    const taskStats = await prisma.tasks.groupBy({
        by: ['Status'],
        where: { AssignedTo: userId },
        _count: true,
    })

    const stats = {
        pending: taskStats.find(s => s.Status === 'Pending')?._count || 0,
        inProgress: taskStats.find(s => s.Status === 'In Progress')?._count || 0,
        completed: taskStats.find(s => s.Status === 'Completed')?._count || 0,
    }

    // Get recent projects
    const projects = await prisma.projects.findMany({
        where: {
            CreatedBy: userId,
        },
        orderBy: { CreatedAt: 'desc' },
        take: 5,
    })

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {session?.user?.name || (session?.user as any)?.username}!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completed}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Tasks */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>My Tasks</CardTitle>
                            <Button size="sm">
                                <Link href="/my-tasks">View All</Link>
                            </Button>
                        </div>
                        <CardDescription>Your recently assigned tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {myTasks.length === 0 ? (
                            <p className="text-sm text-gray-500">No tasks assigned to you</p>
                        ) : (
                            <div className="space-y-3">
                                {myTasks.map((task) => (
                                    <Link
                                        key={task.TaskID}
                                        href={`/tasks/${task.TaskID}`}
                                        className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">{task.Title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {task.TaskLists.Projects.ProjectName} • {task.TaskLists.ListName}
                                                </p>
                                            </div>
                                            {task.DueDate && (
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(task.DueDate)}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Projects</CardTitle>
                            <Button size="sm">
                                <Link href="/projects">
                                    <Plus className="h-4 w-4 mr-1" /> New Project
                                </Link>
                            </Button>
                        </div>
                        <CardDescription>Your active projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {projects.length === 0 ? (
                            <p className="text-sm text-gray-500">No projects yet</p>
                        ) : (
                            <div className="space-y-3">
                                {projects.map((project) => (
                                    <Link
                                        key={project.ProjectID}
                                        href={`/projects/${project.ProjectID}`}
                                        className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <h4 className="font-medium text-sm">{project.ProjectName}</h4>
                                        {project.Description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                {project.Description}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
