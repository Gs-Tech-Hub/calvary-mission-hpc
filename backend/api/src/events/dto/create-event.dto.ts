import { IsString, IsOptional, IsBoolean, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Youth Group Meeting' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Weekly youth group meeting and activities', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15T18:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-01-15T20:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Fellowship Hall', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  maxCapacity?: number;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, description: 'User ID who created the event' })
  createdBy: number;
}
