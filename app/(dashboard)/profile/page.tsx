import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Calendar, Shield, FolderKanban, CheckSquare, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { ProfileEditForm } from '@/components/profile/ProfileEditForm'

export const revalidate = 60

export default async function ProfilePage() {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        redirect('/login')
    }

    // Fetch detailed user data with stats
    const user = await prisma.users.findUnique({
        where: { UserID: currentUser.id },
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
                    TaskComments: true,
                },
            },
        },
    })

    if (!user) {
        redirect('/login')
    }

    const roles = user.UserRoles.map(ur => ur.Roles.RoleName)
    const primaryRole = roles[0] || 'User'

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your account information</p>
                </div>

                {/* Profile Header Card */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-3xl font-bold text-white">
                                    {user.UserName.slice(0, 2).toUpperCase()}
                                </span>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.UserName}</h2>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                                    <Mail className="h-4 w-4" />
                                    {user.Email}
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                                    {roles.map((role) => (
                                        <span
                                            key={role}
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${role === 'Admin'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                : role === 'Manager'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                }`}
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Account Information
                            </CardTitle>
                            <CardDescription>Your account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Username</span>
                                <span className="font-medium text-gray-900 dark:text-white">{user.UserName}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Email</span>
                                <span className="font-medium text-gray-900 dark:text-white">{user.Email}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Role
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">{primaryRole}</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Member Since
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatDate(user.CreatedAt)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderKanban className="h-5 w-5" />
                                Activity Statistics
                            </CardTitle>
                            <CardDescription>Your activity overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <FolderKanban className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{user._count.Projects}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Projects</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <CheckSquare className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{user._count.Tasks}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Tasks</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <MessageSquare className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{user._count.TaskComments}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Comments</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Profile Section */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Update your account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileEditForm
                            initialUsername={user.UserName}
                            initialEmail={user.Email}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
