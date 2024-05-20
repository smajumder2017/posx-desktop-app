import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { DatabaseModule } from '../infra/database/database.module';
import { ApiModule } from '../api/api.module';
import { LicenseModule } from '../license/license.module';

@Module({
  imports: [DatabaseModule, ApiModule, LicenseModule],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
