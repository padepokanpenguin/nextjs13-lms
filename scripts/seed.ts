const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function main() {
    try {
        await db.category.createMany({
            data: [
                {name: 'Computer Science' },
                {name: 'Music' },
                {name: 'Fitness' },
                {name: 'Photography' },
                {name: 'Accounting' },
                {name: 'Engineering' },
                {name: 'Business' }
            ]
        })
        console.log('success seeding')
    } catch (error) {
        console.error('error seeding database category', error)
    } finally {
        await db.$disconnect()
    }
}

main()