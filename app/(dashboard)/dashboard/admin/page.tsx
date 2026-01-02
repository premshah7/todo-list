import { requireRole } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, ShieldAlert, Folder, CheckSquare } from "lucide-react"
import { getPendingApprovals, getApprovalStats } from "@/actions/admin"
import { ClientPage } from "../../admin/approvals/client-page"
import { ApprovalRequest } from "@/components/admin/approval-columns"
import { getCurrentUser } from "@/lib/auth"

export default async function AdminDashboardPage({
    searchParams
}: {
    searchParams: { q?: string; status?: string }
}) {
    const awaitedSearchParams = await searchParams
    const { q, status } = awaitedSearchParams

    // Parallel fetching for performance
    const [
        user,
        stats,
        approvalStats,
        pendingRequests
    ] = await Promise.all([
        getCurrentUser(),
        prisma.$transaction([
            prisma.users.count(),
            prisma.projects.count(),
            prisma.tasks.count()
        ]),
        getApprovalStats(),
        getPendingApprovals(q, status)
    ])

    const [usersCount, projectsCount, tasksCount] = stats

    // Ensure only admins see this page (double check, though middleware/layout likely handles it)
    if (user?.role !== "ADMIN") return <div>Access Denied</div>

    return (
        <div className="space-y-8 p-8 pt-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            </div>

            {/* Combined Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* General Stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectsCount}</div>
                    </CardContent>
                </Card>

                {/* Approval Stats */}
                <Card className="bg-orange-500/5 border-orange-200/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-600">Pending Approvals</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-700">{approvalStats.totalPending}</div>
                        <p className="text-xs text-orange-600/60">Awaiting action</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvalStats.approvedToday}</div>
                        <p className="text-xs text-muted-foreground">New active users</p>
                    </CardContent>
                </Card>
            </div>

            {/* Approval Requests Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Pending Requests</h2>
                </div>
                <div className="bg-card border rounded-lg p-1">
                    <ClientPage
                        initialData={pendingRequests as ApprovalRequest[]}
                        currentUser={user}
                    />
                </div>
            </div>
        </div>
    )
}
