import { Controller, Get, Param, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './infra/database/services/prisma.service';
import { EventsService } from './event.service';
import { map } from 'rxjs';
import { ApiService } from './api/services/api.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
    private readonly eventService: EventsService,
    private readonly apiService: ApiService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const shops = await this.prismaService.shop.findMany();
    console.log(shops);
    return this.appService.getHello();
  }

  @Sse('syncStatusEvent')
  syncStatus() {
    return this.eventService.subscribe('syncStatus').pipe(
      map((data) => {
        console.log(data);
        return { data };
      }),
    );
  }

  @Sse('online')
  getOnlineStatus() {
    return this.eventService.subscribe('onlineStatus').pipe(
      map((data) => {
        console.log(data);
        return { data };
      }),
    );
  }

  @Get('dashboard/sales/:shopId')
  getSales(@Param('shopId') shopId: string) {
    return this.apiService.getSalesData(shopId);
  }
}
