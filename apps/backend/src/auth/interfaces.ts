// import { Roles } from 'src/enums';

export interface JwtPayload {
  id: string;
  userName: string;
  userRoles: any;
  isActive: boolean;
  // restaurantId: string;
}
