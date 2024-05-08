import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/services/prisma.service';
import * as moment from 'moment';
import { AxiosResponse } from 'axios';
import { License } from '@prisma/client';
import { ApiService } from 'src/api/services/api.service';

@Injectable()
export class LicenseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly apiService: ApiService,
  ) {}

  async getActiveLicense() {
    const licenses = await this.prismaService.license.findMany();
    if (!licenses.length) {
      return [];
    }
    return licenses.map((license) => ({
      license,
      valid: moment(license.endDate).diff(moment(), 'day') >= 0,
    }));
  }

  async validateLicense(
    number: string,
    email?: string,
    password?: string,
  ): Promise<
    AxiosResponse<{ license: License; valid: boolean; accessToken?: string }>
  > {
    return this.apiService.validateLicense(number, email, password);
  }
}
