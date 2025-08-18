import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PodcastSeriesService } from './podcast-series.service';
import { CreatePodcastSeriesDto } from './dto/create-podcast-series.dto';
import { UpdatePodcastSeriesDto } from './dto/update-podcast-series.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('podcast-series')
export class PodcastSeriesController {
  constructor(private readonly podcastSeriesService: PodcastSeriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPodcastSeriesDto: CreatePodcastSeriesDto, @Request() req) {
    return this.podcastSeriesService.create(createPodcastSeriesDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.podcastSeriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastSeriesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePodcastSeriesDto: UpdatePodcastSeriesDto) {
    return this.podcastSeriesService.update(+id, updatePodcastSeriesDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.podcastSeriesService.remove(+id);
  }
}
