import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    // Check if user already has a membership
    const existingMember = await this.prisma.member.findUnique({
      where: { userId: createMemberDto.userId },
    });

    if (existingMember) {
      throw new ConflictException('User already has a membership');
    }

    // Generate unique member number
    const memberNumber = await this.generateMemberNumber();

    return this.prisma.member.create({
      data: {
        ...createMemberDto,
        memberNumber,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.member.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return member;
  }

  async findByUserId(userId: number) {
    return this.prisma.member.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    await this.findById(id);

    return this.prisma.member.update({
      where: { id },
      data: updateMemberDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findById(id);

    return this.prisma.member.delete({
      where: { id },
    });
  }

  private async generateMemberNumber(): Promise<string> {
    const prefix = 'MEM';
    const year = new Date().getFullYear();
    const count = await this.prisma.member.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });
    
    return `${prefix}${year}${(count + 1).toString().padStart(4, '0')}`;
  }
}
