import { Module } from '@nestjs/common';
import { MenuService } from './services/menu.service';
import { DatabaseModule } from './../infra/database/database.module';
import { MenuController } from './controllers/menu.controller';

@Module({
  imports: [DatabaseModule],
  providers: [MenuService],
  controllers: [MenuController],
})
export class RestaurantModule {}
