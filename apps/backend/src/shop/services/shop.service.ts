import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/services/prisma.service';

@Injectable()
export class ShopService {
  constructor(private readonly prismaService: PrismaService) {}

  findShopById(shopId: string) {
    return this.prismaService.shop.findUnique({
      where: { id: shopId },
      include: { shopType: true },
    });
  }
}
