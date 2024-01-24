import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthSignupDto, AuthLoginDto } from './dto/auth.dto';
import { JwtPayload, Tokens, UserCreateInput } from '../common/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthSignupDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

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

    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.email,
      newUser.user_role[0].role_id,
    );

    await this.updateRtHash(newUser.id, tokens.refresh_token);

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

    const tokens = await this.getTokens(
      user.id,
      user.username,
      user.email,
      user.user_role[0].role_id,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
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

    const tokens = await this.getTokens(
      user.id,
      user.username,
      user.email,
      user.user_role[0].role_id,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await this.hashData(rt);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: hash,
      },
    });
  }

  async hashData(data: string) {
    const hash = await bcrypt.hash(data, 10);
    return hash;
  }

  async getTokens(
    userId: number,
    username: string,
    email: string,
    roleId: number,
  ): Promise<Tokens> {
    const userRole = await this.prisma.userRole.findUnique({
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
      this.jwtService.signAsync(
        // verification accessToken
        jwtPayload,
        { secret: this.config.get<string>('AT_SECRET'), expiresIn: 60 * 15 },
      ),
      this.jwtService.signAsync(
        // verification refreshToken
        jwtPayload,
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: 60 * 60 * 24,
        },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }
}
