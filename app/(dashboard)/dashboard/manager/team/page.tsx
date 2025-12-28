import { requireRole } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function ManagerTeamPage() {
    const user = await requireRole(["MANAGER", "ADMIN"])
    const userId = parseInt(user.id)

    // Fetch team members with stats
    const teamMembers = await prisma.users.findMany({
        where: { ManagerID: userId },
        include: {
            _count: {
                select: { Tasks: true }
            },
            Tasks: {
                where: { Status: 'Completed' },
                select: { TaskID: true } // Just to count completed
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">My Team</h1>
                <Badge variant="secondary" className="text-sm px-3 py-1">{teamMembers.length} Members</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assigned Users</CardTitle>
                    <CardDescription>Manage and view performance of your direct reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    {teamMembers.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">You don't have any team members assigned yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {teamMembers.map(member => (
                                <div key={member.UserID} className="flex flex-col p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{member.UserName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold">{member.UserName}</div>
                                                <div className="text-sm text-muted-foreground">{member.Role}</div>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={`/dashboard/manager/users/${member.UserID}`}>Profile</a>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-auto text-sm">
                                        <div className="bg-secondary/50 p-2 rounded text-center">
                                            <div className="font-bold">{member._count.Tasks}</div>
                                            <div className="text-xs text-muted-foreground">Total Tasks</div>
                                        </div>
                                        <div className="bg-green-500/10 p-2 rounded text-center text-green-700 dark:text-green-400">
                                            <div className="font-bold">{member.Tasks.length}</div>
                                            <div className="text-xs opacity-70">Completed</div>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                                        {member.Email}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
