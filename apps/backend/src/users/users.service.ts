import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UploadResultDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

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

      return this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          username: updateUserDto.username,
          fullname: updateUserDto.fullname,
          picture_url: updateUserDto.pictureUrl,
          bio: updateUserDto.bio,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async upload(userId: number, pictureUrl: string): Promise<UploadResultDto> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { picture_url: pictureUrl },
    });

    return { userId, filename: pictureUrl };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
