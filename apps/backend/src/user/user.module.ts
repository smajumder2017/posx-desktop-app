import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { DatabaseModule } from '../infra/database/database.module';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
