import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { LicenseService } from '../services/license.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SyncMetaDataEvent } from 'src/sync/events/syncMetaData';

@Controller('license')
export class LicenseController {
  constructor(
    private readonly licenseService: LicenseService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  getActiveLicenses() {
    return this.licenseService.getActiveLicense();
  }

  @Post('validate')
  async validateLicense(
    @Body() license: { number: string; email?: string; password?: string },
  ) {
    try {
      const licenseRes = await this.licenseService.validateLicense(
        license.number,
        license.email,
        license.password,
      );
      const syncEvent = new SyncMetaDataEvent();
      syncEvent.shopId = licenseRes.data.license.shopId;
      syncEvent.token = licenseRes.data.accessToken;
      syncEvent.licenseNumber = license.number;
      this.eventEmitter.emit('syncDownData', syncEvent);

      // this.syncService.sync(
      //   licenseRes.data.license.shopId,
      //   licenseRes.data.accessToken,
      //   license.number,
      // );
      return licenseRes.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
