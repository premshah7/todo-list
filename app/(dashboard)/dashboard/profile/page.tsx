import { requireRole } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { ProfileForm } from "@/components/profile/profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Calendar, Shield, Briefcase, FileText, CheckCircle, AlertCircle, Clock, LayoutDashboard, Settings } from "lucide-react"

export default async function ProfilePage() {
    const user = await requireRole(["ADMIN", "MANAGER", "USER"])
    const userId = parseInt(user.id)

    // Fetch comprehensive user data
    const dbUser = await prisma.users.findUnique({
        where: { UserID: userId },
        include: {
            profile: true,
            _count: {
                select: {
                    Projects: true,
                    Tasks: true,
                    Todos: true
                }
            },
            Tasks: {
                where: { Status: { not: 'Completed' } },
                orderBy: { DueDate: 'asc' },
                take: 5,
                include: { TaskLists: { include: { Projects: true } } }
            },
            Projects: {
                orderBy: { CreatedAt: 'desc' },
                take: 5
            }
        }
    })

    if (!dbUser) return <div>User not found</div>

    const initials = dbUser.UserName.substring(0, 2).toUpperCase()

    // Derived Stats
    const totalProjects = dbUser._count.Projects
    const totalTasks = dbUser._count.Tasks
    const totalTodos = dbUser._count.Todos

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <Tabs defaultValue="overview" className="space-y-8">
                <div className="flex justify-center">
                    <TabsList className="grid w-[400px] grid-cols-2">
                        <TabsTrigger value="overview">
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <Settings className="w-4 h-4 mr-2" /> Edit Profile
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-8">
                    {/* Header Section */}
                    <div className="relative overflow-hidden rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
                        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Avatar */}
                            <div className="w-32 h-32 rounded-[32px] bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-500/30 ring-4 ring-white dark:ring-zinc-900 shrink-0">
                                <img
                                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${dbUser.UserName}`}
                                    alt={dbUser.UserName}
                                    className="w-full h-full object-cover rounded-[32px]"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div>
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                                            {dbUser.UserName}
                                        </h1>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border 
                                            ${dbUser.Role === 'ADMIN' ? 'bg-red-100 text-red-600 border-red-200' :
                                                dbUser.Role === 'MANAGER' ? 'bg-purple-100 text-purple-600 border-purple-200' :
                                                    'bg-indigo-100 text-indigo-600 border-indigo-200'}`}>
                                            {dbUser.Role}
                                        </span>
                                    </div>
                                    {dbUser.profile?.JobTitle && (
                                        <p className="text-lg text-zinc-600 dark:text-zinc-300 font-medium">
                                            {dbUser.profile.JobTitle} {dbUser.profile.Department && <span className="text-zinc-400">• {dbUser.profile.Department}</span>}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-2">
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} />
                                            {dbUser.Email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            Joined {new Date(dbUser.CreatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                        <CheckCircle size={16} className="text-indigo-500" />
                                        <span className="font-bold text-zinc-700 dark:text-zinc-200">{totalTasks}</span>
                                        <span className="text-xs text-zinc-400 font-bold uppercase">Tasks</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                        <Briefcase size={16} className="text-purple-500" />
                                        <span className="font-bold text-zinc-700 dark:text-zinc-200">{totalProjects}</span>
                                        <span className="text-xs text-zinc-400 font-bold uppercase">Projects</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                        <FileText size={16} className="text-emerald-500" />
                                        <span className="font-bold text-zinc-700 dark:text-zinc-200">{totalTodos}</span>
                                        <span className="text-xs text-zinc-400 font-bold uppercase">Todos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Assigned Tasks */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Active Tasks</h2>
                                <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black px-2 py-1 rounded-md">
                                    {dbUser.Tasks.length} Pending
                                </span>
                            </div>
                            <div className="space-y-3">
                                {dbUser.Tasks.length > 0 ? (
                                    dbUser.Tasks.map(task => (
                                        <div key={task.TaskID} className="group p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${task.Priority === 'Critical' || task.Priority === 'High'
                                                    ? 'bg-orange-500/10 text-orange-600'
                                                    : 'bg-emerald-500/10 text-emerald-600'
                                                    }`}>
                                                    {task.Priority === 'Critical' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors truncate max-w-[200px]">
                                                        {task.Title}
                                                    </h3>
                                                    <p className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                                                        <Clock size={12} />
                                                        Due: {task.DueDate ? new Date(task.DueDate).toLocaleDateString() : 'No Date'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider">
                                                {task.Status}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-zinc-400 italic bg-zinc-50 dark:bg-white/5 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                        No active tasks assigned.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Projects */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Projects</h2>
                                <span className="bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 text-xs font-black px-2 py-1 rounded-md">
                                    Last 5
                                </span>
                            </div>
                            <div className="space-y-3">
                                {dbUser.Projects.length > 0 ? (
                                    dbUser.Projects.map(proj => (
                                        <div key={proj.ProjectID} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                                        {proj.ProjectName}
                                                    </h3>
                                                    <p className="text-xs text-zinc-500">
                                                        Created {new Date(proj.CreatedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-wider">
                                                {proj.Status}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-zinc-400 italic bg-zinc-50 dark:bg-white/5 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                        No projects joined yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                            <CardDescription>Manage your account details and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm
                                user={{
                                    name: dbUser.UserName,
                                    email: dbUser.Email,
                                    role: dbUser.Role
                                }}
                                profile={dbUser.profile}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
