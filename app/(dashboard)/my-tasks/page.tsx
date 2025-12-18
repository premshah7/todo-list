import { getMyTasks } from '@/actions/tasks'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, FolderKanban } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function MyTasksPage() {
    const tasks = await getMyTasks()

    const priorityColors = {
        Low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }

    const statusColors = {
        Pending: 'text-orange-600 dark:text-orange-400',
        'In Progress': 'text-blue-600 dark:text-blue-400',
        Completed: 'text-green-600 dark:text-green-400',
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">All tasks assigned to you</p>
            </div>

            {tasks.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FolderKanban className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No tasks assigned</h3>
                        <p className="text-gray-500 text-center max-w-sm">
                            You don't have any tasks assigned to you yet.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <Link
                            key={task.id}
                            href={`/tasks/${task.id}`}
                            className="block"
                        >
                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                                                    {task.priority}
                                                </span>
                                                <span className={`text-sm font-medium ${statusColors[task.status as keyof typeof statusColors]}`}>
                                                    {task.status}
                                                </span>
                                            </div>

                                            {task.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <FolderKanban className="h-4 w-4" />
                                                    <span>{task.taskList.project.projectName}</span>
                                                </div>

                                                {task.dueDate && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(task.dueDate)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
