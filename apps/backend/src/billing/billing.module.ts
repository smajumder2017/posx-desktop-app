import { Module } from '@nestjs/common';
import { BillingService } from './services/billing.service';
import { DatabaseModule } from '../infra/database/database.module';
import { BillingController } from './controllers/billing.controller';
import { ApiModule } from '../api/api.module';
import { LicenseModule } from '../license/license.module';

@Module({
  imports: [DatabaseModule, ApiModule, LicenseModule],
  providers: [BillingService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
