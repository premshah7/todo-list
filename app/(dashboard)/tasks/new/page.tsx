import { getProjects } from '@/actions/projects'
import { TaskForm } from '@/components/tasks/global-task-form'
import { Link } from 'lucide-react'

export const revalidate = 60

export default async function NewTaskPage() {
    const projects = await getProjects()

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">New Task</h1>
                <p className="text-muted-foreground mt-1">Create a new task in any project</p>
            </div>

            <TaskForm projects={projects} />
        </div>
    )
}
