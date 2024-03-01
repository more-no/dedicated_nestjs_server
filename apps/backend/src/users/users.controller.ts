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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from './sharp.pipe';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AtGuard, RolesGuard } from '../common/guards';
import { RolesEnum } from '@prisma/client';
import { Roles } from '../common/decorators';
import { Request } from 'express';
import { TokenInterceptor } from '../common/interceptors/token.interceptor';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // reference https://docs.nestjs.com/techniques/file-upload
  @UseGuards(AtGuard, RolesGuard)
  @Post(':id/upload')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'User picture successfully uploaded' })
  @ApiUnauthorizedResponse({ description: 'Upload failed' })
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @Param('id') userId: string,
    @UploadedFile(SharpPipe) filename: string,
  ) {
    const result = await this.usersService.upload(+userId, filename);
    return [userId, filename];
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @UseGuards(AtGuard, RolesGuard)
  @Patch(':id/update')
  @Roles(RolesEnum.User, RolesEnum.Editor)
  @ApiOkResponse({ description: 'User successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Update failed' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  // reference https://docs.nestjs.com/controllers#request-object

  @UseGuards(AtGuard, RolesGuard)
  @UseInterceptors(TokenInterceptor)
  @Delete(':id/remove')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Deletion failed' })
  async userRemove(@Param('id') id, @Req() request: Request) {
    return await this.usersService.userRemove(+id, request);
  }

  //   Subscription:
  // When this.usersService.userRemove(...) is called in the userRemove method of your controller, the interceptor's observable returned by next.handle() is automatically subscribed to. This is because NestJS internally handles the subscription to the observable returned by the interceptor when it's used as an interceptor in a controller method. NestJS manages the execution flow and ensures that the interceptor's observable is properly handled.

  // Execution Flow:
  // The execution flow within NestJS ensures that the interceptor's observable is subscribed to, and its result (emitted by the observable) is awaited by the await keyword in the controller method (userRemove). Once the interceptor's observable emits a value, the execution continues with the result of this.usersService.userRemove(...).

  // Admin endpoints

  @UseGuards(AtGuard, RolesGuard)
  @Delete('remove/:id')
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Deletion failed' })
  async adminRemove(@Param('id') id: string) {
    return await this.usersService.adminRemove(+id);
  }

  @UseGuards(AtGuard, RolesGuard)
  @Patch('role/:id')
  @Roles(RolesEnum.Admin)
  @ApiOkResponse({ description: 'Role successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Update failed' })
  async updateRole(@Param('id') id: string, @Body('roleId') roleId: number) {
    return await this.usersService.updateRole(+id, +roleId);
  }
}
