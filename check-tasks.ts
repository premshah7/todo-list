
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking tasks...')
    const tasks = await prisma.tasks.findMany()
    console.log(`Total tasks found: ${tasks.length}`)
    console.log('Sample tasks:', tasks.slice(0, 3))

    const users = await prisma.users.findMany()
    console.log('Users:', users.map(u => ({ id: u.UserID, name: u.UserName, email: u.Email })))

    if (users.length > 0) {
        const userTasks = await prisma.tasks.findMany({
            where: { AssignedTo: users[0].UserID }
        })
        console.log(`Tasks for first user (${users[0].UserName}): ${userTasks.length}`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
