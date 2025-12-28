
import { prisma } from './lib/db'

async function main() {
    const tasks = await prisma.tasks.findMany({
        select: {
            TaskID: true,
            Title: true,
            Status: true,
            ListID: true,
        }
    })

    console.log('Total tasks:', tasks.length)
    console.log('Tasks with status "In Progress":', tasks.filter(t => t.Status === 'In Progress').length)

    const inProgressTasks = tasks.filter(t => t.Status.toLowerCase().includes('progress'))
    console.log('Tasks matching "progress" (case insensitive):')
    inProgressTasks.forEach(t => console.log(`- [${t.TaskID}] ${t.Title}: "${t.Status}"`))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
