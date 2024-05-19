import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { DatabaseModule } from '../infra/database/database.module';
import { OrderController } from './controller/order.controller';

@Module({
  imports: [DatabaseModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
