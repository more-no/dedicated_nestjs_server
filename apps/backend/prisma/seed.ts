import { PrismaClient } from '@prisma/client';

// reference https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { role_name: 'Admin', description: 'Administrator role' },
      { role_name: 'Editor', description: 'Editor role' },
      { role_name: 'User', description: 'User role' },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
