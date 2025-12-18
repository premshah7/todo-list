'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FolderKanban, CheckSquare, Users, BarChart3, LogOut } from 'lucide-react'

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/projects', label: 'Projects', icon: FolderKanban },
        { href: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
        { href: '/users', label: 'Users', icon: Users },
        { href: '/reports', label: 'Reports', icon: BarChart3 },
    ]

    return (
        <div className="flex h-screen w-64 flex-col glass-dark border-r border-white/10">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white">ProjectHub</h1>
                <p className="text-sm text-gray-300 mt-1">
                    {session?.user?.name || (session?.user as any)?.username}
                </p>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname?.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isActive
                                    ? 'glass-card text-white font-medium shadow-lg'
                                    : 'text-gray-300 hover:glass hover:text-white'
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-white/10 p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:glass transition-all duration-200"
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
