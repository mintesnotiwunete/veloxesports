const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const fortnite = await prisma.game.upsert({
    where: { slug: 'fortnite' },
    update: {},
    create: {
      name: 'Fortnite',
      slug: 'fortnite',
      description: 'Battle Royale',
    },
  })

  const fc26 = await prisma.game.upsert({
    where: { slug: 'fc26' },
    update: {},
    create: {
      name: 'EA Sports FC 26',
      slug: 'fc26',
      description: 'Football simulation',
    },
  })

  const tournament = await prisma.tournament.upsert({
    where: { slug: 'winter-clash-2026' },
    update: {},
    create: {
      gameId: fortnite.id,
      name: 'Winter Clash 2026',
      slug: 'winter-clash-2026',
      description: 'The ultimate winter showdown.',
      format: 'BATTLE_ROYALE',
      status: 'REGISTRATION_OPEN',
      entryFeeStars: 50,
      prizePool: '$5000',
      maxPlayers: 256,
      currentPlayers: 128,
      registrationStart: new Date(),
      registrationEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
  })

  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
