import { auth } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma'

export default async function TestDashPage() {
    try {
        const session = await auth()
        const userId = (session?.user as any)?.id

        // Test the exact myTasks query from dashboard
        const myTasks = await prisma.task.findMany({
            where: { assignedToId: userId },
            include: {
                taskList: {
                    select: {
                        listName: true,
                        project: {
                            select: {
                                projectName: true,
                                id: true,
                            },
                        },
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
            take: 5,
        })

        return (
            <div className="p-8">
                <h1>Test Dashboard - My Tasks Query</h1>
                <pre>{JSON.stringify(myTasks, null, 2)}</pre>
            </div>
        )
    } catch (error: any) {
        console.error('Error:', error)
        return (
            <div className="p-8">
                <h1>Error:</h1>
                <p>{error.message}</p>
                <pre>{error.stack}</pre>
            </div>
        )
    }
}
