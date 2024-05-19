export interface ILoginRequest {
  userName: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
}

export interface IUserInfoResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  contactNo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userRoles?: UserRolesEntity[] | null;
  userShops?: UserShopsEntity[] | null;
}
export interface UserRolesEntity {
  id: string;
  userId: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  role: Role;
}
export interface Role {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}
export interface UserShopsEntity {
  id: string;
  userId: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  shop: Shop;
}
export interface Shop {
  id: string;
  shopName: string;
  shopCode: string;
  shopTypeId: number;
  registrationNo: string;
  isActive: boolean;
  contactNo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}
