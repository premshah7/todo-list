"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, Settings, Users, FolderKanban, User } from "lucide-react"

interface SidebarProps {
    user: {
        role?: string
    }
    isOpen?: boolean
    onToggle?: () => void
}

export function Sidebar({ user, isOpen = true }: SidebarProps) {
    const pathname = usePathname()
    const role = (user.role || "USER").toUpperCase()

    const dashboardLink = role === "ADMIN" ? "/dashboard/admin" :
        role === "MANAGER" ? "/dashboard/manager" :
            "/dashboard/me"

    const navigation = [
        { name: "Dashboard", href: dashboardLink, icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "USER"] },
        { name: "Projects", href: "/projects", icon: FolderKanban, roles: ["ADMIN", "MANAGER", "USER"] },
        { name: "Todos", href: "/todos", icon: CheckSquare, roles: ["ADMIN", "MANAGER", "USER"] },
        { name: "Profile", href: "/dashboard/profile", icon: User, roles: ["ADMIN", "MANAGER", "USER"] },
        // Admin Only
        { name: "Users", href: "/dashboard/admin/users", icon: Users, roles: ["ADMIN"] },
        // Manager Only
        { name: "Team", href: "/dashboard/manager/team", icon: Users, roles: ["MANAGER"] },
    ]

    const filteredNav = navigation.filter(item => item.roles.includes(role))

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-500 ease-out hidden md:block",
                isOpen ? "w-72" : "w-28"
            )}
        >
            <div className="flex h-16 items-center border-b px-6">
                <Link href={dashboardLink} className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                        P
                    </div>
                    {isOpen && <span>Manager</span>}
                </Link>
            </div>

            <div className="py-6 px-3 space-y-1">
                {filteredNav.map((item) => {
                    // Check active state more permissively for sub-routes, but prevent overlap
                    const isActive = pathname === item.href || (
                        item.href !== "/dashboard/me" &&
                        pathname.startsWith(item.href + "/") &&
                        // Special case: Don't highlight Manager Dashboard if we are on Team page
                        !(item.href === "/dashboard/manager" && pathname.startsWith("/dashboard/manager/team")) &&
                        // Special case: Don't highlight Admin Dashboard if we are on Users page
                        !(item.href === "/dashboard/admin" && pathname.startsWith("/dashboard/admin/users"))
                    )

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <div className="min-w-[20px]">
                                <item.icon className="h-5 w-5" />
                            </div>
                            {isOpen && <span>{item.name}</span>}
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}
