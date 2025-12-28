'use server'

import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string().optional(),
})

export async function registerUser(formData: FormData) {
    try {
        const rawFormData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role'),
        }

        const validatedFields = registerSchema.safeParse(rawFormData)

        if (!validatedFields.success) {
            return { error: 'Invalid input data' }
        }

        const { username, email, password, role } = validatedFields.data

        // Check availability
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { Email: email },
                    { UserName: username }
                ]
            }
        })

        if (existingUser) {
            return { error: 'Username or Email already exists' }
        }

        const hashedPassword = await hashPassword(password)

        // Create user with new Role column
        await prisma.users.create({
            data: {
                UserName: username,
                Email: email,
                PasswordHash: hashedPassword,
                Role: (role || 'USER').toUpperCase() // Ensure uppercase for enum-like string
            }
        })

        return { success: true }

    } catch (error) {
        console.error('Registration Error:', error)
        return { error: 'Failed to create account' }
    }
}
