import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateGroupPostDto } from './dto/updateGroupPost.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupPostService {
  constructor(private prisma: PrismaService) {}

  findAllGroupPosts() {
    return `This action returns all groupPost`;
  }

  findOneGroupPost(id: number) {
    return `This action returns a #${id} groupPost`;
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

  updateGroupPost(id: number, updateGroupPostDto: UpdateGroupPostDto) {
    return `This action updates a #${id} groupPost`;
  }

  removeGroupPost(id: number) {
    return `This action removes a #${id} groupPost`;
  }
}
