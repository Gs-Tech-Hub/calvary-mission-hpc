import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreatePodcastEpisodeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  audioUrl: string;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  episodeNumber?: number;

  @IsOptional()
  @IsNumber()
  season?: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | any;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
