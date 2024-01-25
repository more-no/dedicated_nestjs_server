import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

export async function updateRtHash(userId: number, rt: string): Promise<void> {
  const config = new ConfigService();
  const prisma = new PrismaService(config);

  const hash = await bcrypt.hash(rt, 10);

  const tokenRefreshed = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refresh_token: hash,
    },
  });

  if (!tokenRefreshed) {
    throw new InternalServerErrorException('Error creating the Token');
  }
}
