import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export const revalidate = 0

export default async function DashboardRootPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    const role = (user.role || "USER").toUpperCase()

    if (role === "ADMIN") {
        redirect("/dashboard/admin")
    }

    if (role === "MANAGER") {
        redirect("/dashboard/manager")
    }

    // Default to 'me' dashboard for Users (and fallback)
    redirect("/dashboard/me")

    // Unreachable
    return null
}
