import { Module } from '@nestjs/common';
import { LocationController } from './controllers/location.controller';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [ApiModule],
  controllers: [LocationController],
})
export class LocationModule {}
