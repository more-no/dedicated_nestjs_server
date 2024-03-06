import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  // @IsNumber()
  // @ApiProperty()
  // id: number;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  fullname: string;

  @IsString()
  @ApiProperty()
  bio: string;
}
