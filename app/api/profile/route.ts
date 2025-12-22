import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
    try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.users.findUnique({
            where: { UserID: currentUser.id },
            include: {
                UserRoles: {
                    include: {
                        Roles: true,
                    },
                },
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            id: user.UserID,
            username: user.UserName,
            email: user.Email,
            createdAt: user.CreatedAt,
            roles: user.UserRoles.map(ur => ur.Roles.RoleName),
        })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { username, email } = body

        // Validate input
        if (!username || !email) {
            return NextResponse.json({ error: 'Username and email are required' }, { status: 400 })
        }

        if (username.length < 3) {
            return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Check for duplicate username (excluding current user)
        const existingUsername = await prisma.users.findFirst({
            where: {
                UserName: username,
                NOT: { UserID: currentUser.id },
            },
        })

        if (existingUsername) {
            return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
        }

        // Check for duplicate email (excluding current user)
        const existingEmail = await prisma.users.findFirst({
            where: {
                Email: email,
                NOT: { UserID: currentUser.id },
            },
        })

        if (existingEmail) {
            return NextResponse.json({ error: 'Email is already in use' }, { status: 409 })
        }

        // Update user
        const updatedUser = await prisma.users.update({
            where: { UserID: currentUser.id },
            data: {
                UserName: username,
                Email: email,
            },
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.UserID,
                username: updatedUser.UserName,
                email: updatedUser.Email,
            },
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
