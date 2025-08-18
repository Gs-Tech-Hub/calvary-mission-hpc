import { PartialType } from '@nestjs/mapped-types';
import { CreatePodcastEpisodeDto } from './create-podcast-episode.dto';

export class UpdatePodcastEpisodeDto extends PartialType(CreatePodcastEpisodeDto) {}
