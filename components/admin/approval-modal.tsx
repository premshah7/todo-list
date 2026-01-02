"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface ApprovalModalProps {
    isOpen: boolean
    onClose: () => void
    data: any
    onApprove: (id: string, role: string, dept: string) => Promise<void>
    onReject: (id: string, reason: string) => Promise<void>
}

export function ApprovalModal({ isOpen, onClose, data, onApprove, onReject }: ApprovalModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [role, setRole] = useState(data?.Role || "USER")
    const [department, setDepartment] = useState(data?.Department || "")
    const [rejectReason, setRejectReason] = useState("")
    const [showRejectForm, setShowRejectForm] = useState(false)

    if (!data) return null

    const handleApprove = async () => {
        setIsLoading(true)
        await onApprove(data.QueueID, role, department)
        setIsLoading(false)
        onClose()
    }

    const handleReject = async () => {
        if (!showRejectForm) {
            setShowRejectForm(true)
            return
        }
        setIsLoading(true)
        await onReject(data.QueueID, rejectReason)
        setIsLoading(false)
        setShowRejectForm(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Review Registration Request</DialogTitle>
                    <DialogDescription>
                        Review the details for {data.FullName} ({data.UserName}).
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold text-muted-foreground block">Email</span>
                            <span>{data.Email}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-muted-foreground block">Username</span>
                            <span>@{data.UserName}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Assigned Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering, Sales, etc." />
                    </div>

                    {showRejectForm && (
                        <div className="space-y-2 animate-in slide-in-from-top-2">
                            <Label className="text-red-500">Rejection Reason</Label>
                            <Textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Please explain why this request is being rejected..."
                                className="border-red-200 focus-visible:ring-red-500 dark:border-red-900"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-2 sm:justify-between">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
                        </Button>

                        {!showRejectForm && (
                            <Button
                                onClick={handleApprove}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
