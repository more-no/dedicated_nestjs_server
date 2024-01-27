import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from '../types';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

export async function getTokens(
  userId: number,
  username: string,
  email: string,
  roleId: number,
): Promise<Tokens> {
  const config = new ConfigService();
  const jwtService = new JwtService();
  const prisma = new PrismaService(config);

  const userRole = await prisma.userRole.findUnique({
    where: { user_id_role_id: { user_id: userId, role_id: roleId } },
    include: { role: true },
  });

  if (!userRole) {
    throw new Error('User role not found');
  }

  const jwtPayload: JwtPayload = {
    sub: userId,
    username: username,
    email: email,
    role_name: userRole.role.role_name,
  };

  const [at, rt] = await Promise.all([
    jwtService.signAsync(
      // verification accessToken
      jwtPayload,
      { secret: config.get<string>('AT_SECRET'), expiresIn: 60 * 30 },
    ),
    jwtService.signAsync(
      // verification refreshToken
      jwtPayload,
      {
        secret: config.get<string>('RT_SECRET'),
        expiresIn: 60 * 60 * 24,
      },
    ),
  ]);

  return { access_token: at, refresh_token: rt };
}
