import { Module } from '@nestjs/common';
import { BillingService } from './services/billing.service';
import { DatabaseModule } from '../infra/database/database.module';
import { BillingController } from './controllers/billing.controller';

@Module({
  imports: [DatabaseModule],
  providers: [BillingService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
