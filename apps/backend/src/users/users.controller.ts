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
import { AtGuard, RolesGuard } from 'src/common/guards';
import { RolesEnum } from '@prisma/client';
import { Roles } from 'src/common/decorators';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create() {
  //   return this.usersService.create();
  // }

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
    return result;
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
  @Patch(':id')
  @Roles(RolesEnum.User)
  @ApiOkResponse({ description: 'User successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Update failed' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
