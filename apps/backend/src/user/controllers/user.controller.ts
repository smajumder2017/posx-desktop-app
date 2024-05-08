import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @ApiResponse({
  //   status: 200,
  //   description: 'The found record',
  //   type: UserInfoResponseDto,
  // })
  // @ApiSecurity('bearer')
  // @ApiBearerAuth()
  // for api documentation
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(@GetUser() user: User) {
    const userInfo = await this.userService.getUserById(user.id);
    delete userInfo.password;
    return userInfo;
  }
}
