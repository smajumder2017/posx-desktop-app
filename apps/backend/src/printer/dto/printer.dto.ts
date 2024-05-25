import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IGst {
  gstNumber: string;
  percentage: string;
  amount: number;
}

export class IDiscount {
  percentage: string;
  amount: number;
}

export interface IPrintBillPayload {
  shopName: string;
  shopAddress: string;
  shopContact: string;
  employeeName: string;
  customerName: string;
  orderNumber: string;
  orderId: string;
  serviceCharge?: number;
  gst?: IGst;
  date: string;
  discount?: IDiscount;
  containerCharge?: number;
  orderItems: OrderItems[];
  totalQty: number;
  grandTotal: number;
  amount: number;
  roundOff: number;
}

export class PrintBillDto implements IPrintBillPayload {
  @ApiProperty()
  @IsNotEmpty()
  interface: string;

  @ApiProperty()
  @IsNotEmpty()
  shopName: string;

  @ApiProperty()
  @IsNotEmpty()
  shopAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  shopContact: string;

  @ApiProperty()
  @IsNotEmpty()
  employeeName: string;

  @ApiProperty()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty()
  @IsNotEmpty()
  orderNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsOptional()
  serviceCharge?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => IGst)
  gst?: IGst;

  @ApiProperty()
  @IsOptional()
  @Type(() => IDiscount)
  discount?: IDiscount;

  @ApiProperty()
  @IsOptional()
  containerCharge?: number;

  @ApiProperty()
  @IsNotEmpty()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  grandTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  totalQty: number;

  @ApiProperty()
  @IsNotEmpty()
  roundOff: number;

  @ApiProperty({ required: true, type: () => [OrderItems] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItems)
  orderItems: OrderItems[];
}

export class PrintDto {
  @ApiProperty()
  @IsNotEmpty()
  interface: string;

  @ApiProperty()
  @IsNotEmpty()
  orderNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  shopName: string;

  @ApiProperty({ required: true, type: () => [OrderItems] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItems)
  orderItems: OrderItems[];
}

class OrderItems {
  itemName: string;
  quantity: number;
  price?: number;
}
