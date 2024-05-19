import { ApiProperty } from '@nestjs/swagger';
import { Billing } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateBillingDto
  implements
    Omit<
      Billing,
      | 'id'
      | 'isActive'
      | 'isSynced'
      | 'roundoffDiff'
      | 'isSetteled'
      | 'totalAmount'
      | 'paymentMode'
      | 'createdAt'
      | 'updatedAt'
    >
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsNumber()
  gst: number;

  @ApiProperty()
  @IsNumber()
  serviceCharges: number;
}
