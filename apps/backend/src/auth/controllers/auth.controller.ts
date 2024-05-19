import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  // Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/services/user.service';
import { LoginDto, LoginResponseDto } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '../interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    // @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByUserName(loginDto.userName);
    if (!user) {
      throw new BadRequestException('User doesnt exists');
    }
    const validPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!validPassword) {
      throw new BadRequestException('Password Mismached');
    }
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      isActive: user.isActive,
      userShops: user.userShops,
      userRoles: user.userRoles,
      contactNo: user.contactNo,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const accessToken = await this.authService.generateAccessToken(payload);
    // const refreshToken = await this.authService.generateRefreshToken(payload);

    // response.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   path: '/',
    // });

    return {
      accessToken,
    };
  }
}
