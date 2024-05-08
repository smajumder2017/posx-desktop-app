import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiService } from 'src/api/services/api.service';
import { PrismaService } from 'src/infra/database/services/prisma.service';
import { SyncMetaDataEvent } from '../events/syncMetaData';
import { Cron } from '@nestjs/schedule';
import { LicenseService } from 'src/license/services/license.service';
import { EventsService } from 'src/event.service';

@Injectable()
export class SyncService {
  constructor(
    private readonly apiService: ApiService,
    private readonly prismaService: PrismaService,
    private readonly licenseService: LicenseService,
    private readonly eventService: EventsService,
  ) {}

  @Cron('30 * * * *')
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
        const token = await this.apiService.getShopToken(
          user.id,
          licenseRes.license.number,
        );
        syncEvent.shopId = licenseRes.license.shopId;
        syncEvent.licenseNumber = licenseRes.license.number;
        syncEvent.token = token.data.accessToken;
        this.eventService.emit('syncMetaData', syncEvent);
      }

      console.log('running sync...');
    } catch (error) {
      console.log('error', error);
    }
  }

  @OnEvent('syncMetaData')
  async sync(event: SyncMetaDataEvent) {
    const { shopId, token, licenseNumber } = event;
    try {
      this.eventService.emit('syncStatus', {
        message: 'Sync initiated',
        status: 'INIT',
      });
      this.apiService.setToken(token);
      await this.syncRoles();
      this.eventService.emit('syncStatus', {
        message: 'Roles synced',
        status: 'PROGRESS',
      });
      console.log('role synced');
      await this.syncShopTypes();
      this.eventService.emit('syncStatus', {
        message: 'Shop types synced',
        status: 'PROGRESS',
      });
      console.log('shop type synced');
      await this.syncUsersByShopId(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Users synced',
        status: 'PROGRESS',
      });
      console.log('user synced');
      await this.syncUserRoles();
      this.eventService.emit('syncStatus', {
        message: 'User roles synced',
        status: 'PROGRESS',
      });
      console.log('user-role synced');
      await this.syncShopDetails(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Shop details synced',
        status: 'PROGRESS',
      });
      console.log('shop synced');
      await this.syncShopUsers(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Shop users synced',
        status: 'PROGRESS',
      });
      console.log('user-shop synced');
      await this.syncShopMenuCategory(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Shop menu category synced',
        status: 'PROGRESS',
      });
      console.log('menu-category synced');
      await this.syncShopMenuItem(shopId);
      this.eventService.emit('syncStatus', {
        message: 'Shop menu items synced',
        status: 'PROGRESS',
      });
      console.log('menu-item synced');
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
      console.log(error);
      this.eventService.emit('syncStatus', {
        message: 'Sync failed',
        status: 'ERROR',
      });
    }
  }

  private async syncRoles() {
    const roles = await this.prismaService.role.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = roles[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      const roleRes = await this.apiService.getRoles({
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = roleRes.data.hasNext;
      for (const role of roleRes.data.roles) {
        await this.prismaService.role.upsert({
          where: { id: role.id },
          create: role,
          update: role,
        });
      }
    }
  }

  private async syncShopTypes() {
    const shopTypes = await this.prismaService.shopType.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = shopTypes[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      const shopTypeRes = await this.apiService.getShopType({
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = shopTypeRes.data.hasNext;
      for (const role of shopTypeRes.data.shopTypes) {
        await this.prismaService.shopType.upsert({
          where: { id: role.id },
          create: role,
          update: role,
        });
      }
    }
  }

  private async syncUsersByShopId(shopId: string) {
    const users = await this.prismaService.user.findMany({
      orderBy: { updatedAt: 'asc' },
    });
    const lastSyncTime = users[0]?.updatedAt;
    let hasNext = true;
    const take = 100;
    let skip = 0;
    while (hasNext) {
      const userRes = await this.apiService.getUsersByShopId({
        shopId,
        skip,
        take,
        lastSyncTime,
      });
      skip = skip + take;
      hasNext = userRes.data.hasNext;
      for (const user of userRes.data.users) {
        await this.prismaService.user.upsert({
          where: { id: user.id },
          create: user,
          update: user,
        });
      }
    }
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
        await this.prismaService.menuItems.upsert({
          where: { id: item.id },
          create: item,
          update: item,
        });
      }
    }
  }
}
