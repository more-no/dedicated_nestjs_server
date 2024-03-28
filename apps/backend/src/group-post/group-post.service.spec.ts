import { Test, TestingModule } from '@nestjs/testing';
import { GroupPostService } from './group-post.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('GroupPostService', () => {
  let service: GroupPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupPostService, PrismaService, ConfigService, JwtService],
    }).compile();

    service = module.get<GroupPostService>(GroupPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
