import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupPostDto } from './createGroupPost.dto';

export class UpdateGroupPostDto extends PartialType(CreateGroupPostDto) {}
