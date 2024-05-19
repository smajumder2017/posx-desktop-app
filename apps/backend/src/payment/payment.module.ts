import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { BillingModule } from 'src/billing/billing.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [DatabaseModule, BillingModule, OrderModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
