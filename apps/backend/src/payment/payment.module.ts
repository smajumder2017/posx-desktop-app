import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { DatabaseModule } from '../infra/database/database.module';
import { BillingModule } from '../billing/billing.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [DatabaseModule, BillingModule, OrderModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
