import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto, AuthLoginDto } from './dto/auth.dto';
import { JwtPayload, Tokens, UserCreateInput } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

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

    if (!user) throw new ForbiddenException('Username does not exist.');

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!passwordMatches)
      throw new ForbiddenException('Password does not exist.');

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

    if (!rtMatches) throw new ForbiddenException('Access Denied!');

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
    const jwtPayload: JwtPayload = {
      sub: userId,
      username: username,
      email: email,
      roleId: roleId,
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
