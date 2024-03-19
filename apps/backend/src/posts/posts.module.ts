import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { RolesGuard } from 'common/guards';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PostsController],
  providers: [PostsService, RolesGuard],
})
export class PostsModule {}
