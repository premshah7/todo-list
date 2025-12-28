import { requireRole } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserActionsMenu } from "@/components/admin/user-actions-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function AdminUsersPage() {
    const user = await requireRole(["ADMIN"])

    const users = await prisma.users.findMany({
        orderBy: { CreatedAt: 'desc' },
        include: {
            _count: {
                select: { Projects: true, Tasks: true }
            }
        }
    })

    const managers = users.filter(u => u.Role === 'MANAGER')
    const admins = users.filter(u => u.Role === 'ADMIN')
    const regularUsers = users.filter(u => u.Role === 'USER')

    const UserTable = ({ data }: { data: typeof users }) => (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Projects</th>
                        <th className="px-4 py-3">Tasks</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map(u => (
                        <tr key={u.UserID} className="hover:bg-muted/50">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${u.UserName}`} />
                                        <AvatarFallback>{u.UserName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{u.UserName}</div>
                                        <div className="text-xs text-muted-foreground">{u.Email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <Badge variant="outline" className={`
                                    ${u.Role === 'ADMIN' ? 'border-red-500 text-red-500' :
                                        u.Role === 'MANAGER' ? 'border-purple-500 text-purple-500' :
                                            'border-slate-500 text-slate-500'}
                                `}>
                                    {u.Role}
                                </Badge>
                            </td>
                            <td className="px-4 py-3">{u._count.Projects}</td>
                            <td className="px-4 py-3">{u._count.Tasks}</td>
                            <td className="px-4 py-3 text-muted-foreground">{new Date(u.CreatedAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right">
                                <UserActionsMenu userId={u.UserID} userName={u.UserName} currentRole={u.Role} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">System Users</h1>
                <Badge variant="secondary" className="text-sm">{users.length} Total Accounts</Badge>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
                    <TabsTrigger value="managers">Managers ({managers.length})</TabsTrigger>
                    <TabsTrigger value="users">Standard Users ({regularUsers.length})</TabsTrigger>
                    <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Accounts</CardTitle>
                            <CardDescription>Full list of registered users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserTable data={users} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="managers" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Managers</CardTitle>
                            <CardDescription>Users with team management privileges.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserTable data={managers} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Standard Users</CardTitle>
                            <CardDescription>Regular team members.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserTable data={regularUsers} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="admins" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Administrators</CardTitle>
                            <CardDescription>System administrators with full access.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserTable data={admins} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
