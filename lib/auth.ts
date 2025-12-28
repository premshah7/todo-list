import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcrypt"
import { z } from "zod"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            username: string
        } & DefaultSession["user"]
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
                session.user.role = token.role as string
                session.user.username = token.username as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
                token.username = (user as any).username
            }
            return token
        },
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const user = await prisma.users.findUnique({
                        where: { Email: email },
                    })

                    if (!user || !user.PasswordHash) return null

                    const passwordsMatch = await bcrypt.compare(password, user.PasswordHash)

                    if (passwordsMatch) {
                        return {
                            id: user.UserID.toString(),
                            name: user.UserName,
                            email: user.Email,
                            username: user.UserName,
                            role: user.Role,
                        }
                    }
                }

                return null
            },
        }),
    ],
})

export async function getCurrentUser() {
    const session = await auth()
    return session?.user
}

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10)
}
