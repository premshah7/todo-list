
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    // 1. Create a dummy user if needed (we'll assume one exists or use ID 45 from before)
    const userId = 45

    // 2. Create Project A
    const projectA = await prisma.projects.create({
        data: {
            ProjectName: 'Isolation Test A',
            CreatedBy: userId,
            TaskLists: {
                create: [{ ListName: 'Pending' }]
            }
        },
        include: { TaskLists: true }
    })
    console.log(`Created Project A: ${projectA.ProjectID}`)

    // 3. Create Project B
    const projectB = await prisma.projects.create({
        data: {
            ProjectName: 'Isolation Test B',
            CreatedBy: userId,
            TaskLists: {
                create: [{ ListName: 'Pending' }]
            }
        },
        include: { TaskLists: true }
    })
    console.log(`Created Project B: ${projectB.ProjectID}`)

    // 4. Create Task in Project A
    const listA = projectA.TaskLists[0]
    const taskA = await prisma.tasks.create({
        data: {
            Title: 'Task in A',
            Status: 'Pending',
            Priority: 'Medium',
            ListID: listA.ListID,
            AssignedTo: userId
        }
    })
    console.log(`Created Task in A: ${taskA.TaskID}`)

    // 5. Query Project B to see if Task A shows up
    const projectB_refetched = await prisma.projects.findUnique({
        where: { ProjectID: projectB.ProjectID },
        include: {
            TaskLists: {
                include: { Tasks: true }
            }
        }
    })

    const tasksInB = projectB_refetched.TaskLists.flatMap(l => l.Tasks)
    console.log(`Tasks in Project B: ${tasksInB.length}`)
    if (tasksInB.length > 0) {
        console.error('FAIL: Found tasks in Project B!', tasksInB)
    } else {
        console.log('PASS: Project B is empty.')
    }

    // 6. Cleanup
    await prisma.tasks.delete({ where: { TaskID: taskA.TaskID } })
    await prisma.projects.delete({ where: { ProjectID: projectA.ProjectID } })
    await prisma.projects.delete({ where: { ProjectID: projectB.ProjectID } })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
