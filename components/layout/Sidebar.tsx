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
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Users', href: '/users', icon: Users },
]

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out',
                    'lg:translate-x-0 lg:static lg:z-0',
                    isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:w-20'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
                        <div className={cn('flex items-center gap-3', !isOpen && 'lg:justify-center lg:w-full')}>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">PM</span>
                            </div>
                            {isOpen && (
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Project Manager
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onToggle}
                            className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                                !isOpen && 'lg:justify-center'
                                            )}
                                            title={!isOpen ? item.name : undefined}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            {isOpen && <span>{item.name}</span>}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* Toggle button (desktop only) */}
                    <div className="hidden lg:flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
