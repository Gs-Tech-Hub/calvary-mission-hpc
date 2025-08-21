import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePodcastEpisodeDto } from './dto/create-podcast-episode.dto';
import { UpdatePodcastEpisodeDto } from './dto/update-podcast-episode.dto';

@Injectable()
export class PodcastEpisodesService {
  constructor(private prisma: PrismaService) {}

  async create(createPodcastEpisodeDto: CreatePodcastEpisodeDto, userId: number) {
    const episode = await this.prisma.podcastEpisode.create({
      data: {
        ...createPodcastEpisodeDto,
        createdBy: userId,
        publishedAt: createPodcastEpisodeDto.publishedAt ? new Date(createPodcastEpisodeDto.publishedAt) : undefined,
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
    return episode;
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    search?: string;
    season?: number;
    tags?: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
  }) {
    const { page = 1, limit = 10, search, season, tags, isPublished, isFeatured } = query || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (season) {
      where.season = season;
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    const [episodes, total] = await Promise.all([
      this.prisma.podcastEpisode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.podcastEpisode.count({ where }),
    ]);

    return {
      episodes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const episode = await this.prisma.podcastEpisode.findUnique({
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

    if (!episode) {
      throw new NotFoundException(`Podcast episode with ID ${id} not found`);
    }

    // Increment play count
    await this.prisma.podcastEpisode.update({
      where: { id },
      data: { playCount: { increment: 1 } },
    });

    return episode;
  }

  async update(id: number, updatePodcastEpisodeDto: UpdatePodcastEpisodeDto) {
    const episode = await this.prisma.podcastEpisode.findUnique({
      where: { id },
    });

    if (!episode) {
      throw new NotFoundException(`Podcast episode with ID ${id} not found`);
    }

    const updatedEpisode = await this.prisma.podcastEpisode.update({
      where: { id },
      data: {
        ...updatePodcastEpisodeDto,
        publishedAt: updatePodcastEpisodeDto.publishedAt ? new Date(updatePodcastEpisodeDto.publishedAt) : undefined,
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

    return updatedEpisode;
  }

  async remove(id: number) {
    const episode = await this.prisma.podcastEpisode.findUnique({
      where: { id },
    });

    if (!episode) {
      throw new NotFoundException(`Podcast episode with ID ${id} not found`);
    }

    await this.prisma.podcastEpisode.delete({
      where: { id },
    });

    return { message: 'Podcast episode deleted successfully' };
  }

  async findFeatured() {
    return this.prisma.podcastEpisode.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 5,
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

  async findBySeason(season: number) {
    return this.prisma.podcastEpisode.findMany({
      where: { 
        season,
        isPublished: true 
      },
      orderBy: { episodeNumber: 'asc' },
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

  async findByTags(tags: string[]) {
    return this.prisma.podcastEpisode.findMany({
      where: { 
        // Note: SQLite doesn't support array_contains for JSON fields
        // This is a simplified search - in production you might want to use a different approach
        // For now, we'll search by published status only
        isPublished: true 
      },
      orderBy: { publishedAt: 'desc' },
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

  async incrementDownloadCount(id: number) {
    return this.prisma.podcastEpisode.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
  }
}
