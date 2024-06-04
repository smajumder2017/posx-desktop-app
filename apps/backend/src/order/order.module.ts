import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { DatabaseModule } from '../infra/database/database.module';
import { OrderController } from './controller/order.controller';
import { ApiModule } from '../api/api.module';
import { LicenseModule } from '../license/license.module';

@Module({
  imports: [DatabaseModule, ApiModule, LicenseModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
