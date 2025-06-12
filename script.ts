import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const createMany = await prisma.vote.createMany({
    data: [
      { userId: 2, postId: 101, value: +1 },
      { userId: 3, postId: 101, value: +1 },
      { userId: 4, postId: 101, value: +1 },
      { userId: 3, postId: 102, value: -1 },
    ]
  })

  console.log(`${createMany.count} votes created`);
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
