import { getProject } from '@/actions/projects'
import { TaskForm } from '@/components/tasks/global-task-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface NewProjectTaskPageProps {
    params: Promise<{
        projectId: string
    }>
}

export default async function NewProjectTaskPage({ params }: NewProjectTaskPageProps) {
    const { projectId } = await params
    const project = await getProject(projectId)

    if (!project) {
        notFound()
    }

    // We pass this project in an array to match the interface, 
    // and set it as initialProjectId so it's auto-selected.
    const projects = [project]

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/projects/${projectId}/board`}>
                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 hover:text-white">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Board
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">New Task</h1>
                    <p className="text-muted-foreground mt-1">Add a task to <span className="text-primary font-medium">{project.ProjectName}</span></p>
                </div>
            </div>

            <TaskForm
                projects={projects}
                initialProjectId={projectId}
                cancelHref={`/projects/${projectId}/board`}
            />
        </div>
    )
}
