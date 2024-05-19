import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '@prisma/client';
import {
  IsDate,
  // IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

interface ICustomer extends Customer {}

export class CreateCustomerDto
  implements Omit<ICustomer, 'id' | 'isSynced' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  contactNo: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsDate()
  dob: Date;
}

export class CustomerResponseDto implements Customer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contactNo: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  isSynced: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
