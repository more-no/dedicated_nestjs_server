import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthSignupDto, AuthLoginDto } from './dto/auth.dto';
import { Tokens, UserCreateInput } from '../common/types';
import { getTokens, updateRtHash } from '../common/utils';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthSignupDto): Promise<Tokens> {
    const hash = await bcrypt.hash(dto.password, 10);

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });

    if (existingUser) {
      throw new ForbiddenException('Username or email already exists.');
    }

    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password_hash: hash,
        user_role: {
          create: {
            role: {
              connect: {
                id: 3,
              },
            },
          },
        },
      } as UserCreateInput,
      include: {
        user_role: true,
      },
    });

    if (!newUser) {
      throw new InternalServerErrorException('Error creating the user');
    }

    const tokens = await getTokens(
      newUser.id,
      newUser.username,
      newUser.email,
      newUser.user_role[0].role_id,
    );

    const session = await this.prisma.session.create({
      data: {
        token: tokens.access_token,
        user_id: newUser.id,
      },
    });

    if (!session) {
      throw new InternalServerErrorException('Error creating the session');
    }

    await updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async login(dto: AuthLoginDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
      include: {
        user_role: true,
      },
    });

    if (!user) throw new ForbiddenException('Invalid username or password.');

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!passwordMatches)
      throw new ForbiddenException('Invalid username or password.');

    const tokens = await getTokens(
      user.id,
      user.username,
      user.email,
      user.user_role[0].role_id,
    );

    const existingSession = await this.prisma.session.findFirst({
      where: {
        user_id: user.id,
      },
    });

    if (!existingSession) {
      const session = await this.prisma.session.create({
        data: {
          token: tokens.access_token,
          user_id: user.id,
        },
      });

      if (!session) {
        throw new InternalServerErrorException('Error creating the session');
      }
    }

    await updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    const userLoggedOut = await this.prisma.user.updateMany({
      where: {
        id: userId,
        refresh_token: {
          not: null,
        },
      },
      data: {
        refresh_token: null,
      },
    });

    if (!userLoggedOut) {
      throw new InternalServerErrorException('Error during logout');
    }

    const deletedSession = await this.prisma.session.deleteMany({
      where: { user_id: userId },
    });

    if (!deletedSession) {
      throw new InternalServerErrorException('Error during logout');
    }

    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        user_role: true,
      },
    });

    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access Denied!');

    const rtMatches = await bcrypt.compare(rt, user.refresh_token);

    if (!rtMatches) {
      throw new ForbiddenException('Invalid token.');
    }

    const tokens = await getTokens(
      user.id,
      user.username,
      user.email,
      user.user_role[0].role_id,
    );

    await updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
