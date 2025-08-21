import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async create(createDonationDto: CreateDonationDto) {
    return this.prisma.donation.create({
      data: createDonationDto,
      include: {
        member: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.donation.findMany({
      include: {
        member: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findById(id: number) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: {
        member: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!donation) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }

    return donation;
  }

  async update(id: number, updateDonationDto: UpdateDonationDto) {
    await this.findById(id);

    return this.prisma.donation.update({
      where: { id },
      data: updateDonationDto,
      include: {
        member: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
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

    return this.prisma.donation.delete({
      where: { id },
    });
  }

  async getDonationStats(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [totalAmount, totalCount, typeStats, categoryStats] = await Promise.all([
      this.prisma.donation.aggregate({
        where: whereClause,
        _sum: {
          amount: true,
        },
      }),
      this.prisma.donation.count({
        where: whereClause,
      }),
      this.prisma.donation.groupBy({
        by: ['type'],
        where: whereClause,
        _sum: {
          amount: true,
        },
        _count: true,
      }),
      this.prisma.donation.groupBy({
        by: ['category'],
        where: whereClause,
        _sum: {
          amount: true,
        },
        _count: true,
      }),
    ]);

    return {
      totalAmount: totalAmount._sum.amount || 0,
      totalCount,
      typeStats,
      categoryStats,
    };
  }
}
