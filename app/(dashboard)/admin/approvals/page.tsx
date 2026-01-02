import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPendingApprovals, getApprovalStats, approveUser, rejectUser, batchApproveUsers, batchRejectUsers } from "@/actions/admin"
import { DataTable } from "@/components/admin/data-table"
import { columns, ApprovalRequest } from "@/components/admin/approval-columns"
import { ApprovalModal } from "@/components/admin/approval-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, ShieldAlert } from "lucide-react"
import { Toaster } from "sonner"
import { ClientPage } from "./client-page" // Split into client component for interaction

export default async function AdminApprovalsPage({
    searchParams
}: {
    searchParams: { q?: string; status?: string }
}) {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const { q, status } = await searchParams
    const pendingRequests = await getPendingApprovals(q, status)
    const stats = await getApprovalStats()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPending}</div>
                        <p className="text-xs text-muted-foreground">Requests awaiting action</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approvedToday}</div>
                        <p className="text-xs text-muted-foreground">New active users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgWaitTime}</div>
                        <p className="text-xs text-muted-foreground">For approval resolution</p>
                    </CardContent>
                </Card>
            </div>

            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <ClientPage
                    initialData={pendingRequests as ApprovalRequest[]}
                    currentUser={user}
                />
            </div>
        </div>
    )
}
