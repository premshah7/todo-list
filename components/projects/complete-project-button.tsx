'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { completeProject } from '@/actions/projects'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CompleteProjectButtonProps {
    projectId: string
    isCompleted: boolean
}

export function CompleteProjectButton({ projectId, isCompleted }: CompleteProjectButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    if (isCompleted) {
        return (
            <div className="flex items-center gap-2 text-green-500 font-medium px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                <CheckCircle2 className="h-5 w-5" />
                Project Completed
            </div>
        )
    }

    const handleComplete = async () => {
        setIsLoading(true)
        const result = await completeProject(projectId)

        if (result.success) {
            toast.success('Project completed!')
            router.refresh()
        } else {
            toast.error(result.error)
        }
        setIsLoading(false)
    }

    return (
        <Button
            onClick={handleComplete}
            disabled={isLoading}
            variant="outline"
            className="text-green-500 hover:text-green-400 hover:bg-green-500/10 border-green-500/20"
        >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Complete Project
        </Button>
    )
}
