import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch stats
    const totalProjects = await prisma.projects.count({
        where: { CreatedBy: Number(user.id) }
    })

    const totalTasks = await prisma.tasks.count({
        where: { AssignedTo: Number(user.id) }
    })

    const completedTasks = await prisma.tasks.count({
        where: {
            AssignedTo: Number(user.id),
            Status: 'Completed'
        }
    })

    const overdueTasks = await prisma.tasks.count({
        where: {
            AssignedTo: Number(user.id),
            Status: { not: 'Completed' },
            DueDate: { lt: new Date() }
        }
    })

    // Fetch recent activity (Task History)
    const recentActivity = await prisma.taskHistory.findMany({
        where: {
            OR: [
                { ChangedBy: Number(user.id) },
                { Tasks: { AssignedTo: Number(user.id) } }
            ]
        },
        take: 5,
        orderBy: { ChangeTime: 'desc' },
        include: {
            Tasks: {
                select: { Title: true }
            },
            Users: {
                select: { UserName: true }
            }
        }
    })

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Dashboard
                </h1>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalProjects}</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalTasks}</p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{completedTasks}</p>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{overdueTasks}</p>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActivity.length === 0 ? (
                                    <p className="text-sm text-gray-500">No recent activity</p>
                                ) : (
                                    recentActivity.map((activity) => (
                                        <div key={activity.HistoryID} className="flex items-start space-x-3">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {activity.Users.UserName} {activity.ChangeType} task "{activity.Tasks.Title}"
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {formatDate(activity.ChangeTime)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                <Link href="/projects/new" className="block w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">+ Create New Project</span>
                                </Link>
                                <Link href="/my-tasks" className="block w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                                    <span className="text-sm font-medium text-green-900 dark:text-green-300">View My Tasks</span>
                                </Link>
                                <Link href="/reports" className="block w-full text-left px-4 py-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                                    <span className="text-sm font-medium text-purple-900 dark:text-purple-300">📊 View Reports</span>
                                </Link>
                                {((user as any).roles.includes('Admin') || (user as any).roles.includes('Manager')) && (
                                    <Link href="/users" className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">⚙️ Manage Users</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
