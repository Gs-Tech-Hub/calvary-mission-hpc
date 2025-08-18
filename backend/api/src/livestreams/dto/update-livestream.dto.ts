import { PartialType } from '@nestjs/swagger';
import { CreateLivestreamDto } from './create-livestream.dto';

export class UpdateLivestreamDto extends PartialType(CreateLivestreamDto) {}
