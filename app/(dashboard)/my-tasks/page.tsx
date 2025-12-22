import { getMyTasks } from '@/actions/tasks'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, FolderKanban } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function MyTasksPage() {
    const tasks = await getMyTasks()

    const priorityColors = {
        Low: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        Medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        High: 'bg-red-500/10 text-red-400 border border-red-500/20',
    }

    const statusColors = {
        Pending: 'text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]',
        'In Progress': 'text-primary drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]',
        Completed: 'text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]',
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white font-tech uppercase tracking-wider text-glow">My Tasks</h1>
                    <p className="text-muted-foreground mt-1">All tasks assigned to you</p>
                </div>
                <Link href="/tasks/new">
                    <Button>
                        New Task
                    </Button>
                </Link>
            </div>

            {tasks.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-white">No tasks assigned</h3>
                        <p className="text-muted-foreground text-center max-w-sm">
                            You don't have any tasks assigned to you yet.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <Link
                            key={task.TaskID}
                            href={`/tasks/${task.TaskID}`}
                            className="block group"
                        >
                            <Card className="hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all duration-300 hover:border-primary/50 group-hover:bg-white/5">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">{task.Title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.Priority as keyof typeof priorityColors]}`}>
                                                    {task.Priority}
                                                </span>
                                                <span className={`text-sm font-medium font-tech uppercase tracking-wide ${statusColors[task.Status as keyof typeof statusColors]}`}>
                                                    {task.Status}
                                                </span>
                                            </div>

                                            {task.Description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                    {task.Description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <FolderKanban className="h-4 w-4" />
                                                    <span>{task.TaskLists.ListName}</span>
                                                </div>

                                                {task.DueDate && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(task.DueDate)}</span>
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
