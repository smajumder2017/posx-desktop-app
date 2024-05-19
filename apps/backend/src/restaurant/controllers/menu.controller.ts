import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':shopId')
  async getShopMenu(@Param('shopId') shopId: string) {
    const menu = await this.menuService.getMenuByShopId(shopId);
    return { menu };
  }
}
