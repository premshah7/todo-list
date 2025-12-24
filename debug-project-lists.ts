
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const projectId = 6
    console.log(`Checking lists for Project ${projectId}...`)

    const lists = await prisma.taskLists.findMany({
        where: { ProjectID: projectId }
    })

    console.log('Task Lists:', lists)

    // check if we can matching 'Completed'
    const completedList = lists.find(l => l.ListName === 'Completed')
    console.log('Found "Completed" list:', completedList)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
