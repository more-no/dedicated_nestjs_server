import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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

@ApiTags('group posts')
@ApiBearerAuth()
@Controller('group-post')
export class GroupPostController {
  constructor(private readonly groupPostService: GroupPostService) {}

  @Get()
  findAllGroupPosts() {
    return this.groupPostService.findAllGroupPosts();
  }

  @Get(':id')
  findOneGroupPost(@Param('id') id: string) {
    return this.groupPostService.findOneGroupPost(+id);
  }

  @Post('group')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'Post successfully created' })
  @ApiUnauthorizedResponse({ description: 'Post creation failed' })
  async createGroupPost(
    @Body() { userIds, ...createGroupPostDto }: CreateGroupPostDto,
  ) {
    return this.groupPostService.createGroupPost(userIds, createGroupPostDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupPostDto: UpdateGroupPostDto,
  ) {
    return this.groupPostService.updateGroupPost(+id, updateGroupPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupPostService.removeGroupPost(+id);
  }
}
