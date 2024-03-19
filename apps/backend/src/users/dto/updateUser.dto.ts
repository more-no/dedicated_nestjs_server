import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, isNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  fullname?: string;

  @IsString()
  @ApiProperty()
  bio?: string;
}
