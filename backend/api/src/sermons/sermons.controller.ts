import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SermonsService } from './sermons.service';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonsService: SermonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSermonDto: CreateSermonDto, @Request() req) {
    return this.sermonsService.create(createSermonDto, req.user.id);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.sermonsService.findAll(query);
  }

  @Get('featured')
  findFeatured() {
    return this.sermonsService.findFeatured();
  }

  @Get('speaker/:speaker')
  findBySpeaker(@Param('speaker') speaker: string) {
    return this.sermonsService.findBySpeaker(speaker);
  }

  @Get('tags')
  findByTags(@Query('tags') tags: string) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.sermonsService.findByTags(tagArray);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sermonsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSermonDto: UpdateSermonDto) {
    return this.sermonsService.update(+id, updateSermonDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.sermonsService.remove(+id);
  }
}
