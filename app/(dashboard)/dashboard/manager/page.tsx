import { requireRole } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { UnifiedKanbanBoard } from "@/components/unified-kanban-board"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getTimeStatus } from "@/lib/date-utils"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock } from "lucide-react"

export default async function ManagerDashboardPage() {
    const user = await requireRole(["MANAGER", "ADMIN"])
    const userId = parseInt(user.id)

    // Fetch team members
    const teamMembers = await prisma.users.findMany({
        where: { ManagerID: userId },
        select: { UserID: true }
    })

    const teamMemberIds = teamMembers.map(m => m.UserID)

    const [allTasks, urgentTasks, completedTasks] = await Promise.all([
        prisma.tasks.findMany({
            where: {
                AssignedTo: { in: teamMemberIds }
            },
            include: {
                Users: true,
                TaskLists: { include: { Projects: true } }
            },
            // Default sort for Kanban isn't strict, but urgency matters
            orderBy: { DueDate: 'asc' }
        }),
        prisma.tasks.findMany({
            where: {
                AssignedTo: { in: teamMemberIds },
                Status: { not: 'Completed' },
                DueDate: { not: null }
            },
            include: {
                Users: true,
                TaskLists: { include: { Projects: true } }
            },
            orderBy: { DueDate: 'asc' },
            take: 5 // Top 5 most urgent
        }),
        prisma.taskHistory.findMany({
            where: {
                NewValue: 'Completed',
                Tasks: {
                    AssignedTo: { in: teamMemberIds }
                }
            },
            include: {
                Tasks: {
                    include: {
                        Users: true, // Assignee
                        TaskLists: { include: { Projects: true } }
                    }
                },
                Users: true // Who changed it (Completer)
            },
            orderBy: { ChangeTime: 'desc' },
            take: 5
        })
    ])

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Dashboard</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Managing {teamMembers.length} team members • {allTasks.length} total tasks
                    </div>
                </div>
            </div>

            {/* Urgency Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Urgent Tasks */}
                <div className="space-y-4">
                    {urgentTasks.length > 0 ? (
                        <Card className="border-l-4 border-l-amber-500 h-full">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-amber-600" />
                                    <CardTitle>Needs Attention</CardTitle>
                                </div>
                                <CardDescription>Top tasks due soon.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {urgentTasks.slice(0, 3).map(task => {
                                        const { label, colorClass, isOverdue } = getTimeStatus(task.DueDate)
                                        return (
                                            <div key={task.TaskID} className="flex justify-between items-center p-2 rounded border bg-background/50">
                                                <div className="overflow-hidden">
                                                    <div className="font-medium text-sm truncate">{task.Title}</div>
                                                    <div className="text-xs text-muted-foreground">{task.Users?.UserName}</div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <Badge variant="outline" className={`${colorClass} border-0 text-[10px]`}>{label}</Badge>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center p-6 text-muted-foreground border-dashed">
                            <p>No urgent tasks pending.</p>
                        </Card>
                    )}
                </div>

                {/* Recently Completed */}
                <div className="space-y-4">
                    <Card className="border-l-4 border-l-green-500 h-full">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-600" />
                                <CardTitle>Recently Completed</CardTitle>
                            </div>
                            <CardDescription>What the team has done lately.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {completedTasks.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No tasks completed recently.</p>
                                ) : (
                                    completedTasks.map(history => (
                                        <div key={history.HistoryID} className="flex justify-between items-center p-2 rounded border bg-background/50 opacity-80">
                                            <div className="overflow-hidden">
                                                <div className="font-medium text-sm line-through text-muted-foreground truncate">{history.Tasks.Title}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Completed by {history.Users.UserName}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="text-[10px]">Done</Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex-1 min-h-0 pt-2">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Team Kanban Board
                </h2>
                <UnifiedKanbanBoard initialTasks={allTasks} />
            </div>
        </div>
    )
}
