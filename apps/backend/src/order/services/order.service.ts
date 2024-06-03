import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/database/services/prisma.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const orderId = require('order-id');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
// import * as moment from 'moment';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateOrderNumberAndID() {
    const res: [{ count: number }] = await this.prismaService.$queryRaw(
      Prisma.sql`SELECT count (*) as count from "Order" o where cast(o.createdAt  AS  integer) > ${
        moment(moment().format('YYYY-MM-DD')).unix() * 1000
      } and cast(o.createdAt as integer) <= ${
        moment(moment().add('1', 'd').format('YYYY-MM-DD')).unix() * 1000
      }`,
    );

    const count = Number(res[0].count) || 0;
    return {
      id: orderId('key').generate(),
      orderNumber: (count + 1).toString(),
    };
  }

  create(order: Omit<Prisma.OrderUncheckedCreateInput, 'orderStatuses'>) {
    return this.prismaService.order.create({
      data: { ...order },
      include: { items: true, orderStatus: true },
    });
  }

  findOrderById(orderId: string) {
    return this.prismaService.order.findUnique({
      where: { id: orderId },
      include: { items: { where: { rejectionReason: null } }, customer: true },
    });
  }

  searchOrders(searchOptions: Prisma.OrderFindManyArgs) {
    return this.prismaService.order.findMany(searchOptions);
  }

  getOrderCount(countOptions: Prisma.OrderCountArgs) {
    return this.prismaService.order.count(countOptions);
  }

  updateOrder(order: Prisma.OrderUncheckedUpdateInput) {
    return this.prismaService.order.update({
      data: order,
      where: { id: order.id.toString() },
    });
  }

  createOrderItems(
    orderItems: Prisma.OrderItemCreateManyInput[],
    updateItems: Prisma.OrderItemUncheckedUpdateManyInput[] = [],
  ) {
    return this.prismaService.$transaction(async (txn) => {
      await txn.orderItem.createMany({ data: orderItems });
      if (updateItems.length) {
        const updatePromise = updateItems.map((item) => {
          return txn.orderItem.update({
            data: item,
            where: { id: item.id.toString() },
          });
        });
        await Promise.all(updatePromise);
      }
    });
  }

  updateOrderItem(orderItem: Prisma.OrderItemUpdateInput) {
    return this.prismaService.orderItem.update({
      data: orderItem,
      where: { id: orderItem.id.toString() },
    });
  }
}
