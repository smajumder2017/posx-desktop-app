import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class BillingService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createBill: Prisma.BillingUncheckedCreateInput) {
    return this.prismaService.billing.create({ data: createBill });
  }

  findBillById(id: string) {
    return this.prismaService.billing.findUnique({
      where: { id, isActive: true },
    });
  }

  findBillsByOrderId(orderId: string) {
    return this.prismaService.billing.findFirst({
      where: { orderId, isActive: true },
    });
  }

  findActiveBillByOrderId(orderId: string) {
    return this.prismaService.billing.findFirst({
      where: { orderId, isActive: true },
      include: { customer: true, payments: true, employee: true, shop: true },
    });
  }

  updateById(updateBill: Prisma.BillingUncheckedUpdateInput) {
    return this.prismaService.billing.update({
      data: updateBill,
      where: { id: updateBill.id.toString() },
    });
  }
}
