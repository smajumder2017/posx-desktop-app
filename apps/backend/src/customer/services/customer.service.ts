import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/database/services/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  create(customer: Prisma.CustomerCreateInput) {
    return this.prismaService.customer.create({ data: customer });
  }

  getCustomerByContactNo(number: string) {
    return this.prismaService.customer.findUnique({
      where: { contactNo: number },
    });
  }

  getCustomerById(id: string) {
    return this.prismaService.customer.findUnique({
      where: { id },
    });
  }
}
