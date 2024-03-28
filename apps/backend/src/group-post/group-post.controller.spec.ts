import { Test, TestingModule } from '@nestjs/testing';
import { GroupPostController } from './group-post.controller';
import { GroupPostService } from './group-post.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('GroupPostController', () => {
  let controller: GroupPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupPostController],
      providers: [GroupPostService, PrismaService, ConfigService, JwtService],
    }).compile();

    controller = module.get<GroupPostController>(GroupPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
