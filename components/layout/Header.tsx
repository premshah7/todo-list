'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, User, LogOut, Settings, Search, Bell, Sun, Moon, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

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
    const [isDark, setIsDark] = useState(true) // Default to dark for design preference
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
        await signOut({ callbackUrl: '/login' })
    }

    return (
        <header className="sticky top-0 z-30 mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-2">

                {/* Mobile Menu & Title Area */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-white tracking-tight">Project Kanban Board</h1>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>Website Redesign</span>
                        </div>
                    </div>
                </div>

                {/* Center/Right Actions */}
                <div className="flex flex-1 flex-col lg:flex-row items-stretch lg:items-center justify-end gap-4 lg:gap-6">

                    {/* Search & Filters */}
                    <div className="flex items-center gap-3 flex-1 lg:max-w-xl">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tasks, projects..."
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/70"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                            {['All', 'My Tasks', 'High'].map((filter, i) => (
                                <button
                                    key={filter}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                                        i === 0 ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-yellow-400 transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-[#0f1117]" />
                        </button>

                        <div className="h-6 w-px bg-white/10 mx-1" />

                        {/* User Profile */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-white/5 transition-all group"
                            >
                                <div className="hidden sm:block text-right mr-1">
                                    <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                        {user.username}
                                    </p>
                                    <div className="flex justify-end">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium tracking-wide bordered border-primary/20">
                                            {user.roles[0] || 'USER'}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 border border-white/10 group-hover:scale-105 transition-transform">
                                    <span className="text-white font-bold text-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl border border-white/10 bg-[#1c1c1c]">
                                    {/* User info */}
                                    <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                                        <p className="text-sm font-medium text-white">
                                            {user.username}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {user.email}
                                        </p>
                                    </div>

                                    {/* Menu items */}
                                    <div className="p-2 space-y-0.5">
                                        <button
                                            onClick={() => {
                                                router.push('/profile')
                                                setIsDropdownOpen(false)
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/profile')
                                                setIsDropdownOpen(false)
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                    </div>

                                    {/* Logout */}
                                    <div className="p-2 border-t border-white/5">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
