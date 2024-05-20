import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/database/services/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  create(payment: Prisma.PaymentUncheckedCreateInput) {
    return this.prismaService.payment.create({ data: payment });
  }

  findPaymentsByBillId(billId: string) {
    return this.prismaService.payment.findMany({ where: { billId } });
  }
}
