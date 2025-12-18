import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import { KanbanBoard } from '@/components/kanban-board'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'

export default async function ProjectBoardPage({
    params,
}: {
    params: { projectId: string }
}) {
    const project = await getProject(params.projectId)

    if (!project) {
        notFound()
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/projects">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.projectName}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Kanban Board</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/projects/${project.id}/tasks/new`}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                    </Link>
                </Button>
            </div>

            <KanbanBoard taskLists={project.taskLists} projectId={project.id} />
        </div>
    )
}
