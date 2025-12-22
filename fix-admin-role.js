
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@gmail.com'
    console.log(`Fixing role for ${email}...`)

    const user = await prisma.users.findUnique({
        where: { Email: email }
    })

    if (!user) {
        console.log('User not found')
        return
    }

    const adminRole = await prisma.roles.findUnique({
        where: { RoleName: 'Admin' }
    })

    if (!adminRole) {
        console.log('Admin role not found')
        return
    }

    // Remove existing roles
    await prisma.userRoles.deleteMany({
        where: { UserID: user.UserID }
    })

    // Add Admin role
    await prisma.userRoles.create({
        data: {
            UserID: user.UserID,
            RoleID: adminRole.RoleID
        }
    })

    console.log('✅ Successfully assigned Admin role to', email)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
