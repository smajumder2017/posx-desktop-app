import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '@prisma/client';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto
  implements Omit<Payment, 'id' | 'paymentMode' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsUUID()
  billId: string;

  @ApiProperty()
  @IsNumber()
  amountRecieved: number;

  @ApiProperty()
  @IsString()
  paymentMode: string;
}
