import { IsNumber, IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DonationType, DonationCategory } from '@prisma/client';

export class CreateDonationDto {
  @ApiProperty({ example: 1, required: false, description: 'Member ID' })
  @IsOptional()
  @IsNumber()
  memberId?: number;

  @ApiProperty({ example: 1, required: false, description: 'User ID' })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ example: 100.50, description: 'Donation amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ 
    example: 'TITHING', 
    enum: ['TITHING', 'OFFERING', 'SPECIAL_OFFERING', 'MISSION', 'BUILDING_FUND', 'OTHER'] 
  })
  @IsEnum(DonationType)
  type: DonationType;

  @ApiProperty({ 
    example: 'GENERAL', 
    enum: ['GENERAL', 'YOUTH_MINISTRY', 'MUSIC_MINISTRY', 'CHILDREN_MINISTRY', 'OUTREACH', 'MAINTENANCE', 'TECHNOLOGY', 'OTHER'] 
  })
  @IsEnum(DonationCategory)
  category: DonationCategory;

  @ApiProperty({ example: 'Monthly tithe', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;
}
