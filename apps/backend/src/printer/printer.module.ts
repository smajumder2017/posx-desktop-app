import { Module } from '@nestjs/common';
import { PrinterService } from './services/printer.service';
import { PrinterController } from './controller/printer.controller';

@Module({
  providers: [PrinterService],
  controllers: [PrinterController],
})
export class PrinterModule {}
