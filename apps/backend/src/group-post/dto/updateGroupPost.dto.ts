import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupPostDto } from './createGroupPost.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateGroupPostDto extends PartialType(CreateGroupPostDto) {
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
  @ApiProperty({ type: [Number] })
  userIds: number[];
}
