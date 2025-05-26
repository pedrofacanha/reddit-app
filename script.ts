import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const createMany = await prisma.post.createMany({
    data: [
      { title: 'Mochido opens its new location in Coquitlam this week', 
        link: 'https://dailyhive.com/vancouver/mochido-coquitlam-open', 
        description: "New mochi donut shop, Mochido, is set to open later this week.", 
        creatorId: 1,
        subgroup: "food",
        timestamp: new Date(1643648446955)
       },
      { title: '2023 State of Databases for Serverless & Edge', 
        link: 'https://leerob.io/blog/backend', 
        description: "An overview of databases that pair well with modern application and compute providers.", 
        creatorId: 4,
        subgroup: "coding",
        timestamp: new Date(1642611742010)
       },
    ]// optional, avoids errors if records already exist
  })

  console.log(`${createMany.count} posts created`)
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
