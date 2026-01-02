import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    if (!email) {
        console.error('Please provide an email address')
        process.exit(1)
    }

    try {
        const user = await prisma.users.update({
            where: { Email: email },
            data: { Role: 'ADMIN' },
        })
        console.log(`User ${user.Email} promoted to ADMIN`)
    } catch (e) {
        console.error('Error promoting user:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
