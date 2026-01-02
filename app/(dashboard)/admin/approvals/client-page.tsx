"use client"

import { useState } from "react"
import { DataTable } from "@/components/admin/data-table"
import { columns, ApprovalRequest } from "@/components/admin/approval-columns"
import { ApprovalModal } from "@/components/admin/approval-modal"
import { approveUser, rejectUser, batchApproveUsers, batchRejectUsers } from "@/actions/admin"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ClientPageProps {
    initialData: ApprovalRequest[]
    currentUser: any
}

export function ClientPage({ initialData, currentUser }: ClientPageProps) {
    const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Handler to open details
    const handleViewDetails = (id: string) => {
        const request = initialData.find(r => r.QueueID === id)
        if (request) {
            setSelectedRequest(request)
            setIsModalOpen(true)
        }
    }

    // Enhance columns with the view handler
    const columnsWithActions = columns.map(col => {
        if (col.id === 'actions') {
            return {
                ...col,
                cell: ({ row }: any) => {
                    // We inject the handler into the row data essentially via a wrapper or just use the original
                    // But the cell renderer in `approval-columns` expects specific structure. 
                    // A cleaner way in React Table is to use meta or pass simpler props.
                    // For now, let's modify the row.original on the fly if needed, or 
                    // since `columns` is defined outside, we can't easily pass the handler.
                    // FIX: Redefine columns here or pass a Context? 

                    // Simpler fix: Pass the handler to the `DataTable` which passes it down? 
                    // Or just redefine columns here which is safe since it's client comp.
                    return col.cell({ row: { ...row, original: { ...row.original, onViewDetails: handleViewDetails } } } as any)
                }
            }
        }
        return col
    })

    const handleApprove = async (id: string, role: string, dept: string) => {
        try {
            const res = await approveUser(id, parseInt(currentUser.id), { role, department: dept })
            if (res.success) {
                toast.success(`User Approved!`)
            } else {
                toast.error(res.error || "Approval failed")
            }
        } catch (e) {
            toast.error("Something went wrong")
        }
    }

    const handleReject = async (id: string, reason: string) => {
        try {
            const res = await rejectUser(id, parseInt(currentUser.id), reason)
            if (res.success) {
                toast.success("User Rejected")
            } else {
                toast.error(res.error || "Rejection failed")
            }
        } catch (e) {
            toast.error("Something went wrong")
        }
    }

    const handleBatchApprove = async (ids: string[]) => {
        toast.promise(batchApproveUsers(ids, parseInt(currentUser.id)), {
            loading: 'Approving users...',
            success: (data) => `Approved ${data.successCount} users!`,
            error: 'Batch approval failed',
        });
    }

    const handleBatchReject = async (ids: string[]) => {
        if (!confirm("Are you sure you want to reject these users?")) return;

        toast.promise(batchRejectUsers(ids, parseInt(currentUser.id)), {
            loading: 'Rejecting users...',
            success: 'Users rejected',
            error: 'Batch update failed',
        });
    }

    return (
        <>
            <DataTable
                columns={columnsWithActions}
                data={initialData}
                searchKey="FullName"
                batchActions={(ids) => (
                    <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={() => handleBatchApprove(ids)}>
                            Approve Selected ({ids.length})
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBatchReject(ids)}>
                            Reject Selected
                        </Button>
                    </div>
                )}
            />

            <ApprovalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedRequest}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </>
    )
}
