import { Module } from '@nestjs/common';
import { ShopService } from './services/shop.service';
import { DatabaseModule } from '../infra/database/database.module';
import { ShopController } from './controllers/shop.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
