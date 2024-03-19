import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: number, data: Prisma.PostCreateWithoutUserInput) {
    const newPost = await this.prisma.post.create({
      data: {
        ...data,
        user_id: userId,
      },
    });

    if (!newPost) throw new BadRequestException('Error creating the Post');

    const updateUserPostCount = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        post_count: {
          increment: 1,
        },
      },
    });

    if (!updateUserPostCount)
      throw new BadRequestException('Error updating the post counter');

    return newPost;
  }

  async findAll() {
    return `This action returns all posts`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
