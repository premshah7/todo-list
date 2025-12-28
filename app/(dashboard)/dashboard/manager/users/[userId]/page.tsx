import { requireRole } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function ManagerUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params
    const viewer = await requireRole(["MANAGER"])
    const viewerId = parseInt(viewer.id)

    const targetUserId = parseInt(userId)
    if (isNaN(targetUserId)) notFound()

    // Enforce Manager Scope: Can only view users who report to them
    const user = await prisma.users.findUnique({
        where: {
            UserID: targetUserId,
            ManagerID: viewerId
        },
        include: {
            Tasks: {
                where: {
                    // Start simplified: Manager sees all tasks of their subordinate? 
                    // Or only tasks in projects manager is in?
                    // For now, let's show all tasks of the subordinate to keep it simple, 
                    // assuming the manager oversees all their work.
                },
                orderBy: { CreatedAt: 'desc' },
                take: 20,
                include: {
                    TaskLists: {
                        include: { Projects: true }
                    }
                }
            }
        }
    })

    if (!user) {
        // Either user doesn't exist OR they are not managed by this viewer
        // We'll treat as 404 security by obscurity, or could say "Access Denied"
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <h2 className="text-xl font-semibold">Access Denied</h2>
                <p className="text-muted-foreground">This user is not in your managed team.</p>
                <Button asChild><a href="/dashboard/manager">Back to Team</a></Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <a href="/dashboard/manager">
                        <ArrowLeft className="w-5 h-5" />
                    </a>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{user.UserName}</h1>
                    <p className="text-muted-foreground">{user.Email}</p>
                </div>
                <div className="ml-auto">
                    <Badge variant="outline">Team Member</Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.Tasks.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No tasks assigned.</p>
                        ) : (
                            <div className="space-y-4">
                                {user.Tasks.map(t => (
                                    <div key={t.TaskID} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-medium text-sm">{t.Title}</div>
                                                <div className="text-xs text-muted-foreground">{t.TaskLists.Projects.ProjectName}</div>
                                            </div>
                                            <Badge variant={t.Status === 'Completed' ? 'default' : 'secondary'}>{t.Status}</Badge>
                                        </div>
                                        {t.Description && (
                                            <p className="text-xs text-muted-foreground line-clamp-2">{t.Description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
