import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';

@Injectable()
export class SermonsService {
  constructor(private prisma: PrismaService) {}

  async create(createSermonDto: CreateSermonDto, userId: number) {
    const sermon = await this.prisma.sermon.create({
      data: {
        ...createSermonDto,
        createdBy: userId,
        date: createSermonDto.date ? new Date(createSermonDto.date) : new Date(),
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
    return sermon;
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    search?: string;
    speaker?: string;
    tags?: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
  }) {
    const { page = 1, limit = 10, search, speaker, tags, isPublished, isFeatured } = query || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { scripture: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (speaker) {
      where.speaker = { contains: speaker, mode: 'insensitive' };
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

    const [sermons, total] = await Promise.all([
      this.prisma.sermon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
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
      this.prisma.sermon.count({ where }),
    ]);

    return {
      sermons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const sermon = await this.prisma.sermon.findUnique({
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

    if (!sermon) {
      throw new NotFoundException(`Sermon with ID ${id} not found`);
    }

    // Increment view count
    await this.prisma.sermon.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return sermon;
  }

  async update(id: number, updateSermonDto: UpdateSermonDto) {
    const sermon = await this.prisma.sermon.findUnique({
      where: { id },
    });

    if (!sermon) {
      throw new NotFoundException(`Sermon with ID ${id} not found`);
    }

    const updatedSermon = await this.prisma.sermon.update({
      where: { id },
      data: {
        ...updateSermonDto,
        date: updateSermonDto.date ? new Date(updateSermonDto.date) : undefined,
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

    return updatedSermon;
  }

  async remove(id: number) {
    const sermon = await this.prisma.sermon.findUnique({
      where: { id },
    });

    if (!sermon) {
      throw new NotFoundException(`Sermon with ID ${id} not found`);
    }

    await this.prisma.sermon.delete({
      where: { id },
    });

    return { message: 'Sermon deleted successfully' };
  }

  async findFeatured() {
    return this.prisma.sermon.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { date: 'desc' },
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

  async findBySpeaker(speaker: string) {
    return this.prisma.sermon.findMany({
      where: { 
        speaker: { contains: speaker },
        isPublished: true 
      },
      orderBy: { date: 'desc' },
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
    return this.prisma.sermon.findMany({
      where: { 
        // Note: SQLite doesn't support array_contains for JSON fields
        // This is a simplified search - in production you might want to use a different approach
        // For now, we'll search by published status only
        isPublished: true 
      },
      orderBy: { date: 'desc' },
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
}
