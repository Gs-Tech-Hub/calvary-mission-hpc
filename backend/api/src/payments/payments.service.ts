import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Generate unique transaction ID
    const transactionId = this.generateTransactionId();

    return this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        transactionId,
      },
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
    return this.prisma.payment.findMany({
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
    const payment = await this.prisma.payment.findUnique({
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

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    await this.findById(id);

    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
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

    return this.prisma.payment.delete({
      where: { id },
    });
  }

  async processPayment(id: number) {
    const payment = await this.findById(id);
    
    if (payment.status !== 'PENDING') {
      throw new ConflictException('Payment is not pending');
    }

    // Here you would integrate with your payment processor
    // For now, we'll simulate a successful payment
    const success = await this.simulatePaymentProcessing(payment);

    if (success) {
      return this.prisma.payment.update({
        where: { id },
        data: {
          status: 'COMPLETED',
        },
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
    } else {
      return this.prisma.payment.update({
        where: { id },
        data: {
          status: 'FAILED',
        },
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
  }

  async getPaymentStats(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [totalAmount, totalCount, statusStats, methodStats] = await Promise.all([
      this.prisma.payment.aggregate({
        where: whereClause,
        _sum: {
          amount: true,
        },
      }),
      this.prisma.payment.count({
        where: whereClause,
      }),
      this.prisma.payment.groupBy({
        by: ['status'],
        where: whereClause,
        _sum: {
          amount: true,
        },
        _count: true,
      }),
      this.prisma.payment.groupBy({
        by: ['paymentMethod'],
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
      statusStats,
      methodStats,
    };
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN${timestamp}${random}`.toUpperCase();
  }

  private async simulatePaymentProcessing(payment: any): Promise<boolean> {
    // Simulate payment processing with 90% success rate
    return Math.random() > 0.1;
  }
}
