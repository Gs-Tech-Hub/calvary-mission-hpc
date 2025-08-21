import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Donations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new donation' })
  @ApiResponse({ status: 201, description: 'Donation created successfully' })
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all donations' })
  @ApiResponse({ status: 200, description: 'Donations retrieved successfully' })
  findAll() {
    return this.donationsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get donation statistics' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.donationsService.getDonationStats(start, end);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get donation by ID' })
  @ApiResponse({ status: 200, description: 'Donation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  findOne(@Param('id') id: string) {
    return this.donationsService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update donation' })
  @ApiResponse({ status: 200, description: 'Donation updated successfully' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationsService.update(+id, updateDonationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete donation' })
  @ApiResponse({ status: 200, description: 'Donation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  remove(@Param('id') id: string) {
    return this.donationsService.remove(+id);
  }
}
