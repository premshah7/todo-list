// lib/next-auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    secret: process.env.AUTH_SECRET,

    session: {
        strategy: 'jwt',
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.users.findUnique({
                    where: { Email: credentials.email },
                    include: {
                        UserRoles: {
                            include: { Roles: true },
                        },
                    },
                })

                if (!user) return null

                const isValid = await verifyPassword(
                    credentials.password,
                    user.PasswordHash
                )

                if (!isValid) return null

                return {
                    id: user.UserID.toString(),
                    email: user.Email,
                    name: user.UserName,
                    username: user.UserName,
                    roles: user.UserRoles.map(r => r.Roles.RoleName),
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.name
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
        signIn: '/auth/signin',
    },
})
