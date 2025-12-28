"use server"

import { requireRole } from "@/lib/auth-roles"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema for profile updates (whitelisted fields)
const profileSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    bio: z.string().max(500).optional(),
    // Admin
    jobTitle: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
    timezone: z.string().max(50).optional(),
    // Manager
    teamName: z.string().max(100).optional(),
    designation: z.string().max(100).optional(),
    // User
    skills: z.string().max(500).optional(),
    workHours: z.string().max(100).optional(),
    // Preferences
    emailNotifications: z.boolean().optional(),
    theme: z.string().optional(),
})

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    // 1. Verify User (Any role can update their own profile)
    const currentUser = await requireRole(["ADMIN", "MANAGER", "USER"])
    const userId = parseInt(currentUser.id)

    // 2. Validate Data
    const validData = profileSchema.parse(data)

    // 3. Update User Core Data
    await prisma.users.update({
        where: { UserID: userId },
        data: {
            UserName: validData.name,
            Email: validData.email
        }
    })

    // 4. Update or Create Profile
    await prisma.profile.upsert({
        where: { UserID: userId },
        update: {
            Bio: validData.bio,
            JobTitle: validData.jobTitle,
            Department: validData.department,
            Timezone: validData.timezone,
            TeamName: validData.teamName,
            Designation: validData.designation,
            Skills: validData.skills,
            WorkHours: validData.workHours,
            EmailNotifications: validData.emailNotifications,
            Theme: validData.theme,
        },
        create: {
            UserID: userId,
            Bio: validData.bio,
            JobTitle: validData.jobTitle,
            Department: validData.department,
            Timezone: validData.timezone,
            TeamName: validData.teamName,
            Designation: validData.designation,
            Skills: validData.skills,
            WorkHours: validData.workHours,
            EmailNotifications: validData.emailNotifications || true,
            Theme: validData.theme || "system",
        }
    })

    revalidatePath("/dashboard/profile")
    return { success: true }
}
