const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const t = await prisma.tournament.findMany();
  console.log(t);
}
check().finally(() => prisma.$disconnect());
