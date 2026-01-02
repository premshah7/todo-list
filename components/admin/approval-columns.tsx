"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

// Simplified Type for UI
export type ApprovalRequest = {
    QueueID: string
    FullName: string
    Email: string
    UserName: string
    Role: string
    Department: string | null
    Status: string
    SubmittedAt: Date
    onViewDetails?: (id: string) => void
    onApprove?: (id: string, role: string, dept: string) => void
    onReject?: (id: string, reason: string) => void
}

export const columns: ColumnDef<ApprovalRequest>[] = [
    // ... existing columns ...
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "FullName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.getValue("FullName")}</span>
                <span className="text-xs text-muted-foreground">{row.original.UserName}</span>
            </div>
        )
    },
    {
        accessorKey: "Email",
        header: "Email",
    },
    {
        accessorKey: "Role",
        header: "Role",
        cell: ({ row }) => <Badge variant="outline">{row.getValue("Role")}</Badge>
    },
    {
        accessorKey: "Department",
        header: "Department",
        cell: ({ row }) => row.getValue("Department") || "-"
    },
    {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("Status") as string
            return (
                <Badge className={
                    status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' :
                        status === 'APPROVED' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                            'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                }>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "SubmittedAt",
        header: "Submitted",
        cell: ({ row }) => {
            return (
                <span className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(row.getValue("SubmittedAt")))} ago
                </span>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const request = row.original

            if (request.Status !== 'PENDING') return null

            return (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                        onClick={() => request.onViewDetails?.(request.QueueID)} // Using View Details as "Approve" trigger since it opens modal
                    >
                        Review
                    </Button>
                    {/* Alternatively, direct actions if needed immediately, but modal is safer for role assignment */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.Email)}>
                                Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => request.onViewDetails?.(request.QueueID)}>
                                View Details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
