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

  async updatePost(
    userId: number,
    postId: number,
    data: Prisma.PostUpdateInput,
  ) {
    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
        user_id: userId,
      },
      data: {
        title: data.title,
        body: data.body,
      },
    });

    return updatedPost;
  }

  async removePost(userId: number, postId: number) {
    const deletedPost = await this.prisma.post.delete({
      where: {
        id: postId,
        user_id: userId,
      },
    });

    if (!deletedPost) throw new BadRequestException('Error deleting the Post');

    const updateUserPostCount = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        post_count: {
          decrement: 1,
        },
      },
    });

    if (!updateUserPostCount)
      throw new BadRequestException('Error updating the post counter');

    return deletedPost;
  }
}
