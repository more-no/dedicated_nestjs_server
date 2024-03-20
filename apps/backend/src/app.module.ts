import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PostsModule } from './posts/posts.module';
import { GroupPostModule } from './group-post/group-post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    JwtModule,
    PostsModule,
    GroupPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
