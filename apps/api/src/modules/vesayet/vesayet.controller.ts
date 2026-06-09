import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VesayetService } from './vesayet.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { ModuleAccess } from '../../common/decorators/module-access.decorator';
import { ModuleGuard } from '../../common/guards/module.guard';

@ApiTags('Vesayet')
@ApiBearerAuth()
@Controller('api/admin/vesayet')
@ModuleAccess('vesayet')
@UseGuards(ModuleGuard)
export class VesayetController {
  constructor(private vesayetService: VesayetService) {}

  // ─── Ward ─────────────────────────────────────────────────

  @Get('wards')
  findAllWards() {
    return this.vesayetService.findAllWards();
  }

  @Get('wards/:id')
  findWard(@Param('id') id: string) {
    return this.vesayetService.findWard(+id);
  }

  @Post('wards')
  createWard(@Body() dto: CreateWardDto) {
    return this.vesayetService.createWard(dto);
  }

  @Put('wards/:id')
  updateWard(@Param('id') id: string, @Body() dto: UpdateWardDto) {
    return this.vesayetService.updateWard(+id, dto);
  }

  @Roles('SUPER_ADMIN')
  @Delete('wards/:id')
  removeWard(@Param('id') id: string) {
    return this.vesayetService.removeWard(+id);
  }

  // ─── BankAccount ──────────────────────────────────────────

  @Get('wards/:wardId/accounts')
  findAccounts(@Param('wardId') wardId: string) {
    return this.vesayetService.findAccountsByWard(+wardId);
  }

  @Post('accounts')
  createAccount(@Body() dto: CreateBankAccountDto) {
    return this.vesayetService.createAccount(dto);
  }

  @Put('accounts/:id')
  updateAccount(@Param('id') id: string, @Body() dto: UpdateBankAccountDto) {
    return this.vesayetService.updateAccount(+id, dto);
  }

  @Roles('SUPER_ADMIN')
  @Delete('accounts/:id')
  removeAccount(@Param('id') id: string) {
    return this.vesayetService.removeAccount(+id);
  }

  // ─── Banks ────────────────────────────────────────────────

  @Get('banks')
  findAllBanks() {
    return this.vesayetService.findAllBanks();
  }

  @Post('banks')
  createBank(@Body('name') name: string) {
    return this.vesayetService.createBank(name);
  }

  @Put('banks/:id')
  updateBank(@Param('id') id: string, @Body('name') name: string) {
    return this.vesayetService.updateBank(+id, name);
  }

  @Roles('SUPER_ADMIN')
  @Delete('banks/:id')
  removeBank(@Param('id') id: string) {
    return this.vesayetService.removeBank(+id);
  }

  // ─── Exchange Rates ──────────────────────────────────────

  @Get('exchange-rates')
  getExchangeRates() {
    return this.vesayetService.getExchangeRates();
  }

  // ─── Reports ─────────────────────────────────────────────

  @Get('reports/summary')
  getReportSummary() {
    return this.vesayetService.getReportSummary();
  }
}
