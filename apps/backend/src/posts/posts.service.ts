import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAllPosts() {
    const allPosts = await this.prisma.post.findMany();

    if (!allPosts) throw new BadRequestException('Error retriving the Posts');

    return allPosts;
  }

  async findOnePost(id: number) {
    const Post = await this.prisma.post.findFirstOrThrow({
      where: {
        id: id,
      },
    });

    return Post;
  }

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

  async update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
