import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import * as crypto from 'crypto';

@Injectable()
export class LivestreamsService {
  constructor(private prisma: PrismaService) {}

  async create(createLivestreamDto: CreateLivestreamDto) {
    // Generate unique stream key
    const streamKey = this.generateStreamKey();
    
    // Generate RTMP URL (this would typically come from your streaming service)
    const rtmpUrl = `rtmp://live.example.com/live/${streamKey}`;

    return this.prisma.livestream.create({
      data: {
        ...createLivestreamDto,
        streamKey,
        rtmpUrl,
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
  }

  async findAll() {
    return this.prisma.livestream.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number) {
    const livestream = await this.prisma.livestream.findUnique({
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

    if (!livestream) {
      throw new NotFoundException(`Livestream with ID ${id} not found`);
    }

    return livestream;
  }

  async findActive() {
    return this.prisma.livestream.findFirst({
      where: {
        isActive: true,
        isLive: true,
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
  }

  async update(id: number, updateLivestreamDto: UpdateLivestreamDto) {
    await this.findById(id);

    return this.prisma.livestream.update({
      where: { id },
      data: updateLivestreamDto,
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
  }

  async remove(id: number) {
    await this.findById(id);

    return this.prisma.livestream.delete({
      where: { id },
    });
  }

  async startStream(id: number) {
    const livestream = await this.findById(id);
    
    if (!livestream.isActive) {
      throw new ConflictException('Livestream is not active');
    }

    if (livestream.isLive) {
      throw new ConflictException('Livestream is already live');
    }

    return this.prisma.livestream.update({
      where: { id },
      data: {
        isLive: true,
        startTime: new Date(),
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
  }

  async stopStream(id: number) {
    const livestream = await this.findById(id);
    
    if (!livestream.isLive) {
      throw new ConflictException('Livestream is not live');
    }

    return this.prisma.livestream.update({
      where: { id },
      data: {
        isLive: false,
        endTime: new Date(),
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
  }

  private generateStreamKey(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
