import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AtGuard, RolesGuard } from '../common/guards';
import { RolesEnum } from '@prisma/client';
import { Roles } from '../common/decorators';

@ApiTags('posts')
@UseGuards(AtGuard, RolesGuard)
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('getPosts')
  @Roles(RolesEnum.User, RolesEnum.Editor, RolesEnum.Admin)
  @ApiOkResponse({ description: 'Posts successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'Posts not found' })
  async findAllPosts() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  @Roles(RolesEnum.User, RolesEnum.Editor, RolesEnum.Admin)
  @ApiOkResponse({ description: 'Post successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'Post not found' })
  async findOnePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOnePost(id);
  }

  @Post(':id/create')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'Post successfully created' })
  @ApiUnauthorizedResponse({ description: 'Post creation failed' })
  async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(id, createPostDto);
  }

  @Patch(':id/update/:postId')
  @Roles(RolesEnum.User, RolesEnum.Editor)
  @ApiOkResponse({ description: 'Post successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Post update failed' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, postId, updatePostDto);
  }

  @Delete(':id/delete/:postId')
  @Roles(RolesEnum.User, RolesEnum.Editor)
  @ApiOkResponse({ description: 'Post successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Post deletion failed' })
  async remove(
    @Param('id', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postsService.removePost(userId, postId);
  }
}
