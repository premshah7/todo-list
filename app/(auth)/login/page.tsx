'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const ROLES = ['User', 'Admin', 'Manager'] as const

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState<string>('User')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            // Using NextAuth signIn
            // We use 'credentials' provider id, and redirect: false to handle errors manually if desired, 
            // or let it redirect automatically. Here keeping manual control for error display.
            const result = await import('next-auth/react').then(mod => mod.signIn('credentials', {
                email,
                password,
                role: selectedRole,
                redirect: false,
            }))

            if (result?.error) {
                setError('Invalid email or password')
                setLoading(false)
                return
            }

            // Success! Redirect to dashboard
            router.push('/dashboard')
            router.refresh()
        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-background mix-blend-multiply" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-20" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[128px] opacity-20" />

            <Card className="w-full max-w-md relative z-10">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center">Sign in</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-foreground transition-all duration-300 outline-none"
                                required
                            >
                                {ROLES.map((role) => (
                                    <option key={role} value={role} className="bg-black text-white">
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary hover:text-primary/80 hover:underline font-medium font-tech">
                                Register
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
