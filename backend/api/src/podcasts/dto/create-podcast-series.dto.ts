import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePodcastSeriesDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
