import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString, ValidateNested } from 'class-validator';
import { PersonalDataUserDto } from 'users/dto/personalDataUser.dto';

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  fullname: string | null;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  picture_url: string | null;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  bio: string | null;

  @ApiProperty()
  date_registration: Date;

  @Exclude()
  password_hash: string;

  @Exclude()
  refresh_token: string;

  @IsNumber()
  @ApiProperty()
  post_count: number;

  @IsNumber()
  @ApiProperty()
  comment_count: number;

  @ValidateNested()
  @Type(() => PersonalDataUserDto)
  personal_data: PersonalDataUserDto[];
}
