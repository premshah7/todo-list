require('dotenv/config')
const { PrismaClient } = require('../generated/prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    // Create default roles
    const roles = ['User', 'Admin', 'Manager']

    for (const roleName of roles) {
        await prisma.roles.upsert({
            where: { RoleName: roleName },
            update: {},
            create: { RoleName: roleName },
        })
        console.log(`✅ Created/Updated role: ${roleName}`)
    }

    console.log('\n✅ All default roles created successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
