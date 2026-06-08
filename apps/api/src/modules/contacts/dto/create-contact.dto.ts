import { IsString, IsOptional, IsInt, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ description: 'Ad' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ description: 'Soyad' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ description: 'Sicil No', required: false })
  @IsOptional()
  @IsString()
  sicilNo?: string;

  @ApiProperty({ description: 'Ünvan ID', required: false })
  @IsOptional()
  @IsInt()
  titleId?: number;

  @ApiProperty({ description: 'Dahili telefon', required: false })
  @IsOptional()
  @IsString()
  phoneInternal?: string;

  @ApiProperty({ description: 'Cep telefonu', required: false })
  @IsOptional()
  @IsString()
  phoneMobile?: string;

  @ApiProperty({ description: 'E-posta', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'Birim ID', required: false })
  @IsOptional()
  @IsInt()
  departmentId?: number;
}
