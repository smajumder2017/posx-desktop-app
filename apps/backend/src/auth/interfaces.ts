import { UserShop, UserRoles } from '@prisma/client';

export interface JwtPayload {
  id: string;
  userName: string;
  email: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  contactNo: string;
  userShops: UserShop[];
  userRoles: UserRoles[];
}
