import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiService } from 'src/api/services/api.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('location')
export class LocationController {
  constructor(private readonly apiService: ApiService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  searchLocation(@Query('address') address: string) {
    console.log(address);
    return this.apiService.searchLocation(address);
  }
}
