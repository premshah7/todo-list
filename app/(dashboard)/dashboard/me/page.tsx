import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UnifiedKanbanBoard } from "@/components/unified-kanban-board"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckSquare, Flame, Clock } from "lucide-react"
import { getTimeStatus } from "@/lib/date-utils"
import { Badge } from "@/components/ui/badge"

export default async function UserDashboardPage() {
    const user = await getCurrentUser()
    if (!user) return null

    const userId = parseInt(user.id)

    // Parallel fetch: All tasks (Kanban), Urgent Tasks, Todos Stats
    const [myTasks, urgentTasks, totalTodos] = await Promise.all([
        prisma.tasks.findMany({
            where: { AssignedTo: userId },
            include: {
                Users: true,
                TaskLists: { include: { Projects: true } }
            },
            orderBy: { DueDate: 'asc' } // Sort by date generally
        }),
        prisma.tasks.findMany({
            where: {
                AssignedTo: userId,
                Status: { not: "Completed" },
                DueDate: { not: null }
            },
            include: {
                Users: true, // Self
                TaskLists: { include: { Projects: true } }
            },
            orderBy: { DueDate: 'asc' },
            take: 4 // Top 4 urgent
        }),
        prisma.todos.count({ where: { UserID: userId, IsCompleted: false } })
    ])

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Workspace</h1>
                    <p className="text-muted-foreground">Welcome back, {user.username}</p>
                </div>

                <Card className="w-56 bg-primary/5 border-primary/20">
                    <CardHeader className="py-2 px-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xs font-semibold text-primary uppercase tracking-wider">Personal Todos</CardTitle>
                        <CheckSquare className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="py-2 px-4 pb-3">
                        <div className="text-2xl font-bold text-foreground">{totalTodos}</div>
                        <p className="text-[10px] text-muted-foreground">items pending</p>
                    </CardContent>
                </Card>
            </div>

            {/* Urgency Section */}
            {urgentTasks.length > 0 && (
                <div className="grid gap-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <h2 className="text-lg font-semibold">Most Urgent Tasks</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {urgentTasks.map(task => {
                            const { label, colorClass, isOverdue } = getTimeStatus(task.DueDate)
                            return (
                                <div key={task.TaskID} className={`p-4 rounded-xl border bg-card transition-all hover:shadow-md ${isOverdue ? 'border-red-200 dark:border-red-900/50 ring-1 ring-red-100 dark:ring-red-900/20' : ''}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="outline" className={`${colorClass} border-0`}>
                                            {label}
                                        </Badge>
                                        {isOverdue && <Flame className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />}
                                    </div>
                                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 h-10">{task.Title}</h3>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 border-t pt-2 border-dashed">
                                        <span className="truncate max-w-[120px]">{task.TaskLists.Projects.ProjectName}</span>
                                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] lowercase">{task.Priority}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="flex-1 min-h-0 pt-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> All Tasks
                </h2>
                <div className="flex-1">
                    <UnifiedKanbanBoard initialTasks={myTasks} />
                </div>
            </div>
        </div>
    )
}
