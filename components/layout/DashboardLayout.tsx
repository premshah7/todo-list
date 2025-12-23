'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
    children: React.ReactNode
    user: {
        username: string
        email: string
        roles: string[]
    }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Floating Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Main content - Pushed by sidebar */}
            <div
                className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-500 ease-out",
                    isSidebarOpen ? "ml-72" : "ml-28" // 64px(4rem) + 16px(1rem padding) gap
                )}
            >
                {/* Header */}
                <div className="px-6 pt-6">
                    <Header user={user} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                </div>

                {/* Page content */}
                <main className="flex-1 px-6 py-4 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
