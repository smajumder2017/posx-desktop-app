import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ShopService } from '../services/shop.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':shopId')
  getShopById(@Param('shopId') shopId: string) {
    return this.shopService.findShopById(shopId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('config/:shopId')
  async getShopConfig(@Param('shopId') shopId: string) {
    try {
      const shopConfig = await this.shopService.findShopConfig(shopId);
      return {
        ...shopConfig,
        config: JSON.parse(shopConfig.config),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
