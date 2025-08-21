import { PartialType } from '@nestjs/mapped-types';
import { CreatePodcastSeriesDto } from './create-podcast-series.dto';

export class UpdatePodcastSeriesDto extends PartialType(CreatePodcastSeriesDto) {}
