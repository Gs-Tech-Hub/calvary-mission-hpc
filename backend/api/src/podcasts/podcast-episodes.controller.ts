import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PodcastEpisodesService } from './podcast-episodes.service';
import { CreatePodcastEpisodeDto } from './dto/create-podcast-episode.dto';
import { UpdatePodcastEpisodeDto } from './dto/update-podcast-episode.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('podcast-episodes')
export class PodcastEpisodesController {
  constructor(private readonly podcastEpisodesService: PodcastEpisodesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPodcastEpisodeDto: CreatePodcastEpisodeDto, @Request() req) {
    return this.podcastEpisodesService.create(createPodcastEpisodeDto, req.user.id);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.podcastEpisodesService.findAll(query);
  }

  @Get('featured')
  findFeatured() {
    return this.podcastEpisodesService.findFeatured();
  }

  @Get('season/:season')
  findBySeason(@Param('season') season: string) {
    return this.podcastEpisodesService.findBySeason(+season);
  }

  @Get('tags')
  findByTags(@Query('tags') tags: string) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.podcastEpisodesService.findByTags(tagArray);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastEpisodesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePodcastEpisodeDto: UpdatePodcastEpisodeDto) {
    return this.podcastEpisodesService.update(+id, updatePodcastEpisodeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.podcastEpisodesService.remove(+id);
  }

  @Post(':id/download')
  incrementDownloadCount(@Param('id') id: string) {
    return this.podcastEpisodesService.incrementDownloadCount(+id);
  }
}
