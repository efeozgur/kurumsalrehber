import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Kullanıcı adı' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Şifre' })
  @IsString()
  @MinLength(3)
  password: string;
}

export class SetupDto {
  @ApiProperty({ description: 'Admin kullanıcı adı' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Admin şifre' })
  @IsString()
  @MinLength(3)
  password: string;
}

export class CreateUserDto {
  @ApiProperty({ description: 'Kullanıcı adı' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Şifre' })
  @IsString()
  @MinLength(3)
  password: string;

  @ApiProperty({ description: 'Rol (ADMIN veya SUPER_ADMIN)', required: false })
  @IsString()
  role?: string;
}
