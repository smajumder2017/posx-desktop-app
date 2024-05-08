import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ShopModule } from './shop/shop.module';
import { LicenseModule } from './license/license.module';
import { ApiModule } from './api/api.module';
import { SyncModule } from './sync/sync.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsService } from './event.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'frontend', 'dist'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    ShopModule,
    LicenseModule,
    ApiModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsService],
})
export class AppModule {}
