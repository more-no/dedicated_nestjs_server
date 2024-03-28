import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GroupPostService } from './group-post.service';
import { CreateGroupPostDto } from './dto/createGroupPost.dto';
import { UpdateGroupPostDto } from './dto/updateGroupPost.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators';
import { RolesEnum } from '@prisma/client';
import { AtGuard, RolesGuard } from '../common/guards';

@ApiTags('group-posts')
@UseGuards(AtGuard, RolesGuard)
@ApiBearerAuth()
@Controller('group')
export class GroupPostController {
  constructor(private readonly groupPostService: GroupPostService) {}

  @Get('getposts')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'Group posts successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'Group Posts not found' })
  async findAllGroupPosts() {
    return this.groupPostService.findAllGroupPosts();
  }

  @Get(':id')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'Group Post successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'Group Post not found' })
  async findOneGroupPost(@Param('id', ParseIntPipe) id: number) {
    return this.groupPostService.findOneGroupPost(id);
  }

  @Post(':id/create')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'Group Post successfully created' })
  @ApiUnauthorizedResponse({ description: 'Group Post creation failed' })
  async createGroupPost(
    @Body() { userIds, ...createGroupPostDto }: CreateGroupPostDto,
  ) {
    return this.groupPostService.createGroupPost(userIds, createGroupPostDto);
  }

  @Patch(':id/updates/:postId')
  @Roles(RolesEnum.User, RolesEnum.Editor)
  @ApiOkResponse({ description: 'Group Post successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Group Post update failed' })
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() { userIds, ...updateGroupPostDto }: UpdateGroupPostDto,
  ) {
    return this.groupPostService.updateGroupPost(
      userId,
      postId,
      userIds,
      updateGroupPostDto,
    );
  }

  @Delete(':id/delete/:postId')
  @Roles(RolesEnum.User, RolesEnum.Editor)
  @ApiOkResponse({ description: 'Group Post successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Group Post deletion failed' })
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() userIds: number[],
  ) {
    return this.groupPostService.removeGroupPost(userId, postId, userIds);
  }
}
