import { requireRole, canViewUser } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params
    const viewer = await requireRole(["ADMIN"])

    const targetUserId = parseInt(userId)
    if (isNaN(targetUserId)) notFound()

    const user = await prisma.users.findUnique({
        where: { UserID: targetUserId },
        include: {
            Projects: true,
            Tasks: {
                orderBy: { CreatedAt: 'desc' },
                take: 50,
                include: {
                    TaskLists: {
                        include: { Projects: true }
                    }
                }
            },
            Manager: true, // Include manager details
            TeamMembers: true // Include subordinates if any
        }
    })

    if (!user) notFound()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <a href="/dashboard/admin">
                        <ArrowLeft className="w-5 h-5" />
                    </a>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{user.UserName}</h1>
                    <p className="text-muted-foreground">{user.Email}</p>
                </div>
                <div className="ml-auto">
                    <Badge variant={user.Role === 'ADMIN' ? 'destructive' : 'secondary'}>{user.Role}</Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Joined</div>
                                <div>{new Date(user.CreatedAt).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Manager</div>
                                <div>
                                    {user.Manager ? (
                                        <a href={`/dashboard/admin/users/${user.Manager.UserID}`} className="hover:underline text-primary">
                                            {user.Manager.UserName}
                                        </a>
                                    ) : 'None'}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Team Size</div>
                                <div>{user.TeamMembers.length} members</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Workload</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Tasks</span>
                                <span className="font-bold">{user.Tasks.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Pending</span>
                                <span className="font-bold">{user.Tasks.filter(t => t.Status !== 'Completed').length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Projects</CardTitle>
                            <CardDescription>Projects created by this user.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.Projects.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No projects created.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {user.Projects.map(p => (
                                        <li key={p.ProjectID} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div>
                                                <div className="font-medium text-sm">{p.ProjectName}</div>
                                                <div className="text-xs text-muted-foreground">{p.Status}</div>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={`/projects/${p.ProjectID}`}>View</a>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Task History</CardTitle>
                            <CardDescription>Recent tasks assigned to {user.UserName}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.Tasks.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No tasks found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {user.Tasks.map(t => (
                                        <div key={t.TaskID} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                                            <div>
                                                <div className="font-medium text-sm">{t.Title}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {t.TaskLists.Projects.ProjectName} • {t.Status}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {t.DueDate ? new Date(t.DueDate).toLocaleDateString() : 'No Due Date'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
