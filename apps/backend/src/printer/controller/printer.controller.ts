import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { PrinterService } from '../services/printer.service';
import { PrintBillDto, PrintDto } from '../dto/printer.dto';

@Controller('printer')
export class PrinterController {
  constructor(private readonly pinterService: PrinterService) {}

  @Get('status')
  async checkPrinterConnectedStatus(
    @Query('type') type: string,
    @Query('value') value: string,
  ) {
    const connection =
      type === 'network' ? `tcp://${value}` : `printer:${value}`;
    console.log(connection);
    this.pinterService.setPrinter(connection);
    const status = await this.pinterService.getPrinterStatus();
    return { status };
  }

  @Get()
  getPrinters() {
    return this.pinterService.getConnectedPrinters();
  }

  @Post('print/ticket')
  async printTicket(@Body() printerDto: PrintDto) {
    this.pinterService.setPrinter(printerDto.interface);
    const isConnected = await this.pinterService.getPrinterStatus();
    if (!isConnected) {
      throw new BadGatewayException('Printer not connected');
    }

    return this.pinterService.printTicket({
      shopName: printerDto.shopName,
      orderNumber: printerDto.orderNumber,
      orderItems: printerDto.orderItems,
    });
  }

  @Post('print/bill')
  async printBill(@Body() printerDto: PrintBillDto) {
    this.pinterService.setPrinter(printerDto.interface);
    const isConnected = await this.pinterService.getPrinterStatus();
    if (!isConnected) {
      throw new BadGatewayException('Printer not connected');
    }

    return this.pinterService.printBill(printerDto);
  }
}
