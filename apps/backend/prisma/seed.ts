import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { getTokens } from 'src/common/utils';

// reference https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

const prisma = new PrismaClient();
const config = new ConfigService();

class Seeder {
  // private prisma: PrismaClient;
  // private jwtService: JwtService;
  // private config: ConfigService;

  constructor() {} // jwtService: JwtService, // config: ConfigService, // prisma: PrismaClient,

  async seed() {
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

    const tokens = await getTokens(1, 'admin', 'admin@email.com', 1);

    await prisma.user.create({
      data: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        refresh_token: tokens.refresh_token,
        user_role: {
          create: {
            role: {
              connect: {
                id: 1,
              },
            },
          },
        },
        session: {
          create: {
            token: tokens.access_token,
          },
        },
      },
    });
  }
}

async function main() {
  const prisma = new PrismaClient();
  const configService = new ConfigService();

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
