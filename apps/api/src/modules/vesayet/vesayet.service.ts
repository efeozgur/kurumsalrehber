import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { CreateGoldAccountDto } from './dto/create-gold-account.dto';
import { UpdateGoldAccountDto } from './dto/update-gold-account.dto';

@Injectable()
export class VesayetService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  // ─── Ward ─────────────────────────────────────────────────

  async findAllWards() {
    return this.prisma.ward.findMany({
      include: { bankAccounts: true, goldAccounts: true },
      orderBy: { lastName: 'asc' },
    });
  }

  async findWard(id: number) {
    const ward = await this.prisma.ward.findUnique({
      where: { id },
      include: { bankAccounts: true, goldAccounts: true },
    });
    if (!ward) throw new NotFoundException('Kısıtlı bulunamadı');
    return ward;
  }

  async createWard(dto: CreateWardDto) {
    const { bankAccounts, goldAccounts, ...wardData } = dto;
    return this.prisma.ward.create({
      data: {
        ...wardData,
        bankAccounts: bankAccounts?.length
          ? { create: bankAccounts }
          : undefined,
        goldAccounts: goldAccounts?.length
          ? { create: goldAccounts }
          : undefined,
      },
      include: { bankAccounts: true, goldAccounts: true },
    });
  }

  async updateWard(id: number, dto: UpdateWardDto) {
    await this.findWard(id);
    const { bankAccounts, goldAccounts, ...wardData } = dto;
    return this.prisma.ward.update({
      where: { id },
      data: wardData,
      include: { bankAccounts: true, goldAccounts: true },
    });
  }

  async removeWard(id: number) {
    await this.findWard(id);
    return this.prisma.ward.delete({ where: { id } });
  }

  // ─── BankAccount ──────────────────────────────────────────

  async findAccountsByWard(wardId: number) {
    return this.prisma.bankAccount.findMany({
      where: { wardId },
      orderBy: { bankName: 'asc' },
    });
  }

  async createAccount(dto: CreateBankAccountDto) {
    return this.prisma.bankAccount.create({
      data: dto,
    });
  }

  async updateAccount(id: number, dto: UpdateBankAccountDto) {
    const account = await this.prisma.bankAccount.findUnique({ where: { id } });
    if (!account) throw new NotFoundException('Banka hesabı bulunamadı');
    return this.prisma.bankAccount.update({
      where: { id },
      data: dto,
    });
  }

  async removeAccount(id: number) {
    const account = await this.prisma.bankAccount.findUnique({ where: { id } });
    if (!account) throw new NotFoundException('Banka hesabı bulunamadı');
    return this.prisma.bankAccount.delete({ where: { id } });
  }

  // ─── GoldAccount ─────────────────────────────────────────

  async findGoldAccountsByWard(wardId: number) {
    return this.prisma.goldAccount.findMany({
      where: { wardId },
      orderBy: { bankName: 'asc' },
    });
  }

  async createGoldAccount(dto: CreateGoldAccountDto) {
    return this.prisma.goldAccount.create({
      data: dto,
    });
  }

  async updateGoldAccount(id: number, dto: UpdateGoldAccountDto) {
    const account = await this.prisma.goldAccount.findUnique({ where: { id } });
    if (!account) throw new NotFoundException('Altın hesabı bulunamadı');
    return this.prisma.goldAccount.update({
      where: { id },
      data: dto,
    });
  }

  async removeGoldAccount(id: number) {
    const account = await this.prisma.goldAccount.findUnique({ where: { id } });
    if (!account) throw new NotFoundException('Altın hesabı bulunamadı');
    return this.prisma.goldAccount.delete({ where: { id } });
  }

  // ─── Exchange Rates ──────────────────────────────────────

  async getExchangeRates() {
    try {
      const { data } = await firstValueFrom(
        this.http.get('https://open.er-api.com/v6/latest/TRY'),
      );
      // API returns rates per 1 TRY (e.g. 1 TRY = 0.0217 USD).
      // Invert to show how many TL per 1 foreign currency (e.g. 1 USD = 46.12 TL).
      const invert = (rate: number) => (rate ? parseFloat((1 / rate).toFixed(4)) : 0);
      return {
        USD: invert(data.rates.USD),
        EUR: invert(data.rates.EUR),
        GBP: invert(data.rates.GBP),
        CHF: invert(data.rates.CHF),
        updatedAt: data.time_last_update_utc,
      };
    } catch {
      return {
        USD: 46.12,
        EUR: 50.08,
        GBP: 58.64,
        CHF: 51.33,
        updatedAt: new Date().toISOString().split('T')[0],
      };
    }
  }

  // ─── Banks ────────────────────────────────────────────────

  async findAllBanks() {
    return this.prisma.bank.findMany({ orderBy: { id: 'asc' } });
  }

  async createBank(name: string) {
    return this.prisma.bank.create({ data: { name } });
  }

  async updateBank(id: number, name: string) {
    return this.prisma.bank.update({ where: { id }, data: { name } });
  }

  async removeBank(id: number) {
    return this.prisma.bank.delete({ where: { id } });
  }

  // ─── Reports ─────────────────────────────────────────────

  async getReportSummary() {
    const wards = await this.prisma.ward.findMany({
      include: { bankAccounts: true, goldAccounts: true },
    });

    const totalWards = wards.length;
    const activeWards = wards.filter(w => !w.isRemoved).length;
    const totalAccounts = wards.reduce((s, w) => s + w.bankAccounts.length, 0);

    const balanceByCurrency: Record<string, number> = {};
    const currencyBreakdown: Record<string, number> = {};
    const bankBreakdown: Record<string, { count: number; byCurrency: Record<string, number> }> = {};
    const accountCountByCurrency: Record<string, number> = {};

    let totalGoldAccounts = 0;
    let totalGoldGram = 0;
    const goldByType: Record<string, { gram: number; quantity: number }> = {};

    for (const w of wards) {
      for (const a of w.bankAccounts) {
        const cur = a.currency;
        balanceByCurrency[cur] = (balanceByCurrency[cur] || 0) + a.amount;
        currencyBreakdown[cur] = (currencyBreakdown[cur] || 0) + a.amount;
        accountCountByCurrency[cur] = (accountCountByCurrency[cur] || 0) + 1;

        if (!bankBreakdown[a.bankName]) bankBreakdown[a.bankName] = { count: 0, byCurrency: {} };
        bankBreakdown[a.bankName].count++;
        bankBreakdown[a.bankName].byCurrency[cur] = (bankBreakdown[a.bankName].byCurrency[cur] || 0) + a.amount;
      }

      for (const g of w.goldAccounts) {
        totalGoldAccounts++;
        totalGoldGram += g.gram * g.quantity;
        if (!goldByType[g.goldType]) goldByType[g.goldType] = { gram: 0, quantity: 0 };
        goldByType[g.goldType].gram += g.gram * g.quantity;
        goldByType[g.goldType].quantity += g.quantity;
      }
    }

    const averageByCurrency: Record<string, number> = {};
    for (const [cur, total] of Object.entries(balanceByCurrency)) {
      const count = accountCountByCurrency[cur] || 1;
      averageByCurrency[cur] = total / count;
    }

    const averageGoldGram = totalGoldAccounts > 0 ? totalGoldGram / totalGoldAccounts : 0;

    return {
      totalWards,
      activeWards,
      totalAccounts,
      balanceByCurrency,
      bankBreakdown,
      currencyBreakdown,
      averageByCurrency,
      totalGoldAccounts,
      totalGoldGram,
      averageGoldGram,
      goldByType,
    };
  }
}
