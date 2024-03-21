import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAllPosts(): Promise<Post[]> {
    const allPosts = await this.prisma.post.findMany();

    if (!allPosts) throw new BadRequestException('Error retrieving the Posts');

    return allPosts;
  }

  async findOnePost(id: number): Promise<Post> {
    const Post = await this.prisma.post.findFirstOrThrow({
      where: {
        id: id,
      },
    });

    return Post;
  }

  async createPost(
    userId: number,
    data: Prisma.PostCreateWithoutUserInput,
  ): Promise<Post> {
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
  ): Promise<Post> {
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

  async removePost(userId: number, postId: number): Promise<Post> {
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
