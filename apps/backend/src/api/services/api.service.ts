import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  Customer,
  License,
  MenuCategory,
  MenuItems,
  Role,
  Shop,
  ShopType,
  User,
  UserRoles,
  UserShop,
  Order,
  Prisma,
  Payment,
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
    const tokenResponse = await lastValueFrom(
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
    this.setToken(tokenResponse.data.accessToken);
    return tokenResponse;
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
      }>(`user/${apiArgs.userId}/roles`, {
        params: {
          skip: apiArgs.skip,
          take: apiArgs.take,
          lastSyncTime: apiArgs.lastSyncTime,
        },
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }),
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

  async getCustomerByNumber(number: string) {
    return lastValueFrom(
      this.httpService.get<Customer>(`customer`, {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
        params: {
          contactNo: number,
        },
      }),
    );
  }

  async createCustomer(
    apiArgs: Prisma.CustomerCreateInput & Prisma.CustomerUpdateInput,
  ) {
    return lastValueFrom(
      this.httpService.post<Customer>(`customer`, apiArgs, {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }),
    );
  }

  async getOrderStatus(apiArgs: {
    lastSyncTime?: Date;
    skip: number;
    take: number;
  }) {
    return lastValueFrom(
      this.httpService.get(`order/order-status`, {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
        params: apiArgs,
      }),
    );
  }

  async createOrder(apiArgs: Order) {
    return lastValueFrom(
      this.httpService.post<Order>(`order`, apiArgs, {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }),
    );
  }

  async createPayment(apiArgs: Payment) {
    return lastValueFrom(
      this.httpService.post<Payment>(`payment`, apiArgs, {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }),
    );
  }

  async getSalesData(shopId: string) {
    try {
      const res = await lastValueFrom(
        this.httpService.get<any>(`dashboard/sales/${shopId}`, {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        }),
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
  async getAllOrder(apiArgs: {
    shopId: string;
    orderStatusId?: string;
    employeeId?: string;
    isClosed?: string;
    skip: string;
    take: string;
  }) {
    try {
      const response = await lastValueFrom(
        this.httpService.get<{ orders: any[]; count: number }>(`order`, {
          params: apiArgs,
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getOrderDetails(orderId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`order/${orderId}`, {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getActiveBillByOrderId(orderId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`billing/${orderId}`, {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async searchLocation(address: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`location`, {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
          params: {
            address,
          },
        }),
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
