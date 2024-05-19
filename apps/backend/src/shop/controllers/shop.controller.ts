import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ShopService } from '../services/shop.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':shopId')
  getShopById(@Param('shopId') shopId: string) {
    return this.shopService.findShopById(shopId);
  }
}
