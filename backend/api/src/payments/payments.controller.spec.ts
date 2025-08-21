import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPaymentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a payment', async () => {
    const createDto = { amount: 50, type: 'DONATION', paymentMethod: 'CREDIT_CARD' };
    const expected = { id: 1, ...createDto };
    mockPaymentsService.create.mockResolvedValue(expected);

    const result = await controller.create(createDto);
    expect(result).toEqual(expected);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });
});
