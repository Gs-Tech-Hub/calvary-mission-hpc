import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLivestreamDto {
  @ApiProperty({ example: 'Sunday Service Live' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Join us for Sunday service', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isLive?: boolean;

  @ApiProperty({ example: '2024-01-15T09:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ example: 1, description: 'User ID who created the livestream' })
  createdBy: number;
}
