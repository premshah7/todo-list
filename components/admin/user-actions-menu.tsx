"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, UserCog, Eye } from "lucide-react"
import { deleteUser, updateUserRole } from "@/actions/users"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface UserActionsMenuProps {
    userId: number
    userName: string
    currentRole: string
}

export function UserActionsMenu({ userId, userName, currentRole }: UserActionsMenuProps) {
    const router = useRouter()
    const [roleDialogOpen, setRoleDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete user ${userName}? This action cannot be undone.`)) return;

        try {
            await deleteUser(userId)
        } catch (e) {
            alert("Failed to delete user")
        }
    }

    const handleRoleUpdate = async (newRole: string) => {
        setLoading(true)
        try {
            await updateUserRole(userId, newRole)
            setRoleDialogOpen(false)
        } catch (error) {
            alert("Failed to update role")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/users/${userId}`)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleDialogOpen(true)}>
                        <UserCog className="mr-2 h-4 w-4" /> Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User Role</DialogTitle>
                        <DialogDescription>
                            Change the access level for {userName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select defaultValue={currentRole} onValueChange={handleRoleUpdate} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">User (Standard)</SelectItem>
                                <SelectItem value="MANAGER">Manager (Team Lead)</SelectItem>
                                <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
