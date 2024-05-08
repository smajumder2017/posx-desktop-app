import { Module } from '@nestjs/common';
import { LicenseService } from './services/license.service';
import { DatabaseModule } from '../infra/database/database.module';
import { LicenseController } from './controllers/license.controller';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [DatabaseModule, ApiModule],
  providers: [LicenseService],
  controllers: [LicenseController],
  exports: [LicenseService],
})
export class LicenseModule {}
