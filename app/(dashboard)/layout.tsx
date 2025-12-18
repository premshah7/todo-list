import { auth } from '@/lib/next-auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { SessionProvider } from '@/components/session-provider'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect('/auth/signin')
    }

    return (
        <SessionProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto animated-gradient">
                    {children}
                </main>
            </div>
        </SessionProvider>
    )
}
