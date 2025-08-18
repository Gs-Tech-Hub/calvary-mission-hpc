import { IsNumber, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type PaymentType = 'DONATION' | 'EVENT_REGISTRATION' | 'MEMBERSHIP_FEE' | 'BOOKING_FEE' | 'OTHER';
export type PaymentMethod = 'CASH' | 'CHECK' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'ONLINE_PAYMENT' | 'MOBILE_PAYMENT';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, required: false, description: 'Member ID' })
  @IsOptional()
  @IsNumber()
  memberId?: number;

  @ApiProperty({ example: 1, required: false, description: 'User ID' })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ example: 50.00, description: 'Payment amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ 
    example: 'DONATION', 
    enum: ['DONATION', 'EVENT_REGISTRATION', 'MEMBERSHIP_FEE', 'BOOKING_FEE', 'OTHER'] 
  })
  @IsEnum(['DONATION', 'EVENT_REGISTRATION', 'MEMBERSHIP_FEE', 'BOOKING_FEE', 'OTHER'])
  type: PaymentType;

  @ApiProperty({ 
    example: 'CREDIT_CARD', 
    enum: ['CASH', 'CHECK', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'ONLINE_PAYMENT', 'MOBILE_PAYMENT'] 
  })
  @IsEnum(['CASH', 'CHECK', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'ONLINE_PAYMENT', 'MOBILE_PAYMENT'])
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 'Event registration fee', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;
}
