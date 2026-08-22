const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const game = await prisma.game.findFirst({ where: { slug: 'fc26' } });
        const tournament = await prisma.tournament.create({
            data: {
                name: 'Test Tournament',
                slug: 'test-tournament',
                description: 'New tournament',
                format: 'SINGLE_ELIMINATION',
                status: 'REGISTRATION_OPEN',
                entryFeeStars: 50,
                prizePool: '',
                maxPlayers: 64,
                currentPlayers: 0,
                registrationStart: new Date(),
                registrationEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                gameId: game.id
            }
        });
        console.log("Success:", tournament.id);
    } catch(e) {
        console.error(e);
    }
}
check().finally(() => prisma.$disconnect());
