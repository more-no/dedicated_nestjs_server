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
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AtGuard, RolesGuard } from '../common/guards';
import { RolesEnum } from '@prisma/client';
import { Roles } from '../common/decorators';
import { TokenInterceptor } from '../common/interceptors/token.interceptor';
import { UserEntity } from './entities/user.entity';
import { CustomRequest } from 'common/types';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('getUsers')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'Users successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Users not found' })
  async findAll() {
    const users = await this.usersService.getUsers();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RolesEnum.User, RolesEnum.Admin)
  @ApiOkResponse({ description: 'User successfully retrieved' })
  @ApiBadRequestResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.getUserById(id));
  }

  // reference https://docs.nestjs.com/techniques/file-upload
  @Post(':id/upload')
  @UseGuards(AtGuard, RolesGuard)
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

  @Patch(':id/update')
  @UseGuards(AtGuard, RolesGuard)
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

  @UseInterceptors(TokenInterceptor)
  @UseGuards(AtGuard, RolesGuard)
  @Delete(':id/remove')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Deletion failed' })
  async userRemove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: CustomRequest,
  ) {
    return await this.usersService.userRemove(id, request);
  }

  // Admin endpoints

  @Delete('remove/:id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Deletion failed' })
  async adminRemove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.adminRemove(id);
  }

  @Patch('role/:id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'Role successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Update failed' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return await this.usersService.updateRole(id, roleId);
  }
}
