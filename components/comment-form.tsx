'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { addComment } from '@/actions/tasks'

interface CommentFormProps {
    taskId: string
}

export function CommentForm({ taskId }: CommentFormProps) {
    const router = useRouter()
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!comment.trim()) return

        setLoading(true)
        try {
            await addComment(taskId, comment)
            setComment('')
            router.refresh()
        } catch (error) {
            console.error('Failed to add comment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <Button type="submit" disabled={loading || !comment.trim()}>
                {loading ? 'Adding...' : 'Add Comment'}
            </Button>
        </form>
    )
}
