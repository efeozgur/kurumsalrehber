import { IsString, IsBoolean, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
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
}

export class CreateWardDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  tcKimlikNo: string;

  @ApiProperty()
  @IsString()
  dosyaNo: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isRemoved?: boolean;

  @ApiProperty({ type: [CreateBankAccountDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBankAccountDto)
  bankAccounts?: CreateBankAccountDto[];
}
