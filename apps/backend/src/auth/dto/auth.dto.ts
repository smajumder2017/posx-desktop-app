import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
// import { Roles } from 'src/enums';
// import { RestaurantResponseDto } from 'src/restaurants/dto/restaurants.dto';
// import { JwtPayload } from '../interfaces';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;
}

export class AccessTokenResponseDto {
  @ApiProperty()
  accessToken: string;
}

export class AccessTokenDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

// export class UserInfoResponseDto implements JwtPayload {
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   user_name: string;

//   @ApiProperty()
//   role: Roles;

//   @ApiProperty()
//   is_active: boolean;

//   @ApiProperty()
//   restaurant_id: string;

//   @ApiProperty({ type: RestaurantResponseDto })
//   @Optional()
//   restaurant?: RestaurantResponseDto;
// }
