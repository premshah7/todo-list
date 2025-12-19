import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Mail } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function UsersPage() {
    const users = await prisma.users.findMany({
        include: {
            UserRoles: {
                include: {
                    Roles: true,
                },
            },
            _count: {
                select: {
                    Tasks: true,
                    Projects: true,
                },
            },
        },
        orderBy: {
            CreatedAt: 'desc',
        },
    })

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage team members and roles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <Card key={user.UserID}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{user.UserName}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {user.Email}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                                    <span className="font-medium">
                                        {user.UserRoles.map(ur => ur.Roles.RoleName).join(', ') || 'No role'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Tasks:</span>
                                    <span className="font-medium">{user._count.Tasks}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Projects:</span>
                                    <span className="font-medium">{user._count.Projects}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                                    <span className="font-medium">{formatDate(user.CreatedAt)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
