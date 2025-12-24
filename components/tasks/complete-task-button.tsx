'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { setTaskStatus } from '@/actions/tasks'
import { toast } from 'sonner'

interface CompleteTaskButtonProps {
    taskId: string
    currentStatus: string
}

export function CompleteTaskButton({ taskId, currentStatus }: CompleteTaskButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const isCompleted = currentStatus === 'Completed'

    const handleToggleStatus = async () => {
        setIsLoading(true)
        const newStatus = isCompleted ? 'Pending' : 'Completed'
        const result = await setTaskStatus(taskId, newStatus)

        if (result.success) {
            toast.success(isCompleted ? 'Task reopened' : 'Task completed')
        } else {
            toast.error(result.error)
        }
        setIsLoading(false)
    }

    return (
        <Button
            onClick={handleToggleStatus}
            disabled={isLoading}
            variant={isCompleted ? "outline" : "default"}
            className={isCompleted ? "border-green-500 text-green-500 hover:bg-green-500/10" : "bg-green-600 hover:bg-green-700 text-white"}
        >
            {isCompleted ? (
                <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reopen Task
                </>
            ) : (
                <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Completed
                </>
            )}
        </Button>
    )
}
