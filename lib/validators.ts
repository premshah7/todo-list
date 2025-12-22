import { z } from 'zod'

// Role enum for validation
export const roleEnum = z.enum(['User', 'Admin', 'Manager'])

// Registration validation
export const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    role: roleEnum,
})

// Login validation
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    role: roleEnum,
})

// Task validation
export const taskSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
    status: z.enum(['Pending', 'In Progress', 'Completed', 'Blocked']),
    dueDate: z.string().datetime().optional(),
    assignedTo: z.number().int().optional(),
})

// Project validation
export const projectSchema = z.object({
    projectName: z.string().min(1).max(200),
    description: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type TaskInput = z.infer<typeof taskSchema>
export type ProjectInput = z.infer<typeof projectSchema>
