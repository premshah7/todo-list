import 'dotenv/config'
import { prisma } from './lib/db'

async function main() {
    const users = await prisma.users.findMany()
    console.log('Users:', users)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
