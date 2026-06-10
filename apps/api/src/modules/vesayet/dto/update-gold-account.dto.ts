import { PartialType } from '@nestjs/mapped-types';
import { CreateGoldAccountDto } from './create-gold-account.dto';

export class UpdateGoldAccountDto extends PartialType(CreateGoldAccountDto) {}
