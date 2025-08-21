import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    payment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment', async () => {
    const createDto: CreatePaymentDto = { 
      amount: 50, 
      type: 'DONATION', 
      paymentMethod: 'CREDIT_CARD' 
    };
    const expected = { id: 1, ...createDto, transactionId: expect.any(String) };
    mockPrismaService.payment.create.mockResolvedValue(expected);

    const result = await service.create(createDto);
    expect(result).toEqual(expected);
    expect(prisma.payment.create).toHaveBeenCalledWith({
      data: {
        ...createDto,
        transactionId: expect.any(String),
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
  });
});
