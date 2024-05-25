import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderItem } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

interface IOrder extends Order {}

interface IOrderItems extends OrderItem {}

export class CreateOrderItemDto
  implements
    Omit<
      IOrderItems,
      | 'id'
      | 'orderId'
      | 'isActive'
      |'isSynced'
      | 'createdAt'
      | 'updatedAt'
      | 'rejectionReason'
    >
{
  @ApiProperty()
  @IsUUID()
  itemId: string;

  @ApiProperty()
  @IsString()
  itemName: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto
  implements
    Omit<
      IOrder,
      | 'id'
      | 'orderNumber'
      | 'isClosed'
      | 'isSynced'
      | 'orderStatusId'
      | 'cancellationReason'
      | 'createdAt'
      | 'updatedAt'
    >
{
  @ApiProperty()
  @IsUUID()
  shopId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  employeeId: string;

  @ApiProperty({ required: true, type: () => [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderDto
  implements
    Omit<IOrder, 'orderNumber' | 'isSynced' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  shopId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  employeeId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cancellationReason: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isClosed: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  orderStatusId: number;
}

// export class CustomerResponseDto implements Customer {
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   contactNo: string;

//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   gender: string;

//   @ApiProperty()
//   dob: Date;

//   @ApiProperty()
//   isSynced: boolean;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;
// }

export class ICreateOrderItemsDto {
  @ApiProperty({ required: true, type: () => [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderItemDto
  implements Omit<IOrderItems, 'orderId' | 'isSynced' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  itemId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  itemName: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  rejectionReason: string;
}
