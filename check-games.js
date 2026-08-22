const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const games = await prisma.game.findMany();
  console.log(games);
}
check().finally(() => prisma.$disconnect());
