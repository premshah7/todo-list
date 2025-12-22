import { auth } from "@/lib/next-auth"
import { NextResponse } from "next/server"

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register']

// API routes that require authentication
const protectedApiRoutes = ['/api/projects', '/api/tasks', '/api/my-tasks', '/api/admin']

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const isPublicRoute = publicRoutes.some((route) => nextUrl.pathname.startsWith(route))
    const isProtectedApi = protectedApiRoutes.some((route) => nextUrl.pathname.startsWith(route))

    // If accessing protected API without token, return 401
    if (isProtectedApi && !isLoggedIn) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // If not authenticated and trying to access protected page, redirect to login
    if (!isPublicRoute && !isLoggedIn && !nextUrl.pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/login', nextUrl))
    }

    // If authenticated and trying to access login/register, redirect to dashboard
    if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
