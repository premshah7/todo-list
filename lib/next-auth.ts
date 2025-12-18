import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                    include: {
                        userRoles: {
                            include: {
                                role: true,
                            },
                        },
                    },
                })

                if (!user) {
                    return null
                }

                const isValid = await verifyPassword(
                    credentials.password as string,
                    user.passwordHash
                )

                if (!isValid) {
                    return null
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.username,
                    username: user.username,
                    roles: user.userRoles.map((ur) => ur.role.roleName),
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = (user as any).username
                token.roles = (user as any).roles
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id
                    (session.user as any).username = token.username
                        (session.user as any).roles = token.roles
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
    },
})
