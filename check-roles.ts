import "dotenv/config"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Fetching roles...')
    const roles = await prisma.roles.findMany()
    console.log('Roles in DB:', roles)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
