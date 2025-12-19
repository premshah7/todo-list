require('dotenv/config')

console.log('Checking DATABASE_URL configuration...\n')

const dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
    console.error('❌ ERROR: DATABASE_URL is not set in .env file')
    console.log('\nPlease ensure your .env file contains a DATABASE_URL like:')
    console.log('DATABASE_URL="postgresql://username:password@localhost:5432/database_name"')
    process.exit(1)
}

console.log('✅ DATABASE_URL is set')
console.log('\nChecking for common issues...\n')

// Check for illegal characters
const illegalChars = ['<', '>', '"', '|', '*', '?']
let hasIllegalChars = false

for (const char of illegalChars) {
    if (dbUrl.includes(char)) {
        console.error(`❌ Found illegal character in DATABASE_URL: "${char}"`)
        hasIllegalChars = true
    }
}

// Check for unescaped special characters in password
if (dbUrl.includes('@')) {
    const parts = dbUrl.split('@')
    if (parts.length > 2) {
        console.error('❌ Multiple @ symbols found - password may need URL encoding')
        console.log('   If your password contains special characters like @, #, %, etc.')
        console.log('   they need to be URL-encoded:')
        console.log('   @ becomes %40')
        console.log('   # becomes %23')
        console.log('   % becomes %25')
        hasIllegalChars = true
    }
}

// Check basic format
if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.error('❌ DATABASE_URL should start with postgresql:// or postgres://')
    hasIllegalChars = true
}

if (!hasIllegalChars) {
    console.log('✅ No obvious format issues detected')
    console.log('\nTrying to connect to database...\n')

    const { PrismaClient } = require('../generated/prisma/client')
    const { PrismaPg } = require('@prisma/adapter-pg')

    const adapter = new PrismaPg({ connectionString: dbUrl })
    const prisma = new PrismaClient({ adapter })

    prisma.$connect()
        .then(async () => {
            console.log('✅ Successfully connected to database!')

            // Try to count roles
            const roleCount = await prisma.roles.count()
            console.log(`\n📊 Database has ${roleCount} roles`)

            if (roleCount === 0) {
                console.log('\n⚠️  No roles found in database. You need to run: node prisma/seed.js')
            } else {
                const roles = await prisma.roles.findMany()
                console.log('   Existing roles:', roles.map(r => r.RoleName).join(', '))
            }

            await prisma.$disconnect()
        })
        .catch((error) => {
            console.error('❌ Failed to connect to database:', error.message)
            process.exit(1)
        })
} else {
    console.log('\n⚠️  Please fix the above issues in your .env file and try again')
    process.exit(1)
}
