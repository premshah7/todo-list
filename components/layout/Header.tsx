'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, User, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
    user: {
        username: string
        email: string
        roles: string[]
    }
    onMenuClick: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left side - Menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Center - Search or page title can go here */}
                <div className="flex-1" />

                {/* Right side - User menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.roles[0] || 'User'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {user.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* User info */}
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {user.email}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    {user.roles.map((role) => (
                                        <span
                                            key={role}
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        router.push('/profile')
                                        setIsDropdownOpen(false)
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </button>
                                <button
                                    onClick={() => {
                                        router.push('/profile')
                                        setIsDropdownOpen(false)
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
