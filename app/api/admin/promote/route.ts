import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    try {
        const user = await prisma.users.update({
            where: { Email: email },
            data: { Role: 'ADMIN' }
        })

        return NextResponse.json({
            success: true,
            message: `User ${user.Email} is now an ADMIN`,
            user: { email: user.Email, role: user.Role }
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
