import { getTask, addComment } from '@/actions/tasks'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Clock, MessageCircle } from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'
import { CommentForm } from '@/components/comment-form'

export default async function TaskDetailPage({
    params,
}: {
    params: { taskId: string }
}) {
    const task = await getTask(params.taskId)

    if (!task) {
        notFound()
    }

    const priorityColors = {
        Low: 'bg-gray-100 text-gray-700',
        Medium: 'bg-yellow-100 text-yellow-700',
        High: 'bg-red-100 text-red-700',
    }

    const statusColors = {
        Pending: 'bg-orange-100 text-orange-700',
        'In Progress': 'bg-blue-100 text-blue-700',
        Completed: 'bg-green-100 text-green-700',
    }

    return (
        <div className="p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${task.taskList.project.id}/board`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Board
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl mb-2">{task.title}</CardTitle>
                                        <CardDescription>
                                            {task.taskList.project.projectName} • {task.taskList.listName}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                                            {task.priority}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[task.status as keyof typeof statusColors]}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Description</h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {task.description || 'No description provided'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">Assignee:</span>
                                            <span className="text-gray-600">
                                                {task.assignedTo ? (task.assignedTo.name || task.assignedTo.username) : 'Unassigned'}
                                            </span>
                                        </div>
                                        {task.dueDate && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Due:</span>
                                                <span className="text-gray-600">{formatDate(task.dueDate)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comments */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Comments ({task.comments.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <CommentForm taskId={task.id} />

                                <div className="space-y-4 mt-6">
                                    {task.comments.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
                                    ) : (
                                        task.comments.map((comment) => (
                                            <div key={comment.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-sm">
                                                        {comment.user.name || comment.user.username}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDateTime(comment.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {comment.commentText}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Activity History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Clock className="h-5 w-5" />
                                    Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {task.histories.length === 0 ? (
                                        <p className="text-sm text-gray-500">No activity yet</p>
                                    ) : (
                                        task.histories.map((history) => (
                                            <div key={history.id} className="text-sm">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {history.user.name || history.user.username}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {history.changeType === 'created' && 'Created this task'}
                                                    {history.changeType === 'status_changed' && `Changed status from ${history.oldValue} to ${history.newValue}`}
                                                    {history.changeType === 'assigned' && `Assigned task`}
                                                    {history.changeType === 'moved' && `Moved from ${history.oldValue} to ${history.newValue}`}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDateTime(history.createdAt)}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
