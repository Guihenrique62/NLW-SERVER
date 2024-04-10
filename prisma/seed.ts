import { prisma } from '../src/lib/prisma'

async function seed(){
    await prisma.event.create({
        data: {
            id: 'f7822679-f0f9-417e-8941-b282a5d20679',
            title: 'Unite Summit',
            slug: 'unite-suumit',
            details: 'Um evento paara devs apaixonados por código!',
            maximumAttendees: 120,
        }
    })
}

seed().then(()=> {
    console.log('Database seeded')
    prisma.$disconnect()
})