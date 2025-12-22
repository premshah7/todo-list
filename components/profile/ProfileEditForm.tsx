'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface ProfileEditFormProps {
    initialUsername: string
    initialEmail: string
}

export function ProfileEditForm({ initialUsername, initialEmail }: ProfileEditFormProps) {
    const router = useRouter()
    const [username, setUsername] = useState(initialUsername)
    const [email, setEmail] = useState(initialEmail)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const hasChanges = username !== initialUsername || email !== initialEmail

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to update profile')
                setLoading(false)
                return
            }

            setSuccess('Profile updated successfully!')
            setLoading(false)

            // Refresh the page to show updated data
            router.refresh()
        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-600 dark:text-green-400">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Username
                    </label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        minLength={3}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="min-w-32"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}
