import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Mail, ShieldAlert } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'

export const revalidate = 60

export default async function UsersPage() {
    const currentUser = await getCurrentUser()

    // Redirect if not authenticated
    if (!currentUser) {
        redirect('/login')
    }

    const userRole = currentUser.roles[0] // Primary role

    // Build query based on role
    let whereClause: any = {}
    let pageTitle = 'Users'
    let pageDescription = 'Manage team members and roles'

    if (userRole === 'Admin' || userRole === 'Manager') {
        // Admin and Manager see all users
        whereClause = {}
        pageTitle = 'All Users'
        pageDescription = 'View and manage all team members'
    } else {
        // Regular users are not allowed to view this page
        redirect('/')
    }

    const users = await prisma.users.findMany({
        where: whereClause,
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
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${userRole === 'Admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : userRole === 'Manager'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                        {userRole}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{pageDescription}</p>
            </div>

            {users.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ShieldAlert className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No users found</p>
                    </CardContent>
                </Card>
            ) : (
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
                                        <div className="flex flex-wrap gap-1 justify-end">
                                            {user.UserRoles.map(ur => (
                                                <span key={ur.Roles.RoleID} className={`px-2 py-0.5 text-xs font-medium rounded-full ${ur.Roles.RoleName === 'Admin'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    : ur.Roles.RoleName === 'Manager'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {ur.Roles.RoleName}
                                                </span>
                                            ))}
                                            {user.UserRoles.length === 0 && (
                                                <span className="text-gray-500 italic">No role</span>
                                            )}
                                        </div>
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
            )}
        </div>
    )
}

