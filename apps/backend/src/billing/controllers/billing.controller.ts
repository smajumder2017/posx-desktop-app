import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BillingService } from '../services/billing.service';
// import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateBillingDto } from '../dto/billing.dto';
import { Prisma } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtPayload } from 'src/auth/interfaces';
import { ApiService } from 'src/api/services/api.service';
import { LicenseService } from 'src/license/services/license.service';

@Controller('billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);
  constructor(
    private billingService: BillingService,
    private readonly apiService: ApiService,
    private readonly licenseService: LicenseService,
  ) {}

  // @ApiResponse({
  //   type: BillingResponseDto,
  //   status: 201,
  //   description: 'Create bill for an order',
  // })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() createBill: CreateBillingDto) {
    const newBill: Prisma.BillingUncheckedCreateInput = {
      ...createBill,
      isSetteled: false,
      roundoffDiff: 0,
      totalAmount: 0,
    };
    const existingBill = await this.billingService.findBillsByOrderId(
      createBill.orderId,
    );

    if (existingBill) {
      this.logger.log('found existing bill');
      existingBill.isActive = false;
      existingBill.isSynced = false;
      this.logger.log('marking existing bill inactive');
      await this.billingService.updateById(existingBill);
    }

    const totalAmount =
      newBill.amount + newBill.gst + newBill.serviceCharges - newBill.discount;
    const roundOffDiff = totalAmount - Math.floor(totalAmount);

    newBill.totalAmount = Math.floor(totalAmount);
    newBill.roundoffDiff = roundOffDiff;

    this.logger.log('creating new bill');
    return this.billingService.create(newBill);
  }

  // @ApiResponse({
  //   type: BillingResponseDto,
  //   status: 201,
  //   description: 'Get bill by order Id',
  // })
  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getBillByOrderId(@Param('orderId') orderId: string) {
    return this.billingService.findActiveBillByOrderId(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId/synced')
  async getSyncedBillsByOrderId(
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
    return this.apiService.getActiveBillByOrderId(orderId);
  }
}
