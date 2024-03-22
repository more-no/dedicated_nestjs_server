import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PersonalDataUserDto, UpdateUserDto, UploadImageDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CustomRequest } from 'common/types';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
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

    if (!users) throw new ForbiddenException('Error retrieving the Users.');

    return users;
  }

  async getUserById(id: number, request: CustomRequest): Promise<User> {
    const token = await this.jwtService.decode(request.token);

    if (id === token.sub) {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          post: true,
          group_post: {
            include: {
              group_post: true,
            },
          },
        },
      });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  // upload user picture
  async upload(userId: number, image: string): Promise<UploadImageDto> {
    try {
      const userUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: { picture_url: image },
      });

      if (!userUpdated) throw new BadRequestException('Could not upload');

      return {
        userId: userUpdated.id,
        filename: userUpdated.picture_url,
      };
    } catch (error) {
      throw new NotFoundException(`Failed to upload: ${error.message}`);
    }
  }

  // update user info
  async update(
    id: number,
    personalData: UpdateUserDto,
  ): Promise<[User, PersonalDataUserDto]> {
    try {
      const [updatedUser, updatedPersonalData] = await this.prisma.$transaction(
        [
          this.prisma.user.update({
            where: {
              id: id,
            },
            data: {
              username: personalData.username,
              fullname: personalData.fullname,
              bio: personalData.bio,
            },
          }),
          this.prisma.personalData.update({
            where: { user_id: id },
            data: {
              first_name: personalData.personal_data.first_name,
              last_name: personalData.personal_data.last_name,
              age: personalData.personal_data.age,
              nationality: personalData.personal_data.nationality,
            },
          }),
        ],
      );

      return [updatedUser, updatedPersonalData];
    } catch (error) {
      throw new BadRequestException(
        'Error updating User data: ',
        error.message,
      );
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

      if (!userDeleted)
        throw new InternalServerErrorException('Could not delete the User');

      const deletedSession = await this.prisma.session.deleteMany({
        where: { user_id: userId },
      });

      if (!deletedSession)
        throw new InternalServerErrorException('Error during deletion');

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

    if (!userToDelete) throw new NotFoundException('Failed to find the user');

    const deletedSession = await this.prisma.session.deleteMany({
      where: { user_id: userId },
    });

    if (!deletedSession)
      throw new InternalServerErrorException('Error during deletion');

    return userId;
  }

  // change user role by admin
  async updateRole(userId: number, roleId: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { user_role: true },
    });

    if (!user) throw new NotFoundException('User not found');

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

    if (!userRoleUpdated) throw new NotFoundException('User not found');

    return roleId;
  }
}
