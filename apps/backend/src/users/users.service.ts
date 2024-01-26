import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto, UploadResultDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // create() {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userUpdated = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          username: updateUserDto.username,
          fullname: updateUserDto.fullname,
          bio: updateUserDto.bio,
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
    } catch (error) {
      throw new NotFoundException(`Failed to update user: ${error.message}`);
    }
  }

  async upload(userId: number, pictureUrl: string): Promise<UploadResultDto> {
    try {
      const userUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: { picture_url: pictureUrl },
      });

      if (!userUpdated) {
        throw new BadRequestException('Could not upload');
      }

      return { userId, filename: pictureUrl };
    } catch (error) {
      throw new NotFoundException(`Failed to upload: ${error.message}`);
    }
  }

  async remove(userId: number): Promise<number> {
    try {
      const userDeleted = await this.prisma.user.delete({
        where: { id: userId },
      });

      if (!userDeleted) {
        throw new BadRequestException('Could not delete the User');
      }

      const deletedSession = await this.prisma.session.deleteMany({
        where: { user_id: userId },
      });

      if (!deletedSession) {
        throw new InternalServerErrorException('Error during deletion');
      }

      return userId;
    } catch (error) {
      throw new NotFoundException('Failed to find the User');
    }
  }
}
