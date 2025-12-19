import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { signToken, verifyPassword } from '@/lib/auth'
import { loginSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        console.log('🔵 [LOGIN API] Attempting login for:', body.email)

        // Validate input
        const validated = loginSchema.parse(body)
        console.log('✅ [LOGIN API] Validation successful')

        // Find user by email
        console.log('🔵 [LOGIN API] Finding user...')
        const user = await prisma.users.findUnique({
            where: { Email: validated.email },
            include: {
                UserRoles: {
                    include: {
                        Roles: true,
                    },
                },
            },
        })

        if (!user) {
            console.log('❌ [LOGIN API] User not found')
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }
        console.log('✅ [LOGIN API] User found:', user.UserName)

        // Verify password
        console.log('🔵 [LOGIN API] Verifying password...')
        const isPasswordValid = await verifyPassword(validated.password, user.PasswordHash)

        if (!isPasswordValid) {
            console.log('❌ [LOGIN API] Invalid password')
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }
        console.log('✅ [LOGIN API] Password verified')

        // Generate JWT token
        console.log('🔵 [LOGIN API] Generating JWT token...')
        const token = signToken(user.UserID, user.Email)
        console.log('✅ [LOGIN API] Token generated')

        // Create response with cookie
        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user: {
                    id: user.UserID,
                    username: user.UserName,
                    email: user.Email,
                    roles: user.UserRoles.map((ur) => ur.Roles.RoleName),
                },
            },
            { status: 200 }
        )

        // Set httpOnly cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        console.log('✅ [LOGIN API] Login completed successfully!')

        return response
    } catch (error: any) {
        console.error('❌ [LOGIN API] Fatal error:', error)
        console.error('❌ [LOGIN API] Error message:', error.message)

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to login', details: error.message },
            { status: 500 }
        )
    }
}
