import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto, UploadResultDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { CustomRequest } from 'common/types';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        user_role: {
          select: {
            role: {
              select: {
                role_name: true,
              },
            },
          },
        },
      },
    });

    if (!users) {
      throw new ForbiddenException('Error retrieving the Users.');
    }
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    return user;
  }

  // update user info
  async update(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<UpdateUserDto> {
    const userUpdated = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: data.username,
        fullname: data.fullname,
        bio: data.bio,
      },
    });

    if (!userUpdated) {
      throw new BadRequestException('Could not update');
    }

    return {
      username: userUpdated.username,
      fullname: userUpdated.fullname,
      bio: userUpdated.bio,
    };
  }

  // upload user picture
  async upload(
    userId: number,
    uploadResultDto: UploadResultDto,
  ): Promise<UploadResultDto> {
    try {
      const userUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: { picture_url: uploadResultDto.filename },
      });

      if (!userUpdated) {
        throw new BadRequestException('Could not upload');
      }

      return {
        userId: uploadResultDto.userId,
        filename: uploadResultDto.filename,
      };
    } catch (error) {
      throw new NotFoundException(`Failed to upload: ${error.message}`);
    }
  }

  // delete authenticated user and session
  async userRemove(userId: number, request: CustomRequest): Promise<number> {
    const session = await this.prisma.session.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.token === request.token) {
      const token = await this.jwtService.decode(request.token);

      const userDeleted = await this.prisma.user.deleteMany({
        where: { id: token.sub },
      });

      if (!userDeleted) {
        throw new InternalServerErrorException('Could not delete the User');
      }

      const deletedSession = await this.prisma.session.deleteMany({
        where: { user_id: userId },
      });

      if (!deletedSession) {
        throw new InternalServerErrorException('Error during deletion');
      }

      return userId;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  // delete user by admin
  async adminRemove(userId: number): Promise<number> {
    const userToDelete = await this.prisma.user.delete({
      where: { id: userId },
    });

    if (!userToDelete) {
      throw new NotFoundException('Failed to find the user');
    }

    const deletedSession = await this.prisma.session.deleteMany({
      where: { user_id: userId },
    });

    if (!deletedSession) {
      throw new InternalServerErrorException('Error during deletion');
    }

    return userId;
  }

  // change user role by admin
  async updateRole(userId: number, roleId: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { user_role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRoleUpdated = await this.prisma.userRole.update({
      where: {
        user_id_role_id: {
          user_id: user.id,
          role_id: user.user_role[0].role_id,
        },
      },
      data: {
        role: { connect: { id: roleId } },
      },
    });

    if (!userRoleUpdated) {
      throw new NotFoundException('User not found');
    }

    return roleId;
  }
}
