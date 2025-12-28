'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Menu, User, LogOut, Settings, Search, Bell, Sun, Moon, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { useTheme } from "next-themes"
import { ThemeToggle } from '@/components/theme-toggle'

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
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    // ... search and filter handlers ...

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleFilter = (filter: string) => {
        const params = new URLSearchParams(searchParams)
        if (filter === 'All') {
            params.delete('filter')
        } else {
            params.set('filter', filter)
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const currentFilter = searchParams.get('filter') || 'All'

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
        await signOut({ redirect: false })
        window.location.href = '/'
    }

    return (
        <header className="sticky top-0 z-30 mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-2">

                {/* Mobile Menu & Title Area */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-foreground tracking-tight">Project Kanban Board</h1>
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
                                defaultValue={searchParams.get('search')?.toString()}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-muted/40 border border-border hover:border-border/80 focus:border-primary rounded-xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border">
                            {['All', 'My Tasks', 'High'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => handleFilter(filter)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                                        currentFilter === filter
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <ThemeToggle />

                        <button className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-background" />
                        </button>

                        <div className="h-6 w-px bg-white/10 mx-1" />

                        {/* User Profile */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-muted transition-all group"
                            >
                                <div className="hidden sm:block text-right mr-1">
                                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {user.username}
                                    </p>
                                    <div className="flex justify-end">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium tracking-wide border border-primary/20">
                                            {user.roles[0] || 'USER'}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white border border-white/10 group-hover:scale-105 transition-transform">
                                    <span className="font-bold text-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-xl border border-border bg-popover z-50">
                                    {/* User info */}
                                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                                        <p className="text-sm font-medium text-foreground">
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
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/profile')
                                                setIsDropdownOpen(false)
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                    </div>

                                    {/* Logout */}
                                    <div className="p-2 border-t border-border">
                                        <button
                                            onClick={() => handleLogout()}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
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
        </header >
    )
}
