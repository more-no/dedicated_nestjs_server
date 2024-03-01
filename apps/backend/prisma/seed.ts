import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// reference https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
// seed with 'npx prisma db seed'

const prisma = new PrismaClient();
const config = new ConfigService();

class Seeder {
  async seed() {
    // create roles
    await prisma.role.createMany({
      data: [
        { role_name: 'Admin', description: 'Administrator role' },
        { role_name: 'Editor', description: 'Editor role' },
        { role_name: 'User', description: 'User role' },
      ],
    });

    const hashedPassword = await bcrypt.hash(
      config.get<string>('ADMIN_PASSWORD'),
      10,
    );

    const adminRole = await prisma.role.findFirst({
      where: { role_name: 'Admin' },
    });

    // create admin user
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        user_role: {
          create: {
            role: {
              connect: {
                id: adminRole.id,
              },
            },
          },
        },
      },
    });
  }
}

async function main() {
  const seeder = new Seeder();
  await seeder.seed();

  await prisma.$disconnect();
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
