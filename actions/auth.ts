'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
})

export async function registerUser(formData: FormData) {
    try {
        const data = {
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            name: formData.get('name') as string,
        }

        const validated = registerSchema.parse(data)

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validated.email },
                    { username: validated.username },
                ],
            },
        })

        if (existingUser) {
            return { error: 'User with this email or username already exists' }
        }

        // Hash password
        const passwordHash = await hashPassword(validated.password)

        // Create user
        const user = await prisma.user.create({
            data: {
                username: validated.username,
                email: validated.email,
                passwordHash,
                name: validated.name,
            },
        })

        // Assign default "User" role
        const userRole = await prisma.role.findUnique({
            where: { roleName: 'User' },
        })

        if (userRole) {
            await prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: userRole.id,
                },
            })
        }

        return { success: true, userId: user.id }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        }
        return { error: 'Failed to register user' }
    }
}
