import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiService } from '../../api/services/api.service';
import { PrismaService } from '../../infra/database/services/prisma.service';
import { SyncMetaDataEvent } from '../events/syncMetaData';
import { Cron } from '@nestjs/schedule';
import { LicenseService } from '../../license/services/license.service';
import { EventsService } from '../../event.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(
    private readonly apiService: ApiService,
    private readonly prismaService: PrismaService,
    private readonly licenseService: LicenseService,
    private readonly eventService: EventsService,
  ) {}

  @Cron('0 */2 * * * *')
  async syncTask() {
    try {
      const activeLicenses = await this.licenseService.getActiveLicense();
      if (activeLicenses.length) {
        const licenseRes = activeLicenses[0];
        const syncEvent = new SyncMetaDataEvent();
        const user = await this.prismaService.user.findFirst({
          where: { userRoles: { some: { role: { value: 'OWNER' } } } },
          include: { userRoles: { include: { role: true } } },
        });
        if (user) {
          await this.apiService.getShopToken(
            user.id,
            licenseRes.license.number,
          );
          syncEvent.shopId = licenseRes.license.shopId;
          syncEvent.licenseNumber = licenseRes.license.number;
          this.eventService.emit('syncDownData', syncEvent);
          this.eventService.emit('syncUpData', syncEvent);
        }
      }
    } catch (error) {
      console.log(error);
      this.logger.error(error, error.stack);
    }
  }

  @OnEvent('syncDownData')
  async syncDown(event: SyncMetaDataEvent) {
    const { shopId, licenseNumber, token } = event;
    console.log(shopId);
    try {
      this.eventService.emit('syncStatus', {
        message: 'Sync initiated',
        status: 'INIT',
      });
      if (token) {
        this.apiService.setToken(token);
      }

      await this.syncRoles();
      this.eventService.emit('syncStatus', {
        message: 'Roles synced',
        status: 'PROGRESS',
      });

      await this.syncShopTypes();
      this.eventService.emit('syncStatus', {
        message: 'Shop types synced',
        status: 'PROGRESS',
      });
      await this.syncOrderStatus();
      this.eventService.emit('syncStatus', {
        message: 'Order Statuses synced',
        status: 'PROGRESS',
      });

      await this.syncUsersByShopId(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Users synced',
        status: 'PROGRESS',
      });

      await this.syncUserRoles();
      this.eventService.emit('syncStatus', {
        message: 'User roles synced',
        status: 'PROGRESS',
      });

      await this.syncShopDetails(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Shop details synced',
        status: 'PROGRESS',
      });

      await this.syncShopUsers(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Shop users synced',
        status: 'PROGRESS',
      });

      await this.syncShopMenuCategory(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Shop menu category synced',
        status: 'PROGRESS',
      });

      await this.syncShopMenuItem(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Shop menu items synced',
        status: 'PROGRESS',
      });

      if (licenseNumber) {
        this.eventService.emit('syncStatus', {
          message: 'Licenses synced',
          status: 'PROGRESS',
        });
        this.syncLicense(licenseNumber);
      }
      this.eventService.emit('syncStatus', {
        message: 'Sync completed',
        status: 'SUCCESS',
      });
    } catch (error) {
      console.log('Sync down error');

      this.eventService.emit('syncStatus', {
        message: 'Sync failed',
        status: 'ERROR',
      });
    }
  }

  @OnEvent('syncUpData')
  async syncUp() {
    try {
      await this.syncCustomers();
      await this.syncOrders();
      await this.syncPayments();
    } catch (error) {
      console.log('Sync up error', error.response.data);
      this.logger.error(error, error.stack);
    }
  }

  private async syncRoles() {
    this.logger.log('Sync Process: [SCHEMA: Role]: Starting sync');
    const roles = await this.prismaService.role.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = roles[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      this.logger.log('Sync Process: [SCHEMA: Role]: Checking for updates');
      const roleRes = await this.apiService.getRoles({
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = roleRes.data.hasNext;
      this.logger.log('Sync Process: [SCHEMA: Role]: Update found: ' + hasNext);
      for (const role of roleRes.data.roles) {
        await this.prismaService.role.upsert({
          where: { id: role.id },
          create: role,
          update: role,
        });
      }
    }
    this.logger.log('Sync Process: [SCHEMA: Role]: Sync Complete');
  }

  private async syncShopTypes() {
    this.logger.log('Sync Process: [SCHEMA: ShopType]: Starting sync');
    const shopTypes = await this.prismaService.shopType.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = shopTypes[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      this.logger.log('Sync Process: [SCHEMA: ShopType]: Checking for updates');
      const shopTypeRes = await this.apiService.getShopType({
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = shopTypeRes.data.hasNext;
      this.logger.log(
        'Sync Process: [SCHEMA: ShopType]: Update found: ' + hasNext,
      );
      for (const role of shopTypeRes.data.shopTypes) {
        await this.prismaService.shopType.upsert({
          where: { id: role.id },
          create: role,
          update: role,
        });
      }
    }
    this.logger.log('Sync Process: [SCHEMA: ShopType]: Sync Complete');
  }

  private async syncOrderStatus() {
    this.logger.log('Sync Process: [SCHEMA: OrderStatus]: Starting sync');
    const orderStatus = await this.prismaService.orderStatus.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = orderStatus[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      this.logger.log(
        'Sync Process: [SCHEMA: OrderStatus]: Checking for updates',
      );
      const orderStatusRes = await this.apiService.getOrderStatus({
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = orderStatusRes.data.hasNext;
      this.logger.log(
        'Sync Process: [SCHEMA: OrderStatus]: Update found: ' + hasNext,
      );
      for (const role of orderStatusRes.data.orderStatuses) {
        await this.prismaService.orderStatus.upsert({
          where: { id: role.id },
          create: role,
          update: role,
        });
      }
    }
    this.logger.log('Sync Process: [SCHEMA: OrderStatus]: Sync Complete');
  }

  private async syncUsersByShopId(shopId: string) {
    this.logger.log('Sync Process: [SCHEMA: User]: Starting sync');
    const users = await this.prismaService.user.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = users[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      this.logger.log('Sync Process: [SCHEMA: User]: Checking for updates');
      const userRes = await this.apiService.getUsersByShopId({
        shopId,
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = userRes.data.hasNext;
      this.logger.log('Sync Process: [SCHEMA: User]: Update found: ' + hasNext);
      for (const user of userRes.data.users) {
        await this.prismaService.user.upsert({
          where: { id: user.id },
          create: user,
          update: user,
        });
      }
    }
    this.logger.log('Sync Process: [SCHEMA: User]: Sync Complete');
  }

  private async syncUserRoles() {
    const users = await this.prismaService.user.findMany();
    for (const user of users) {
      const userRoles = await this.prismaService.userRoles.findMany({
        orderBy: { updatedAt: 'asc' },
      });
      const lastSyncTime = userRoles[0]?.updatedAt;
      let hasNext = true;
      const take = 100;
      let skip = 0;
      while (hasNext) {
        const userRoleRes = await this.apiService.getUserRoles({
          userId: user.id,
          skip,
          take,
          lastSyncTime,
        });
        skip = skip + take;
        hasNext = userRoleRes.data.hasNext;
        for (const userRole of userRoleRes.data.userRoles) {
          await this.prismaService.userRoles.upsert({
            where: { id: userRole.id },
            create: userRole,
            update: userRole,
          });
        }
      }
    }
  }

  private async syncShopDetails(shopId: string) {
    const shopDetails = await this.apiService.getShopDetails(shopId);
    await this.prismaService.shop.upsert({
      where: { id: shopDetails.data.id },
      create: shopDetails.data,
      update: shopDetails.data,
    });
  }

  private async syncShopUsers(shopId: string) {
    const userShops = await this.prismaService.userShop.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = userShops[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      const userShopRes = await this.apiService.getShopUsers({
        shopId,
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = userShopRes.data.hasNext;
      for (const userShop of userShopRes.data.userShops) {
        await this.prismaService.userShop.upsert({
          where: { id: userShop.id },
          create: userShop,
          update: userShop,
        });
      }
    }
  }

  private async syncLicense(number: string) {
    const licenseRes = await this.apiService.validateLicense(number);
    await this.prismaService.license.upsert({
      where: { id: licenseRes.data.license.id },
      create: licenseRes.data.license,
      update: licenseRes.data.license,
    });
  }

  private async syncShopMenuCategory(shopId: string) {
    const menuCategories = await this.prismaService.menuCategory.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = menuCategories[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      const menuCategoryRes = await this.apiService.getMenuCategoryByShopId({
        shopId,
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = menuCategoryRes.data.hasNext;
      for (const category of menuCategoryRes.data.menuCategories) {
        await this.prismaService.menuCategory.upsert({
          where: { id: category.id },
          create: category,
          update: category,
        });
      }
    }
  }

  private async syncShopMenuItem(shopId: string) {
    const menuItems = await this.prismaService.menuItems.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = menuItems[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      const menuItemRes = await this.apiService.getMenuItemsByShopId({
        shopId,
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = menuItemRes.data.hasNext;
      for (const item of menuItemRes.data.menuItems) {
        item.servingTime = item.servingTime
          ? JSON.stringify(item.servingTime)
          : '';
        await this.prismaService.menuItems.upsert({
          where: { id: item.id },
          create: item,
          update: item,
        });
      }
    }
  }

  private async syncCustomers() {
    const nonSyncedCustomers = await this.prismaService.customer.findMany({
      where: { isSynced: false },
    });

    const callArr = nonSyncedCustomers.map(async (customer) => {
      delete customer.isSynced;
      const cust = await this.apiService.createCustomer(customer);
      await this.prismaService.customer.update({
        data: { isSynced: true },
        where: { contactNo: customer.contactNo },
      });
      return cust;
    });

    return Promise.all(callArr);
  }

  private async syncOrders() {
    const nonSyncOrders = await this.prismaService.order.findMany({
      where: { isSynced: false, isClosed: true },
      include: { items: true, bills: true },
    });
    console.log(nonSyncOrders.length);
    const callArr = nonSyncOrders.map(async (order) => {
      delete order.isSynced;
      order.items.forEach((item) => delete item.isSynced);
      order.bills.forEach((item) => delete item.isSynced);
      console.log(order);
      const cust = await this.apiService.createOrder(order);
      await this.prismaService.order.update({
        data: { isSynced: true },
        where: { id: order.id },
      });
      await this.prismaService.orderItem.updateMany({
        data: { isSynced: true },
        where: { orderId: order.id },
      });
      await this.prismaService.billing.updateMany({
        data: { isSynced: true },
        where: { orderId: order.id },
      });
      return cust;
    });

    return Promise.all(callArr);
  }

  private async syncPayments() {
    const nonSyncPayments = await this.prismaService.payment.findMany({
      where: { isSynced: false, bill: { isSynced: true } },
      include: { bill: true },
    });

    const callArr = nonSyncPayments.map(async (payment) => {
      delete payment.isSynced;
      delete payment.bill;
      console.log(payment);
      const cust = await this.apiService.createPayment(payment);
      await this.prismaService.payment.update({
        data: { isSynced: true },
        where: { id: payment.id },
      });

      return cust;
    });

    return Promise.all(callArr);
  }
}
