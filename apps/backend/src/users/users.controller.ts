import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  ParseIntPipe,
  Get,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UploadResultDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from './sharp.pipe';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AtGuard, RolesGuard } from '../common/guards';
import { RolesEnum } from '@prisma/client';
import { Roles } from '../common/decorators';
import { Request } from 'express';
import { TokenInterceptor } from '../common/interceptors/token.interceptor';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AtGuard, RolesGuard)
  @Get('findAll')
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'Users successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Users not found' })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @UseGuards(AtGuard, RolesGuard)
  @Get(':id')
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'User successfully retrieved' })
  @ApiBadRequestResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  // reference https://docs.nestjs.com/techniques/file-upload
  @UseGuards(AtGuard, RolesGuard)
  @Post(':id/upload')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'User picture successfully uploaded' })
  @ApiUnauthorizedResponse({ description: 'Upload failed' })
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFile(SharpPipe) uploadResultDto: UploadResultDto,
  ) {
    const result = await this.usersService.upload(userId, uploadResultDto);
    return [uploadResultDto.userId, uploadResultDto.filename];
  }

  @UseGuards(AtGuard, RolesGuard)
  @Patch(':id/update')
  @Roles(RolesEnum.User, RolesEnum.Editor)
  @ApiOkResponse({ description: 'User successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Update failed' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  // reference https://docs.nestjs.com/controllers#request-object

  @UseGuards(AtGuard, RolesGuard)
  @UseInterceptors(TokenInterceptor)
  @Delete(':id/remove')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Deletion failed' })
  async userRemove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    return await this.usersService.userRemove(id, request);
  }

  // Admin endpoints

  @UseGuards(AtGuard, RolesGuard)
  @Delete('remove/:id')
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Deletion failed' })
  async adminRemove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.adminRemove(id);
  }

  @UseGuards(AtGuard, RolesGuard)
  @Patch('role/:id')
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'Role successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Update failed' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleId', ParseIntPipe) roleId: number,
  ) {
    return await this.usersService.updateRole(id, roleId);
  }
}
