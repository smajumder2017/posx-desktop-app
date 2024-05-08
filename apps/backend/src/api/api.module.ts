import { Module } from '@nestjs/common';
import { ApiService } from './services/api.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: configService.get('BASE_URL'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
