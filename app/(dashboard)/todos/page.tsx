import { TodoList } from "@/components/todos/todo-list"
import { getTodos, getUserProjects, getAssignedProjectTasks } from "@/actions/todos"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export const revalidate = 0

export default async function TodosPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const [todos, projects, assignedTasks] = await Promise.all([
        getTodos(),
        getUserProjects(),
        getAssignedProjectTasks()
    ])

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Todos</h1>
                <p className="text-muted-foreground">
                    Manage your personal tasks efficiently.
                </p>
            </div>

            <TodoList initialTodos={todos} projects={projects} assignedTasks={assignedTasks} />
        </div>
    )
}
