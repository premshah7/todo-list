import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import { KanbanBoard } from '@/components/kanban-board'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'

export const revalidate = 60

export default async function ProjectBoardPage({
    params,
}: {
    params: Promise<{ projectId: string }>
}) {
    const { projectId } = await params
    console.log('[ProjectBoardPage] Rendering for projectId:', projectId)
    const project = await getProject(projectId)
    console.log('[ProjectBoardPage] getProject result:', project ? `Found project ${project.ProjectID}` : 'null')

    if (!project) {
        notFound()
    }

    const taskLists = project.TaskLists.map(list => ({
        id: list.ListID.toString(),
        listName: list.ListName,
        tasks: list.Tasks.map(task => ({
            id: task.TaskID.toString(),
            title: task.Title,
            description: task.Description,
            priority: task.Priority,
            status: task.Status,
            dueDate: task.DueDate,
            assignedTo: task.Users ? {
                username: task.Users.UserName,
                name: task.Users.UserName
            } : null
        }))
    }))

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/projects">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.ProjectName}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Kanban Board</p>
                    </div>
                </div>
                <Link href={`/projects/${project.ProjectID}/tasks/new`}>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                    </Button>
                </Link>
            </div>

            <KanbanBoard taskLists={taskLists} projectId={project.ProjectID.toString()} />
        </div>
    )
}
