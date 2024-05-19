import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/services/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prismaService: PrismaService) {}

  getMenuByShopId(shopId: string) {
    return this.prismaService.menuCategory.findMany({
      where: { shopId },
      include: {
        menuItems: {
          where: { isActive: true },
        },
      },
    });
  }
}
