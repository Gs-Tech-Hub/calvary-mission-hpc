import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePodcastSeriesDto } from './dto/create-podcast-series.dto';
import { UpdatePodcastSeriesDto } from './dto/update-podcast-series.dto';

@Injectable()
export class PodcastSeriesService {
  constructor(private prisma: PrismaService) {}

  async create(createPodcastSeriesDto: CreatePodcastSeriesDto, userId: number) {
    const series = await this.prisma.podcastSeries.create({
      data: {
        ...createPodcastSeriesDto,
        createdBy: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return series;
  }

  async findAll() {
    return this.prisma.podcastSeries.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const series = await this.prisma.podcastSeries.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!series) {
      throw new NotFoundException(`Podcast series with ID ${id} not found`);
    }

    return series;
  }

  async update(id: number, updatePodcastSeriesDto: UpdatePodcastSeriesDto) {
    const series = await this.prisma.podcastSeries.findUnique({
      where: { id },
    });

    if (!series) {
      throw new NotFoundException(`Podcast series with ID ${id} not found`);
    }

    const updatedSeries = await this.prisma.podcastSeries.update({
      where: { id },
      data: updatePodcastSeriesDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedSeries;
  }

  async remove(id: number) {
    const series = await this.prisma.podcastSeries.findUnique({
      where: { id },
    });

    if (!series) {
      throw new NotFoundException(`Podcast series with ID ${id} not found`);
    }

    await this.prisma.podcastSeries.delete({
      where: { id },
    });

    return { message: 'Podcast series deleted successfully' };
  }
}
