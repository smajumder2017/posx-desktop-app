import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { DatabaseModule } from '../infra/database/database.module';
import { SyncService } from './services/sync.service';
import { LicenseModule } from '../license/license.module';
import { AuthModule } from '../auth/auth.module';
import { EventsService } from '../event.service';

@Module({
  imports: [DatabaseModule, ApiModule, LicenseModule, AuthModule],
  providers: [SyncService, EventsService],
  exports: [SyncService],
})
export class SyncModule {}
