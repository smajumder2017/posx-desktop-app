import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CreateOrderDto,
  ICreateOrderItemsDto,
  UpdateOrderDto,
  UpdateOrderItemDto,
} from '../dto/order.dto';
import { OrderService } from '../services/order.service';
import { Prisma } from '@prisma/client';
import { ApiResponse } from '@nestjs/swagger';
import { ApiService } from '../../api/services/api.service';
import { GetUser } from '../../auth/decorators/user.decorator';
import { JwtPayload } from '../../auth/interfaces';
import { LicenseService } from '../../license/services/license.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly apiService: ApiService,
    private readonly licenseService: LicenseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const { id, orderNumber } =
      await this.orderService.generateOrderNumberAndID();
    const orderItems: Prisma.OrderItemCreateNestedManyWithoutOrderInput = {
      create: createOrderDto.items,
    };
    return this.orderService.create({
      id,
      orderNumber,
      ...createOrderDto,
      orderStatusId: 1,
      items: orderItems,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':orderId/items')
  async createOrderItems(
    @Param('orderId') orderId: string,
    @Body() createOrderItemsDto: ICreateOrderItemsDto,
  ) {
    const order = await this.orderService.findOrderById(orderId);
    if (!order) {
      throw new BadRequestException('Order does not exist');
    }
    const existingItems = order.items;
    const updatableItems: Prisma.OrderItemUncheckedUpdateManyInput[] = [];
    const newItems: Prisma.OrderItemCreateManyInput[] = [];
    createOrderItemsDto.items.forEach((item) => {
      const sameItem = existingItems.find(
        (oldItem) => oldItem.itemId === item.itemId,
      );
      if (sameItem) {
        updatableItems.push({
          id: sameItem.id,
          orderId,
          quantity: item.quantity + sameItem.quantity,
        });
      } else {
        newItems.push({ ...item, orderId });
      }
    });
    await this.orderService.createOrderItems(newItems, updatableItems);
    return this.getOrderById(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(
    @Query('shopId') shopId: string,
    @Query('orderStatusId') orderStatusId?: string,
    @Query('isClosed') isClosed?: string,
    @Query('employeeId') employeeId?: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '100',
  ) {
    const whereOptions: Prisma.OrderWhereInput = { shopId };
    if (orderStatusId) {
      whereOptions.orderStatusId = parseInt(orderStatusId);
    }
    if (isClosed) {
      whereOptions.isClosed = isClosed === 'true';
    }
    if (employeeId) {
      whereOptions.employeeId = employeeId;
    }
    const count = await this.orderService.getOrderCount({
      where: whereOptions,
    });
    const orders = await this.orderService.searchOrders({
      where: whereOptions,
      include: { orderStatus: true, employee: true, customer: true },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      orders,
      count,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/synced')
  async getSyncedOrders(
    @GetUser() user: JwtPayload,
    @Query('shopId') shopId: string,
    @Query('orderStatusId') orderStatusId?: string,
    @Query('isClosed') isClosed?: string,
    @Query('employeeId') employeeId?: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '100',
  ) {
    const licenses = await this.licenseService.getActiveLicense();
    const shopLicense = licenses.find((license) => license.license.shopId);
    const response = await this.apiService.getShopToken(
      user.id,
      shopLicense.license.number,
    );
    this.apiService.setToken(response.data.accessToken);
    return this.apiService.getAllOrder({
      shopId,
      orderStatusId,
      isClosed,
      employeeId,
      skip,
      take,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.findOrderById(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId/synced')
  async getSyncedOrderById(
    @Param('orderId') orderId: string,
    @GetUser() user: JwtPayload,
  ) {
    const licenses = await this.licenseService.getActiveLicense();
    const shopLicense = licenses.find((license) => license.license.shopId);
    const response = await this.apiService.getShopToken(
      user.id,
      shopLicense.license.number,
    );
    this.apiService.setToken(response.data.accessToken);
    return this.apiService.getOrderDetails(orderId);
  }

  @ApiResponse({
    status: 200,
    description: 'Update order by order id',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put()
  async cancelOrderById(@Body() updateOder: UpdateOrderDto) {
    await this.orderService.updateOrder(updateOder);
    return;
  }

  @ApiResponse({
    status: 200,
    description: 'Update order by order id',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('item')
  async updateOrderItem(@Body() updateOderItem: UpdateOrderItemDto) {
    await this.orderService.updateOrderItem(updateOderItem);
    return;
  }
}
