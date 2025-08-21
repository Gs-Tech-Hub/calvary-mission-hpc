import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsEnum, IsDateString } from 'class-validator';
import { ArticleCategory } from '@prisma/client';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  author: string;

  @IsEnum(ArticleCategory)
  category: ArticleCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | any;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  readTime?: number;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
