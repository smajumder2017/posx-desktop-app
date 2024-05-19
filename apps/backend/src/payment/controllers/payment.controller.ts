import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { BillingService } from 'src/billing/services/billing.service';
import { CreatePaymentDto } from '../dto/payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderService } from 'src/order/services/order.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly billingService: BillingService,
    private readonly orderService: OrderService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const bill = await this.billingService.findBillById(
      createPaymentDto.billId,
    );
    if (!bill) {
      throw new BadRequestException('Bill not generated yet');
    }
    const order = await this.orderService.findOrderById(bill.orderId);
    if (order.isClosed) {
      throw new BadRequestException(
        'Cannot settel bill for a already closed order',
      );
    }
    const previousPayments = await this.paymentService.findPaymentsByBillId(
      createPaymentDto.billId,
    );
    let paidAmount = 0;
    if (previousPayments.length) {
      paidAmount = previousPayments.reduce((acc, curr) => {
        acc = acc + curr.amountRecieved;
        return acc;
      }, 0);
    }

    if (paidAmount + createPaymentDto.amountRecieved > bill.totalAmount) {
      throw new BadRequestException(
        'Paid amount cannot be greater than total amount',
      );
    }
    if (paidAmount + createPaymentDto.amountRecieved === bill.totalAmount) {
      await this.billingService.updateById({
        id: createPaymentDto.billId,
        isSetteled: true,
      });
      await this.orderService.updateOrder({
        id: bill.orderId,
        orderStatusId: 2,
        isClosed: true,
      });
    }
    return this.paymentService.create(createPaymentDto);
  }
}
