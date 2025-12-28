const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg') // Usually needed for adapter
const bcrypt = require('bcrypt')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Create Users
    const passwordHash = await bcrypt.hash('password123', 10)

    const admin = await prisma.users.upsert({
        where: { Email: 'admin@example.com' },
        update: { Role: 'ADMIN' },
        create: {
            UserName: 'Admin User',
            Email: 'admin@example.com',
            PasswordHash: passwordHash,
            Role: 'ADMIN'
        }
    })
    console.log('👤 Admin user ready: admin@example.com')

    const manager = await prisma.users.upsert({
        where: { Email: 'manager@example.com' },
        update: { Role: 'MANAGER' },
        create: {
            UserName: 'Manager User',
            Email: 'manager@example.com',
            PasswordHash: passwordHash,
            Role: 'MANAGER'
        }
    })
    console.log('👤 Manager user ready: manager@example.com')

    const user = await prisma.users.upsert({
        where: { Email: 'user@example.com' },
        update: { Role: 'USER', ManagerID: manager.UserID },
        create: {
            UserName: 'Standard User',
            Email: 'user@example.com',
            PasswordHash: passwordHash,
            Role: 'USER',
            ManagerID: manager.UserID
        }
    })
    console.log('👤 Standard user ready: user@example.com')

    // 2. Create Projects
    const project1 = await prisma.projects.create({
        data: {
            ProjectName: 'SaaS Platform Redesign',
            Description: 'Overhauling the dashboard UI and implementing RBAC.',
            CreatedBy: admin.UserID,
            Status: 'Active',
            ProjectMembers: {
                create: [
                    { UserID: manager.UserID, Role: 'Editor' },
                    { UserID: user.UserID, Role: 'Viewer' }
                ]
            }
        }
    })

    const project2 = await prisma.projects.create({
        data: {
            ProjectName: 'Mobile App MVP',
            Description: 'Initial launch of the iOS and Android apps.',
            CreatedBy: manager.UserID,
            Status: 'Active',
            ProjectMembers: {
                create: [
                    { UserID: user.UserID, Role: 'Editor' }
                ]
            }
        }
    })
    console.log('📁 Projects created')

    // 3. Create Task Lists & Tasks for Project 1
    const listTodo = await prisma.taskLists.create({
        data: { ProjectID: project1.ProjectID, ListName: 'Pending' }
    })
    const listProgress = await prisma.taskLists.create({
        data: { ProjectID: project1.ProjectID, ListName: 'In Progress' }
    })
    const listDone = await prisma.taskLists.create({
        data: { ProjectID: project1.ProjectID, ListName: 'Completed' }
    })

    await prisma.tasks.createMany({
        data: [
            {
                Title: 'Design System Update',
                Description: 'Standardize colors and typography for light mode.',
                Priority: 'High',
                Status: 'Pending',
                ListID: listTodo.ListID,
                AssignedTo: user.UserID,
                DueDate: new Date(Date.now() + 86400000 * 2) // +2 days
            },
            {
                Title: 'Implement Auth Actions',
                Description: 'Setup NextAuth with credentials provider.',
                Priority: 'High',
                Status: 'In Progress',
                ListID: listProgress.ListID,
                AssignedTo: manager.UserID,
                DueDate: new Date(Date.now() + 86400000 * 5)
            },
            {
                Title: 'Setup Database',
                Description: 'Configure Prisma schema and migrations.',
                Priority: 'Medium',
                Status: 'Completed',
                ListID: listDone.ListID,
                AssignedTo: admin.UserID
            }
        ]
    })
    console.log('✅ Tasks created')

    // 4. Create Personal Todos
    await prisma.todos.createMany({
        data: [
            {
                Content: 'Review pull requests',
                UserID: manager.UserID,
                IsCompleted: false,
                Duration: '1h'
            },
            {
                Content: 'Update documentation',
                UserID: user.UserID,
                IsCompleted: false,
                Duration: '2h 30m',
                ProjectID: project1.ProjectID
            }
        ]
    })
    console.log('📝 Personal todos created')

    console.log('🚀 Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        プロセス.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
