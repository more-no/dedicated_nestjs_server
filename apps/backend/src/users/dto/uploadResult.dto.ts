import { ApiProperty } from '@nestjs/swagger';

export class UploadResultDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  filename: string;
}
