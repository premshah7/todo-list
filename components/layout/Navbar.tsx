"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { BackButton } from "@/components/ui/back-button"
import { Menu, PanelLeftClose } from "lucide-react"

interface NavbarProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
    onMenuClick?: () => void
}

export function Navbar({ user, onMenuClick }: NavbarProps) {

    const pathname = usePathname()

    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return null
    }

    const getPageTitle = (path: string) => {
        if (path === "/dashboard") return "Dashboard"
        if (path.startsWith("/projects")) return "Projects"
        if (path.startsWith("/todos")) return "My Todos"
        if (path.startsWith("/team")) return "Team"
        if (path.startsWith("/settings") || path.startsWith("/dashboard/profile")) return "Profile"
        return "Project Manager"
    }

    const { name, email } = user || {}
    const initials = name ? name.substring(0, 2).toUpperCase() : "U"

    return (
        <nav className="border-b bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <button onClick={onMenuClick} className="mr-2 md:hidden p-1 hover:bg-muted rounded-md">
                    <Menu className="h-5 w-5" />
                </button>
                <button onClick={onMenuClick} className="hidden md:block mr-2 p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <PanelLeftClose className="h-5 w-5" />
                </button>
                <BackButton />
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                    {getPageTitle(pathname)}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="text-sm text-muted-foreground mr-2">{name}</span>
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-background">
                        {initials}
                    </div>
                </Link>
                <SignOutButton />
            </div>
        </nav>
    )
}
