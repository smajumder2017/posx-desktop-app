import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { ApiModule } from 'src/api/api.module';
import { LicenseModule } from 'src/license/license.module';

@Module({
  imports: [DatabaseModule, ApiModule, LicenseModule],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
