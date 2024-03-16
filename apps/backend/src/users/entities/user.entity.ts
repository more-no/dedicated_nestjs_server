import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  fullname: string | null;

  @ApiProperty({ required: false, nullable: true })
  picture_url: string | null;

  @ApiProperty({ required: false, nullable: true })
  bio: string | null;

  @ApiProperty()
  date_registration: Date;

  @Exclude()
  password_hash: string;

  @Exclude()
  refresh_token: string;

  @ApiProperty()
  post_count: number;

  @ApiProperty()
  comment_count: number;

  @ApiProperty()
  user_subscriptions: number;
}
