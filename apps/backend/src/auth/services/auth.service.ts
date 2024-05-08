import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
    });
    return accessToken;
  }

  // async generateRefreshToken(payload: JwtPayload) {
  //   const refreshToken = this.jwtService.sign(payload, {
  //     secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
  //     expiresIn: this.configService.get<string>(
  //       'REFRESH_TOKEN_EXPIRATION_TIME',
  //     ),
  //   });
  //   return refreshToken;
  // }

  // async getNewAccessAndRefreshToken(payload: JwtPayload) {
  //   const refreshToken = await this.generateRefreshToken(payload);

  //   return {
  //     access_token: await this.generateAccessToken(payload),
  //     refresh_token: refreshToken,
  //   };
  // }
}
