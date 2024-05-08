import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  License,
  MenuCategory,
  MenuItems,
  Role,
  Shop,
  ShopType,
  User,
  UserRoles,
  UserShop,
} from '@prisma/client';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  private token: string;
  constructor(private readonly httpService: HttpService) {}

  setToken(token: string) {
    this.token = token;
  }

  async getShopToken(userId: string, license: string) {
    return lastValueFrom(
      this.httpService.post<{ accessToken: string }>(
        `shop/token`,
        { userId, license },
        {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        },
      ),
    );
  }

  async validateLicense(
    number: string,
    email?: string,
    password?: string,
  ): Promise<
    AxiosResponse<{ license: License; valid: boolean; accessToken?: string }>
  > {
    const licenseRes = await lastValueFrom(
      this.httpService.post<{
        license: License;
        valid: boolean;
        accessToken?: string;
      }>('license/validate', {
        number,
        email,
        password,
      }),
    );

    return licenseRes;
  }

  async getRoles(apiArgs: { lastSyncTime?: Date; skip: number; take: number }) {
    return lastValueFrom(
      this.httpService.get<{ roles: Role[]; count: number; hasNext: boolean }>(
        `role?skip=${apiArgs.skip}&take=${apiArgs.take}${
          apiArgs.lastSyncTime ? `&lastSyncTime=${apiArgs.lastSyncTime}` : ''
        }`,
        {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        },
      ),
    );
  }

  async getShopUsers(apiArgs: {
    shopId: string;
    lastSyncTime?: Date;
    skip: number;
    take: number;
  }) {
    return lastValueFrom(
      this.httpService.get<{
        userShops: UserShop[];
        count: number;
        hasNext: boolean;
      }>(
        `shop/${apiArgs.shopId}/users?skip=${apiArgs.skip}&take=${
          apiArgs.take
        }${
          apiArgs.lastSyncTime ? `&lastSyncTime=${apiArgs.lastSyncTime}` : ''
        }`,
        {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        },
      ),
    );
  }

  async getUsersByShopId(apiArgs: {
    shopId: string;
    lastSyncTime?: Date;
    skip: number;
    take: number;
  }) {
    return lastValueFrom(
      this.httpService.get<{
        users: User[];
        count: number;
        hasNext: boolean;
      }>(
        `user/shop/${apiArgs.shopId}?skip=${apiArgs.skip}&take=${apiArgs.take}${
          apiArgs.lastSyncTime ? `&lastSyncTime=${apiArgs.lastSyncTime}` : ''
        }`,
        {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        },
      ),
    );
  }

  async getUserRoles(apiArgs: {
    userId: string;
    lastSyncTime: Date;
    skip: number;
    take: number;
  }) {
    return lastValueFrom(
      this.httpService.get<{
        userRoles: UserRoles[];
        count: number;
        hasNext: boolean;
      }>(
        `user/${apiArgs.userId}/roles?skip=${apiArgs.skip}&take=${
          apiArgs.take
        }${
          apiArgs.lastSyncTime ? `&lastSyncTime=${apiArgs.lastSyncTime}` : ''
        }`,
        {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        },
      ),
    );
  }

  async getShopType(apiArgs: {
    lastSyncTime: Date;
    skip: number;
    take: number;
  }) {
    return lastValueFrom(
      this.httpService.get<{
        shopTypes: ShopType[];
        count: number;
        hasNext: boolean;
      }>(
        `shop/type?skip=${apiArgs.skip}&take=${apiArgs.take}${
          apiArgs.lastSyncTime ? `&lastSyncTime=${apiArgs.lastSyncTime}` : ''
        }`,
        {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        },
      ),
    );
  }

  async getShopDetails(shopId: string) {
    return lastValueFrom(
      this.httpService.get<Shop>(`shop/${shopId}`, {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }),
    );
  }

  async getMenuCategoryByShopId(apiArgs: {
    shopId: string;
    lastSyncTime?: Date;
    skip: number;
    take: number;
  }) {
    return lastValueFrom(
      this.httpService.get<{
        menuCategories: MenuCategory[];
        count: number;
        hasNext: boolean;
      }>(
        `menu/category/${apiArgs.shopId}?skip=${apiArgs.skip}&take=${
          apiArgs.take
        }${
          apiArgs.lastSyncTime ? `&lastSyncTime=${apiArgs.lastSyncTime}` : ''
        }`,
        {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        },
      ),
    );
  }

  async getMenuItemsByShopId(apiArgs: {
    shopId: string;
    lastSyncTime?: Date;
    skip: number;
    take: number;
  }) {
    return lastValueFrom(
      this.httpService.get<{
        menuItems: MenuItems[];
        count: number;
        hasNext: boolean;
      }>(
        `menu/item/${apiArgs.shopId}?skip=${apiArgs.skip}&take=${apiArgs.take}${
          apiArgs.lastSyncTime ? `&lastSyncTime=${apiArgs.lastSyncTime}` : ''
        }`,
        {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        },
      ),
    );
  }
}
