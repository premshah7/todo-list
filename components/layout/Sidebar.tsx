'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    BarChart3,
    Users,
    Menu,
    X,
    UserCircle,
} from 'lucide-react'

import { useSession } from 'next-auth/react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: UserCircle },
    { name: 'Users', href: '/users', icon: Users },
]

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [isHovered, setIsHovered] = useState(false)

    // Sidebar expands if it's toggled open OR hovered
    const isExpanded = isOpen || isHovered

    const filteredNavigation = navigation.filter(item => {
        if (item.name === 'Users') {
            const roles = (session?.user as any)?.roles || []
            return roles.includes('Admin') || roles.includes('Manager')
        }
        return true
    })

    return (
        <>
            {/* Mobile overlay - only shows when manually toggled open on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-4 left-4 z-50 h-[calc(100vh-2rem)] glass-panel rounded-2xl transition-all duration-500 ease-out border-r-0',
                    // Floating logic:
                    isExpanded ? 'w-72 translate-x-0' : 'w-20 translate-x-0',
                    'lg:translate-x-0'
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex flex-col h-full py-6">
                    {/* Logo area */}
                    <div className={cn("flex items-center px-6 mb-8", !isExpanded && "justify-center px-2")}>
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-lg shadow-orange-500/20">
                            <span className="text-white font-bold text-lg">AI</span>
                        </div>
                        {isExpanded && (
                            <div className="ml-3 animate-in fade-in slide-in-from-left-4 duration-500">
                                <h1 className="text-lg font-bold text-white tracking-tight">Focus<span className="text-primary">Flow</span></h1>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-1">
                        {filteredNavigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group relative',
                                        isActive
                                            ? 'bg-white/10 text-white font-medium'
                                            : 'text-muted-foreground hover:bg-white/5 hover:text-white',
                                        !isExpanded && 'justify-center px-0 aspect-square rounded-xl'
                                    )}
                                    title={!isExpanded ? item.name : undefined}
                                >
                                    <item.icon className={cn("w-5 h-5 transition-transform duration-200",
                                        isActive ? "text-primary" : "group-hover:text-white"
                                    )} />

                                    {isExpanded && (
                                        <span className="text-sm tracking-wide">{item.name}</span>
                                    )}

                                    {/* Active Indicator for collapsed state */}
                                    {isActive && !isExpanded && (
                                        <div className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Pro Banner / Bottom Actions */}
                    {isExpanded && (
                        <div className="px-4 mb-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5">
                                <h4 className="text-sm font-semibold text-white mb-1">Upload Plan</h4>
                                <p className="text-xs text-muted-foreground mb-3">Get access to AI features</p>
                                <button className="w-full py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
                                    Upgrade
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bottom Toggle */}
                    <div className="px-4 mt-2">
                        <button
                            onClick={onToggle}
                            className={cn(
                                "flex items-center justify-center w-full p-2 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all duration-300",
                            )}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside >
        </>
    )
}
