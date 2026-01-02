
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("--- DEBUGGING DATA ---")

    const users = await prisma.users.findMany()
    console.log(`Total Users: ${users.length}`)
    users.forEach(u => console.log(`User: ${u.UserID} (${u.Email})`))

    const todos = await prisma.todos.findMany()
    console.log(`\nTotal Todos: ${todos.length}`)
    todos.forEach(t => console.log(`Todo: ID=${t.TodoID}, UserID=${t.UserID}, Content="${t.Content}"`))

    const tasks = await prisma.tasks.findMany()
    console.log(`\nTotal Project Tasks: ${tasks.length}`)
    tasks.forEach(t => console.log(`Task: ID=${t.TaskID}, AssignedTo=${t.AssignedTo}, Title="${t.Title}"`))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
