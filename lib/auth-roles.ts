import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export type UserRole = "ADMIN" | "MANAGER" | "USER"

export async function requireRole(allowedRoles: UserRole[]) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    // Normalize role to uppercase since DB string might vary or be user input
    const userRole = (user.role || "USER").toUpperCase() as UserRole

    if (!allowedRoles.includes(userRole)) {
        // Basic 403 handling via redirect for now, could be a dedicated error page
        redirect("/dashboard?error=Unauthorized")
    }

    return user
}

export function canViewUser(viewer: any, targetUserId: string | number) {
    const viewerRole = (viewer.role || "USER").toUpperCase()
    const viewerId = parseInt(viewer.id)
    const targetId = typeof targetUserId === 'string' ? parseInt(targetUserId) : targetUserId

    if (viewerRole === "ADMIN") return true
    if (viewerId === targetId) return true

    // Manager check requires fetching relationship, so this sync helper 
    // is mostly for basic "is it me or admin" checks. 
    // For manager relationship checks, use DB queries.
    return false
}

export function isManagerOf(manager: any, subordinateId: number) {
    // This would typically check the database or a loaded list of subordinates
    // Since we don't have the full tree in the session, this is a placeholder 
    // implying meaningful checks should happen in Data Access Layer (DAL) / Actions.
    return true
}
