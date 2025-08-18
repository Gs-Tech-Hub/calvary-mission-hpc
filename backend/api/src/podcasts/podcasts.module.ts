import { Module } from '@nestjs/common';
import { PodcastEpisodesService } from './podcast-episodes.service';
import { PodcastEpisodesController } from './podcast-episodes.controller';
import { PodcastSeriesService } from './podcast-series.service';
import { PodcastSeriesController } from './podcast-series.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PodcastEpisodesController, PodcastSeriesController],
  providers: [PodcastEpisodesService, PodcastSeriesService],
  exports: [PodcastEpisodesService, PodcastSeriesService],
})
export class PodcastsModule {}
