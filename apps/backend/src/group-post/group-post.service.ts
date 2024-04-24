import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GroupPost, Prisma } from '@prisma/client';

@Injectable()
export class GroupPostService {
  constructor(private prisma: PrismaService) {}

  async getGroupPosts(): Promise<GroupPost[]> {
    const allGroupPost = await this.prisma.groupPost.findMany();

    if (!allGroupPost)
      throw new BadRequestException('Error retrieving the Group Posts');

    return allGroupPost;
  }

  async getGroupPostById(id: number): Promise<GroupPost> {
    const groupPost = await this.prisma.groupPost.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return groupPost;
  }

  async createGroupPost(
    userIds: number[],
    data: Prisma.GroupPostCreateWithoutUserInput,
  ): Promise<GroupPost> {
    const groupPost = await this.prisma.groupPost.create({
      data: {
        title: data.title,
        body: data.body,
        user: {
          create: userIds.map((id) => ({ user: { connect: { id } } })),
        },
      },
    });

    if (!groupPost)
      throw new BadRequestException('Error creating the group post');

    const updateUsersPostCount = await Promise.all(
      userIds.map(async (id) => {
        await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            post_count: {
              increment: 1,
            },
          },
        });
      }),
    );

    if (!updateUsersPostCount)
      throw new BadRequestException('Error updating the post counts');

    return groupPost;
  }

  async updateGroupPost(
    userId: number,
    postId: number,
    userIds: number[],
    data: Prisma.GroupPostUpdateWithoutUserInput,
  ): Promise<GroupPost> {
    if (!userIds.includes(userId)) {
      throw new Error('User ID does not match any of the userIds');
    }

    const updatedGroupPost = await this.prisma.groupPost.update({
      where: { id: postId },
      data: {
        title: data.title,
        body: data.body,
      },
    });

    if (!updatedGroupPost)
      throw new BadRequestException('Error creating Group Post');

    return updatedGroupPost;
  }

  async removeGroupPost(
    userId: number,
    postId: number,
    userIds: number[],
  ): Promise<GroupPost> {
    if (!userIds.includes(userId)) {
      throw new Error('User ID does not match any of the userIds');
    }

    const deletedGroupPost = await this.prisma.groupPost.delete({
      where: {
        id: postId,
      },
    });

    if (!deletedGroupPost)
      throw new BadRequestException('Error deleting the Group Post');

    return deletedGroupPost;
  }
}
