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
import { Roles } from 'common/decorators';
import { RolesEnum } from '@prisma/client';
import { AtGuard, RolesGuard } from 'common/guards';

@ApiTags('group-posts')
@ApiBearerAuth()
@Controller('group')
export class GroupPostController {
  constructor(private readonly groupPostService: GroupPostService) {}

  @Get('getposts')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'Group posts successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'Posts not found' })
  async findAllGroupPosts() {
    return this.groupPostService.findAllGroupPosts();
  }

  @Get(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'Group Post successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'Post not found' })
  async findOneGroupPost(@Param('id', ParseIntPipe) id: number) {
    return this.groupPostService.findOneGroupPost(id);
  }

  @Post(':id/create')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'Post successfully created' })
  @ApiUnauthorizedResponse({ description: 'Post creation failed' })
  async createGroupPost(
    @Body() { userIds, ...createGroupPostDto }: CreateGroupPostDto,
  ) {
    return this.groupPostService.createGroupPost(userIds, createGroupPostDto);
  }

  @Patch(':id/updates/:postId')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupPostDto: UpdateGroupPostDto,
  ) {
    return this.groupPostService.updateGroupPost(id, updateGroupPostDto);
  }

  @Delete(':id/delete/:postId')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupPostService.removeGroupPost(id);
  }
}
