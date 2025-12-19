import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
const SALT_ROUNDS = 10

export interface JWTPayload {
    userId: number
    email: string
}

/**
 * Sign a JWT token for a user
 */
export function signToken(userId: number, email: string): string {
    const payload: JWTPayload = { userId, email }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
        return decoded
    } catch (error) {
        return null
    }
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

/**
 * Get the current authenticated user from the request
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth-token')

        if (!token) {
            return null
        }

        const payload = verifyToken(token.value)
        if (!payload) {
            return null
        }

        // Fetch user from database
        const user = await prisma.users.findUnique({
            where: { UserID: payload.userId },
            include: {
                UserRoles: {
                    include: {
                        Roles: true,
                    },
                },
            },
        })

        if (!user) {
            return null
        }

        return {
            id: user.UserID,
            username: user.UserName,
            email: user.Email,
            createdAt: user.CreatedAt,
            roles: user.UserRoles.map((ur) => ur.Roles.RoleName),
        }
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

/**
 * Check if user has a specific role
 */
export async function userHasRole(roleName: string): Promise<boolean> {
    const user = await getCurrentUser()
    if (!user) return false
    return user.roles.includes(roleName)
}
