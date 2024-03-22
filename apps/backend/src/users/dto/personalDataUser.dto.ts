import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PersonalDataUserDto {
  @IsString()
  @ApiProperty()
  first_name?: string;

  @IsString()
  @ApiProperty()
  last_name?: string;

  @IsNumber()
  @ApiProperty()
  age?: number;

  @IsString()
  @ApiProperty()
  nationality?: string;
}
