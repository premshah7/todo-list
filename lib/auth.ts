import { auth } from '@/lib/next-auth'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

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
        const session = await auth()

        if (!session?.user) {
            return null
        }

        return {
            id: Number(session.user.id),
            username: session.user.username,
            email: session.user.email,
            roles: session.user.roles,
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
