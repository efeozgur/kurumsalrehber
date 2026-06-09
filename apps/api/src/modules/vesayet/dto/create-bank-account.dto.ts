import { IsString, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty()
  @IsString()
  bankName: string;

  @ApiProperty()
  @IsString()
  iban: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: ['TL', 'EUR', 'USD'] })
  @IsString()
  currency: string;

  @ApiProperty({ enum: ['vadeli', 'vadesiz'] })
  @IsString()
  termType: string;

  @ApiProperty()
  @IsInt()
  wardId: number;
}
