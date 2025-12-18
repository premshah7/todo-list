export interface User {
    id: string
    username: string
    email: string
    name?: string | null
    roles?: string[]
}

export interface Project {
    id: string
    projectName: string
    description?: string | null
    createdById: string
    createdAt: Date
    updatedAt: Date
}

export interface Task {
    id: string
    listId: string
    assignedToId?: string | null
    title: string
    description?: string | null
    priority: 'Low' | 'Medium' | 'High'
    status: 'Pending' | 'In Progress' | 'Completed'
    dueDate?: Date | null
    position: number
    createdAt: Date
    updatedAt: Date
}

export interface TaskComment {
    id: string
    taskId: string
    userId: string
    commentText: string
    createdAt: Date
    user?: {
        username: string
        name?: string | null
    }
}

export interface TaskHistory {
    id: string
    taskId: string
    changedBy: string
    changeType: string
    oldValue?: string | null
    newValue?: string | null
    createdAt: Date
    user?: {
        username: string
        name?: string | null
    }
}
