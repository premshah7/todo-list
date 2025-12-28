const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    if (!email) {
        console.log("Please provide an email")
        return
    }

    try {
        const user = await prisma.users.update({
            where: { Email: email },
            data: { Role: 'ADMIN' }
        })
        console.log(`Updated ${user.UserName} (${user.Email}) to ADMIN`)
    } catch (e) {
        console.error(e)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
