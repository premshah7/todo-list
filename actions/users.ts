"use server"

import { requireRole } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { hashPassword } from "@/lib/auth"

export async function deleteUser(userId: number) {
    await requireRole(["ADMIN"])

    await prisma.users.delete({
        where: { UserID: userId }
    })

    revalidatePath("/dashboard/admin")
}

export async function updateUserRole(userId: number, newRole: string) {
    await requireRole(["ADMIN"])

    await prisma.users.update({
        where: { UserID: userId },
        data: { Role: newRole }
    })

    revalidatePath("/dashboard/admin")
}

export async function updateUserProfile(userId: number, data: { username?: string, email?: string, password?: string }) {
    // Admins can update anyone, Managers/Users update self (logic to be refined later if needed)
    // For now, assuming Admin context or Self

    const updateData: any = {}
    if (data.username) updateData.UserName = data.username
    if (data.email) updateData.Email = data.email
    if (data.password) updateData.PasswordHash = await hashPassword(data.password)

    await prisma.users.update({
        where: { UserID: userId },
        data: updateData
    })

    revalidatePath(`/dashboard/admin/users/${userId}`)
}
