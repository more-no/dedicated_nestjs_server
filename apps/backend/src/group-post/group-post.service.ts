import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateGroupPostDto } from './dto/updateGroupPost.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupPostService {
  constructor(private prisma: PrismaService) {}

  async findAllGroupPosts() {
    const allGroupPost = await this.prisma.groupPost.findMany();

    if (!allGroupPost)
      throw new BadRequestException('Error retrieving the Group Posts');

    return allGroupPost;
  }

  async findOneGroupPost(id: number) {
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
  ) {
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

  async updateGroupPost(id: number, updateGroupPostDto: UpdateGroupPostDto) {
    return `This action updates a #${id} groupPost`;
  }

  async removeGroupPost(id: number) {
    return `This action removes a #${id} groupPost`;
  }
}
