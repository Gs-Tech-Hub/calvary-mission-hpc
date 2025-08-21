import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LivestreamsService } from './livestreams.service';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Livestreams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('livestreams')
export class LivestreamsController {
  constructor(private readonly livestreamsService: LivestreamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new livestream' })
  @ApiResponse({ status: 201, description: 'Livestream created successfully' })
  create(@Body() createLivestreamDto: CreateLivestreamDto) {
    return this.livestreamsService.create(createLivestreamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all livestreams' })
  @ApiResponse({ status: 200, description: 'Livestreams retrieved successfully' })
  findAll() {
    return this.livestreamsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get currently active livestream' })
  @ApiResponse({ status: 200, description: 'Active livestream retrieved successfully' })
  findActive() {
    return this.livestreamsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get livestream by ID' })
  @ApiResponse({ status: 200, description: 'Livestream retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Livestream not found' })
  findOne(@Param('id') id: string) {
    return this.livestreamsService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update livestream' })
  @ApiResponse({ status: 200, description: 'Livestream updated successfully' })
  @ApiResponse({ status: 404, description: 'Livestream not found' })
  update(@Param('id') id: string, @Body() updateLivestreamDto: UpdateLivestreamDto) {
    return this.livestreamsService.update(+id, updateLivestreamDto);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a livestream' })
  @ApiResponse({ status: 200, description: 'Livestream started successfully' })
  @ApiResponse({ status: 404, description: 'Livestream not found' })
  @ApiResponse({ status: 409, description: 'Livestream is not active or already live' })
  startStream(@Param('id') id: string) {
    return this.livestreamsService.startStream(+id);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: 'Stop a livestream' })
  @ApiResponse({ status: 200, description: 'Livestream stopped successfully' })
  @ApiResponse({ status: 404, description: 'Livestream not found' })
  @ApiResponse({ status: 409, description: 'Livestream is not live' })
  stopStream(@Param('id') id: string) {
    return this.livestreamsService.stopStream(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete livestream' })
  @ApiResponse({ status: 200, description: 'Livestream deleted successfully' })
  @ApiResponse({ status: 404, description: 'Livestream not found' })
  remove(@Param('id') id: string) {
    return this.livestreamsService.remove(+id);
  }
}
