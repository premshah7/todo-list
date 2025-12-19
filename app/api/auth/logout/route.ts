import { NextResponse } from 'next/server'

export async function POST() {
    console.log('🔵 [LOGOUT API] Logging out user')

    const response = NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { status: 200 }
    )

    // Clear the auth cookie
    response.cookies.delete('auth-token')

    console.log('✅ [LOGOUT API] Logout completed')

    return response
}
