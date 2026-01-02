import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth' // Assuming this exists based on auth.ts
import { z } from 'zod'

// Validation Schema
const registerSchema = z.object({
    fullname: z.string().min(2, "Full name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.string().default("USER"),
    department: z.string().optional()
})

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // 1. Validate Input
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: "VALIDATION_ERROR",
                message: validation.error.issues[0].message
            }, { status: 400 })
        }

        const { fullname, username, email, password, role, department } = validation.data

        // 2. Check Existing Users (Active or Queue)
        // Check Users table
        const existingUser = await prisma.users.findUnique({ where: { Email: email } })
        if (existingUser) {
            return NextResponse.json({
                success: false,
                error: "EMAIL_EXISTS",
                message: "An account with this email already exists."
            }, { status: 409 })
        }

        // Check Queue
        const existingQueue = await prisma.userRegistrationQueue.findUnique({ where: { Email: email } })
        if (existingQueue) {
            if (existingQueue.Status === 'PENDING') {
                return NextResponse.json({
                    success: false,
                    error: "ALREADY_QUEUED",
                    message: "A registration request for this email is already pending approval."
                }, { status: 409 })
            } else {
                // If APPROVED or REJECTED, but the user didn't exist in the Users table check above,
                // it means this is a fresh attempt or a re-registration after deletion.
                // We clean up the old queue record to allow the new one.
                await prisma.userRegistrationQueue.delete({ where: { QueueID: existingQueue.QueueID } })
            }
        }

        // Check Existing Username in Users
        const existingUserName = await prisma.users.findUnique({ where: { UserName: username } })
        if (existingUserName) {
            return NextResponse.json({
                success: false,
                error: "USERNAME_EXISTS",
                message: "This username is already taken."
            }, { status: 409 })
        }

        // Check Existing Username in Queue
        const existingQueueUser = await prisma.userRegistrationQueue.findUnique({ where: { UserName: username } })
        if (existingQueueUser) {
            return NextResponse.json({
                success: false,
                error: "USERNAME_TAKEN_QUEUE",
                message: "This username is pending approval."
            }, { status: 409 })
        }

        // 3. Hash Password
        // Note: Assuming hashPassword from lib/auth is available. If not, I'll need to confirm imports.
        // Based on actions/auth.ts viewed earlier, explicit use of bcryptjs might be needed if lib/auth isn't standard.
        // I will use the imported hashPassword as seen in actions/auth.ts
        const hashedPassword = await hashPassword(password)

        // 4. Create Queue Record
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 7) // 7 days expiry

        const newQueueItem = await prisma.userRegistrationQueue.create({
            data: {
                FullName: fullname,
                // UserName Logic: generate from email or name + random?
                // Simple logic: email prefix? Or provided username?
                // The brief requested `username` in input but page.tsx form had `name` and `email` only initially?
                // Wait, page.tsx had `name`, `email`, `password`, `role`. No explicit `username` field.
                // I should probably generate a username or ask user. I'll use email prefix for now or add username to form later.
                // The brief `STEP 1` endpoint input showed `username`. I should add it to the schema and form.
                // For now, I'll derive username from email to avoid schema errors if I can't modify form immediately.
                // Actually, schema `UserRegistrationQueue` has `UserName String @unique`.
                // I will add `username` to the validation schema and require it from frontend.
                UserName: username, // Temporary fallback if not in body
                Email: email,
                PasswordHash: hashedPassword,
                Role: role.toUpperCase(),
                Department: department,
                ExpiresAt: expiryDate,
                Status: "PENDING"
            }
        })

        // 5. Notify Admins (Placeholder for now, or insert into QueueNotifications)
        // Ideally we'd loop through admin users and create notifications.
        // await prisma.queueNotifications.create(...)

        return NextResponse.json({
            success: true,
            message: "Registration submitted for approval",
            queueID: newQueueItem.QueueID,
            redirectTo: "/auth/queue",
            estimatedWaitTime: "24-48 hours"
        })

    } catch (error: any) {
        console.error("Registration Error:", error)
        return NextResponse.json({
            success: false,
            error: "SERVER_ERROR",
            message: error.message || "Internal Server Error"
        }, { status: 500 })
    }
}
