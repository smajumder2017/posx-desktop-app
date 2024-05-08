import { Module } from '@nestjs/common';
import { ApiModule } from 'src/api/api.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { SyncService } from './services/sync.service';
import { LicenseModule } from 'src/license/license.module';
import { AuthModule } from 'src/auth/auth.module';
import { EventsService } from 'src/event.service';

@Module({
  imports: [DatabaseModule, ApiModule, LicenseModule, AuthModule],
  providers: [SyncService, EventsService],
  exports: [SyncService],
})
export class SyncModule {}
