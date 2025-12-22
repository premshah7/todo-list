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
        console.log('🔵 [REGISTER] Starting registration process...')

        const data = {
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            name: formData.get('name') as string,
        }
        console.log('🔵 [REGISTER] Form data extracted:', { username: data.username, email: data.email })

        console.log('🔵 [REGISTER] Validating data...')
        const validated = registerSchema.parse(data)
        console.log('✅ [REGISTER] Validation successful')

        // Check if user already exists
        console.log('🔵 [REGISTER] Checking for existing user...')
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { Email: validated.email },
                    { UserName: validated.username },
                ],
            },
        })

        if (existingUser) {
            console.log('❌ [REGISTER] User already exists')
            return { error: 'User with this email or username already exists' }
        }
        console.log('✅ [REGISTER] No existing user found')

        // Hash password
        console.log('🔵 [REGISTER] Hashing password...')
        const passwordHash = await hashPassword(validated.password)
        console.log('✅ [REGISTER] Password hashed')

        // Create user
        console.log('🔵 [REGISTER] Creating user in database...')
        const user = await prisma.users.create({
            data: {
                UserName: validated.username,
                Email: validated.email,
                PasswordHash: passwordHash,
            },
        })
        console.log('✅ [REGISTER] User created with ID:', user.UserID)

        // Assign role (default to "User" if not specified or invalid)
        const requestedRole = (formData.get('role') as string) || 'User'
        console.log('🔵 [REGISTER] Requested role:', requestedRole)

        const validRoles = ['User', 'Manager', 'Admin']
        const roleName = validRoles.includes(requestedRole) ? requestedRole : 'User'

        console.log('🔵 [REGISTER] Finding role:', roleName)
        const role = await prisma.roles.findUnique({
            where: { RoleName: roleName },
        })

        if (role) {
            console.log('✅ [REGISTER] Role found, ID:', role.RoleID)
            console.log('🔵 [REGISTER] Assigning role to user...')
            await prisma.userRoles.create({
                data: {
                    UserID: user.UserID,
                    RoleID: role.RoleID,
                },
            })
            console.log('✅ [REGISTER] Role assigned successfully')
        } else {
            console.log('⚠️  [REGISTER] Role not found in database:', roleName)
        }

        console.log('✅ [REGISTER] Registration completed successfully!')
        return { success: true, userId: user.UserID }
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ [REGISTER] Validation error:', error.issues)
            return { error: error.message }
        }
        console.error('❌ [REGISTER] Fatal error:', error)
        console.error('❌ [REGISTER] Error type:', error instanceof Error ? error.constructor.name : typeof error)
        console.error('❌ [REGISTER] Error message:', error instanceof Error ? error.message : String(error))
        if (error instanceof Error && error.stack) {
            console.error('❌ [REGISTER] Error stack:', error.stack)
        }
        return { error: 'Failed to register user' }
    }
}
