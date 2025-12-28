'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, X, Shield, User, Trash2 } from 'lucide-react'
import { addMember, removeMember, getProjectMembers } from '@/actions/members'
import { cn } from '@/lib/utils'

interface TeamManagementModalProps {
    projectId: string
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function TeamManagementModal({ projectId, isOpen, onOpenChange }: TeamManagementModalProps) {
    const [members, setMembers] = useState<any[]>([])
    const [newEmail, setNewEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [inviteLoading, setInviteLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isOpen) {
            loadMembers()
        }
    }, [isOpen, projectId])

    async function loadMembers() {
        setLoading(true)
        const data = await getProjectMembers(projectId)
        setMembers(data)
        setLoading(false)
    }

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setInviteLoading(true)

        const result = await addMember(projectId, newEmail)

        if (result.error) {
            setError(result.error)
        } else {
            setNewEmail('')
            loadMembers()
        }
        setInviteLoading(false)
    }

    async function handleRemove(userId: number) {
        if (confirm('Are you sure you want to remove this member?')) {
            await removeMember(projectId, userId)
            loadMembers()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-[#09090b] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Manage Team
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Invite Form */}
                    <form onSubmit={handleInvite} className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-300">Invite by Email</Label>
                        <div className="flex gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@example.com"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary/50"
                            />
                            <Button type="submit" disabled={inviteLoading} className="bg-primary hover:bg-primary/90">
                                {inviteLoading ? 'Inviting...' : 'Invite'}
                            </Button>
                        </div>
                        {error && <p className="text-xs text-red-500">{error}</p>}
                    </form>

                    <div className="border-t border-white/10 my-4" />

                    {/* Members List */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-300 flex items-center justify-between">
                            Team Members
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{members.length}</span>
                        </h4>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {loading ? (
                                <div className="text-center py-4 text-muted-foreground text-sm">Loading members...</div>
                            ) : members.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground text-sm">No other members yet</div>
                            ) : (
                                members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold font-mono">
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{member.name}</p>
                                                <p className="text-xs text-gray-400">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                                                member.role === 'Admin' ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                                            )}>
                                                {member.role}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemove(member.id)}
                                                className="h-7 w-7 text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
