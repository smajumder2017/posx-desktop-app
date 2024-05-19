import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtPayload } from 'src/auth/interfaces';
import { ApiService } from 'src/api/services/api.service';
import { LicenseService } from 'src/license/services/license.service';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly apiService: ApiService,
    private readonly licenseService: LicenseService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() customerDto: CreateCustomerDto,
    @Query('online') online: string,
  ) {
    const isOnline = online === 'true';
    if (isOnline) {
      return this.apiService.createCustomer(customerDto);
    }
    if (customerDto.dob) {
      customerDto.dob = new Date(customerDto.dob);
    }

    return this.customerService.create(customerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCustomerByContactNo(
    @GetUser() user: JwtPayload,
    @Query('contactNo') contactNo?: string,
    @Query('id') id?: string,
  ) {
    if (contactNo) {
      const localCustomer =
        await this.customerService.getCustomerByContactNo(contactNo);

      if (localCustomer) {
        return localCustomer;
      }
      const licenses = await this.licenseService.getActiveLicense();
      const shopLicense = licenses.find((license) => license.license.shopId);
      await this.apiService.getShopToken(user.id, shopLicense.license.number);
      const customerResponse =
        await this.apiService.getCustomerByNumber(contactNo);

      return customerResponse.data;
    }
    if (id) {
      const localCustomer = await this.customerService.getCustomerById(id);

      if (localCustomer) {
        return localCustomer;
      }
      const licenses = await this.licenseService.getActiveLicense();
      const shopLicense = licenses.find((license) => license.license.shopId);
      await this.apiService.getShopToken(user.id, shopLicense.license.number);
      const customerResponse =
        await this.apiService.getCustomerByNumber(contactNo);

      return customerResponse.data;
    }
  }
}
