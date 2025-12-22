// lib/next-auth.ts
import NextAuth, { DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'

// Extend the built-in session type
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            roles: string[]
            username: string
        } & DefaultSession["user"]
    }
}

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    // Move secret to standard AUTH_SECRET env var which NextAuth v5 picks up automatically
    // or keep it explicitly if needed, but usually not required if env var is set.

    session: {
        strategy: 'jwt',
    },

    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                role: { label: 'Role', type: 'text' },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                // Ensure types are strings
                const email = credentials.email as string
                const password = credentials.password as string
                const role = (credentials as any).role as string

                const user = await prisma.users.findUnique({
                    where: { Email: email },
                    include: {
                        UserRoles: {
                            include: { Roles: true },
                        },
                    },
                })

                if (!user) return null

                const isValid = await verifyPassword(
                    password,
                    user.PasswordHash
                )

                if (!isValid) return null

                // Verify strict role match
                const userRoles = user.UserRoles.map(r => r.Roles.RoleName)
                if (!userRoles.includes(role)) {
                    console.log(`❌ Login denied: User ${email} does not have role ${role}`)
                    return null
                }

                return {
                    id: user.UserID.toString(),
                    email: user.Email,
                    name: user.UserName,
                    // valid return fields for v5 'user' object are limited, 
                    // we map custom fields in the jwt callback
                    username: user.UserName,
                    roles: userRoles,
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                // @ts-expect-error - user type extension is tricky in authorize return
                token.username = user.username
                // @ts-expect-error
                token.roles = user.roles
            }
            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.username = token.username as string
                session.user.roles = token.roles as string[]
            }
            return session
        },
    },

    pages: {
        signIn: '/login', // Unified login page
    },
})
