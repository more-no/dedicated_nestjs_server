import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PersonalDataUserDto } from './personalDataUser.dto';
import { Type } from 'class-transformer';

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

  @ApiProperty({ type: () => PersonalDataUserDto })
  @ValidateNested()
  @Type(() => PersonalDataUserDto)
  personal_data: PersonalDataUserDto;
}
