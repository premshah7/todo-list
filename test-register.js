require('dotenv/config')
const { PrismaClient } = require('./generated/prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function testRegister() {
    try {
        // Hash password
        const passwordHash = await bcrypt.hash('test123', 10)

        // Check if user exists
        const existing = await prisma.users.findFirst({
            where: {
                OR: [
                    { Email: 'test@example.com' },
                    { UserName: 'testuser' },
                ],
            },
        })

        if (existing) {
            console.log('User already exists, skipping...')
            return
        }

        // Create user
        const user = await prisma.users.create({
            data: {
                UserName: 'testuser',
                Email: 'test@example.com',
                PasswordHash: passwordHash,
            },
        })

        console.log('✅ User created:', user)

        // Assign role
        const userRole = await prisma.roles.findUnique({
            where: { RoleName: 'User' },
        })

        if (userRole) {
            await prisma.userRoles.create({
                data: {
                    UserID: user.UserID,
                    RoleID: userRole.RoleID,
                },
            })
            console.log('✅ Role assigned!')
        }

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testRegister()
