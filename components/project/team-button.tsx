'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { TeamManagementModal } from '@/components/project/team-management-modal'

interface TeamButtonProps {
    projectId: string
}

export function TeamButton({ projectId }: TeamButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="h-11 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-white font-medium transition-all"
            >
                <Users className="h-4 w-4 mr-2 text-indigo-400" />
                Team
            </Button>

            <TeamManagementModal
                projectId={projectId}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            />
        </>
    )
}
