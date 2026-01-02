"use server"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const todoSchema = z.object({
    content: z.string().min(1, "Task content is required"),
    projectId: z.string().optional(),
    duration: z.string().optional(),
})

export async function createTodo(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized" }

    const content = formData.get("content") as string
    const projectId = formData.get("projectId") as string
    const duration = formData.get("duration") as string

    const validation = todoSchema.safeParse({ content, projectId, duration })

    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    try {
        const data: any = {
            Content: content,
            UserID: parseInt(user.id),
            Duration: duration || null,
        }

        if (projectId && projectId !== "null") {
            data.ProjectID = parseInt(projectId)
        }

        await prisma.todos.create({
            data,
        })
        revalidatePath("/todos")
        return { success: true }
    } catch (error) {
        return { error: "Failed to create todo" }
    }
}

export async function toggleTodo(todoId: number) {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized" }

    const todo = await prisma.todos.findUnique({
        where: { TodoID: todoId },
    })

    // Allow completion if owner
    if (!todo || todo.UserID !== parseInt(user.id)) {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.todos.update({
            where: { TodoID: todoId },
            data: { IsCompleted: !todo.IsCompleted },
        })
        revalidatePath("/todos")
        return { success: true }
    } catch (error) {
        return { error: "Failed to update todo" }
    }
}

export async function deleteTodo(todoId: number) {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized" }

    const todo = await prisma.todos.findUnique({
        where: { TodoID: todoId },
    })

    if (!todo || todo.UserID !== parseInt(user.id)) {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.todos.delete({
            where: { TodoID: todoId },
        })
        revalidatePath("/todos")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete todo" }
    }
}

export async function getTodos() {
    const user = await getCurrentUser()
    if (!user) return []

    return await prisma.todos.findMany({
        where: { UserID: parseInt(user.id) },
        include: {
            Project: {
                select: { ProjectName: true }
            }
        },
        orderBy: { CreatedAt: "desc" },
    })
}

export async function getUserProjects() {
    const user = await getCurrentUser()
    if (!user) return []

    const userId = parseInt(user.id)
    return await prisma.projects.findMany({
        where: {
            OR: [
                { CreatedBy: userId },
                { ProjectMembers: { some: { UserID: userId } } }
            ]
        },
        select: { ProjectID: true, ProjectName: true }
    })
}

export async function getAssignedProjectTasks() {
    const user = await getCurrentUser()
    if (!user) return []

    const userId = parseInt(user.id)
    return await prisma.tasks.findMany({
        where: {
            AssignedTo: userId,
            Status: { not: 'Completed' }
        },
        include: {
            TaskLists: {
                select: {
                    ListName: true,
                    Projects: {
                        select: { ProjectName: true }
                    }
                }
            }
        },
        orderBy: { DueDate: 'asc' }
    })
}
