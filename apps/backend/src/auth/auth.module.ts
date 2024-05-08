import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/services/user.service';
// import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
// import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '../infra/database/database.module';

@Module({
  imports: [
    PassportModule.register({}),
    JwtModule.register({}),
    DatabaseModule,
  ],
  providers: [UserService, JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
