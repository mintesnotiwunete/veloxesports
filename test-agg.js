const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const res = await prisma.payment.aggregate({ _sum: { amountStars: true }, where: { status: 'SUCCESS' } });
  console.log(res);
}
run().finally(() => prisma.$disconnect());
