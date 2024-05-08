import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Request as RequestType } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
// import { JwtPayload } from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserById(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }

  private static extractJWT(req: any): string | null {
    if (req.cookies && 'access_token' in req.cookies) {
      return req.cookies.access_token;
    }
    return null;
  }
}
