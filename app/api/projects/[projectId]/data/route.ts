import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/actions/projects'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const { projectId } = await params
    const project = await getProject(projectId)

    // Fetch all users to allow assignment (since we don't have project members relation yet)
    // We need to import prisma for this
    const { prisma } = await import('@/lib/db')
    const users = await prisma.users.findMany({
        select: {
            UserID: true,
            UserName: true,
            Email: true,
            UserRoles: {
                select: {
                    Roles: {
                        select: { RoleName: true }
                    }
                }
            }
        }
    })

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Transform users to match expected structure if needed, or just return them
    const formattedUsers = users.map(u => ({
        userId: u.UserID,
        user: {
            name: u.UserName,
            username: u.UserName,
            email: u.Email
        }
    }))

    return NextResponse.json({
        members: formattedUsers,
        taskLists: project.TaskLists.map(list => ({
            id: list.ListID.toString(),
            listName: list.ListName,
            tasks: list.Tasks.map(t => ({
                id: t.TaskID.toString(),
                title: t.Title,
                description: t.Description,
                priority: t.Priority,
                status: t.Status,
                dueDate: t.DueDate,
                assignedTo: t.Users ? {
                    username: t.Users.UserName,
                    name: t.Users.UserName
                } : null
            }))
        })),
    })
}
