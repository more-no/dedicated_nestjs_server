import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateGroupPostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  body: string;

  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty()
  userIds: number[];
}
