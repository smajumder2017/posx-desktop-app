import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    // this.$on<string>('query', (event: Prisma.QueryEvent) => {
    //   console.log('Query: ' + event.query);
    //   console.log('Query: ' + event.params);
    //   console.log('Duration: ' + event.duration + 'ms');
    // });
    await this.$connect();
    this.logger.log('Connected to db');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from db');
  }
}
