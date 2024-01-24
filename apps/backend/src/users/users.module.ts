import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtModule } from '@nestjs/jwt';

// https://github.com/expressjs/multer#memorystorage

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
