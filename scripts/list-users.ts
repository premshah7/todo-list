import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.users.findMany({
        select: { Email: true, Role: true, UserName: true }
    })
    console.table(users)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
