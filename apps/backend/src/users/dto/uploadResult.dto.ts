import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UploadResultDto {
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsString()
  @ApiProperty()
  filename: string;
}
