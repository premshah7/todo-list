import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        console.log('🔵 [REGISTER API] Starting registration...')
        console.log('🔵 [REGISTER API] Data:', { username: body.username, email: body.email })

        // Validate input
        const validated = registerSchema.parse(body)
        console.log('✅ [REGISTER API] Validation successful')

        // Check if user already exists
        console.log('🔵 [REGISTER API] Checking for existing user...')
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { Email: validated.email },
                    { UserName: validated.username },
                ],
            },
        })

        if (existingUser) {
            console.log('❌ [REGISTER API] User already exists')
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 400 }
            )
        }
        console.log('✅ [REGISTER API] No existing user found')

        // Hash password
        console.log('🔵 [REGISTER API] Hashing password...')
        const passwordHash = await hashPassword(validated.password)
        console.log('✅ [REGISTER API] Password hashed')

        // Create user
        console.log('🔵 [REGISTER API] Creating user in database...')
        const user = await prisma.users.create({
            data: {
                UserName: validated.username,
                Email: validated.email,
                PasswordHash: passwordHash,
            },
        })
        console.log('✅ [REGISTER API] User created with ID:', user.UserID)

        // Assign default "User" role
        console.log('🔵 [REGISTER API] Finding User role...')
        const userRole = await prisma.roles.findUnique({
            where: { RoleName: 'User' },
        })

        if (userRole) {
            console.log('✅ [REGISTER API] User role found, ID:', userRole.RoleID)
            console.log('🔵 [REGISTER API] Assigning role to user...')
            await prisma.userRoles.create({
                data: {
                    UserID: user.UserID,
                    RoleID: userRole.RoleID,
                },
            })
            console.log('✅ [REGISTER API] Role assigned successfully')
        } else {
            console.log('⚠️  [REGISTER API] User role not found in database')
        }

        console.log('✅ [REGISTER API] Registration completed successfully!')

        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful',
                user: {
                    id: user.UserID,
                    username: user.UserName,
                    email: user.Email,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('❌ [REGISTER API] Fatal error:', error)
        console.error('❌ [REGISTER API] Error message:', error.message)

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to register user', details: error.message },
            { status: 500 }
        )
    }
}
