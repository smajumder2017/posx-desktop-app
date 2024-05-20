import { Injectable } from '@nestjs/common';
import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  BreakLine,
} from 'node-thermal-printer';
import { IPrintBillPayload } from '../dto/printer.dto';

@Injectable()
export class PrinterService {
  private printer: ThermalPrinter;
  constructor() {}

  async getConnectedPrinters() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const printers = require('@thiagoelg/node-printer');
    return printers.getPrinters();
  }

  setPrinter(connection: string) {
    console.log(connection.includes('printer:'));

    this.printer = new ThermalPrinter({
      type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
      // interface: 'tcp://192.168.1.23', // Printer interface
      interface: connection,
      characterSet: CharacterSet.PC852_LATIN2, // Printer character set
      removeSpecialCharacters: false, // Removes special characters - default: false
      lineCharacter: '=', // Set character for lines - default: "-"
      breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
      options: {
        // Additional options
        timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
      },
      driver: connection.includes('printer:')
        ? require('@thiagoelg/node-printer')
        : undefined,
    });
  }

  async getPrinterStatus() {
    if (!this.printer) {
      throw new Error('Printer not set');
    }
    return this.printer.isPrinterConnected();
  }

  async printTicket(payload: {
    shopName: string;
    orderNumber: string;
    orderItems: { itemName: string; quantity: number }[];
  }) {
    this.printer.alignCenter();
    this.printer.setTextSize(1, 1);
    this.printer.println('KOT');
    this.printer.setTextSize(0, 0);
    this.printer.println(payload.shopName);
    this.printer.drawLine('=');
    this.printer.setTextSize(2, 2);
    this.printer.println('Order No: ' + payload.orderNumber);
    this.printer.setTextSize(0, 0);
    this.printer.println(new Date(Date.now()).toLocaleString());
    this.printer.drawLine('=');
    this.printer.tableCustom([
      { text: 'Items', bold: true },
      { text: 'Quantity', bold: true },
    ]);
    this.printer.drawLine('-');
    payload.orderItems.forEach((item) => {
      this.printer.table([item.itemName, item.quantity.toString()]);
    });
    this.printer.newLine();
    this.printer.cut();
    console.log(this.printer.getText());

    return this.printer.execute();
  }

  async printBill(payload: IPrintBillPayload) {
    this.printer.alignCenter();
    this.printer.setTextNormal();
    this.printer.tableCustom([
      { text: payload.shopName, bold: true, align: 'CENTER' },
    ]);
    this.printer.println(payload.shopAddress);
    this.printer.println(payload.shopContact);
    this.printer.drawLine('-');
    this.printer.println(`Customer: ${payload.customerName}`);
    this.printer.drawLine('-');
    this.printer.tableCustom([
      { text: `Date: ${new Date(Date.now()).toLocaleString()}` },
      // { text: 'Quantity', bold: true },
    ]);
    this.printer.tableCustom([
      { text: `Order Number: ${payload.orderNumber}`, bold: true },
      { text: `Order Id: ${payload.orderId}`, bold: true },
    ]);
    this.printer.tableCustom([{ text: `Cashier: ${payload.employeeName}` }]);
    this.printer.drawLine('-');
    this.printer.tableCustom([
      { text: 'Item', bold: true, width: 0.5 },
      { text: 'Qty.', bold: true, width: 0.1, align: 'CENTER' },
      { text: 'Price', bold: true, width: 0.2, align: 'RIGHT' },
      { text: 'Amount', bold: true, width: 0.2, align: 'CENTER' },
    ]);
    this.printer.drawLine('-');
    payload.orderItems.forEach((item) => {
      this.printer.tableCustom([
        { text: item.itemName, width: 0.5 },
        { text: item.quantity.toString(), width: 0.1, align: 'CENTER' },
        { text: (item.price || 0).toString(), width: 0.2, align: 'RIGHT' },
        {
          text: (item.quantity * (item.price || 0)).toString(),
          width: 0.2,
          align: 'RIGHT',
        },
      ]);
    });
    this.printer.drawLine('-');
    this.printer.tableCustom([
      { text: 'Total Qty:', align: 'RIGHT', width: 0.5 },
      {
        text: payload.totalQty.toString(),
        width: 0.1,
        align: 'CENTER',
      },
      { text: 'Sub Total', width: 0.2, align: 'RIGHT' },
      { text: payload.amount.toString(), width: 0.2, align: 'RIGHT' },
    ]);
    if (payload.gst) {
      this.printer.tableCustom([
        { text: 'GST', width: 0.5, align: 'RIGHT' },
        { text: payload.gst.percentage, width: 0.29, align: 'RIGHT' },
        { text: payload.gst.amount.toString(), width: 0.2, align: 'RIGHT' },
      ]);
    }
    this.printer.drawLine('-');
    this.printer.tableCustom([
      { text: 'Round off', width: 0.75, align: 'RIGHT' },
      { text: payload.roundOff.toString(), align: 'RIGHT', width: 0.25 },
    ]);
    this.printer.tableCustom([
      { text: 'Grand Total', bold: true, width: 0.75, align: 'RIGHT' },
      {
        text: payload.grandTotal.toString(),
        bold: true,
        width: 0.25,
        align: 'RIGHT',
      },
    ]);
    this.printer.drawLine('-');
    if (payload.gst?.gstNumber) {
      this.printer.println(`GSTIN: ${payload.gst.gstNumber}`);
    }
    this.printer.println('Thank you and Visit Again !');
    this.printer.newLine();
    this.printer.cut();
    console.log(this.printer.getText());

    return this.printer.execute();
  }
}
