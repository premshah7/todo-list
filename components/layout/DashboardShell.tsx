"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
    children: React.ReactNode
    user: any // keeping generic to avoid strict type issues during refactor
}

export function DashboardShell({ children, user }: DashboardShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar with controlled state */}
            <Sidebar user={user} isOpen={isSidebarOpen} />

            {/* Main Content Wrapper */}
            <div
                className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "md:ml-72" : "md:ml-28"
                )}
            >
                {/* Navbar passes the toggle handler */}
                <Navbar user={user} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-6 md:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
