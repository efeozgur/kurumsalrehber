import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async logSearch(query: string | undefined, resultCount: number) {
    await this.prisma.searchLog.create({
      data: {
        query: query || null,
        resultCount,
        source: 'search',
      },
    });
  }

  async logView(contactId: number) {
    await this.prisma.searchLog.create({
      data: {
        contactId,
        resultCount: 1,
        source: 'view',
      },
    });
  }

  async logExport() {
    await this.prisma.searchLog.create({
      data: {
        resultCount: 0,
        source: 'export',
      },
    });
  }

  async getSummary() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [todaySearches, totalSearches, noResultSearches, allSearches] = await Promise.all([
      this.prisma.searchLog.count({
        where: { source: 'search', createdAt: { gte: todayStart } },
      }),
      this.prisma.searchLog.count({
        where: { source: 'search' },
      }),
      this.prisma.searchLog.count({
        where: { source: 'search', resultCount: 0 },
      }),
      this.prisma.searchLog.findMany({
        where: { source: 'search' },
        select: { resultCount: true },
      }),
    ]);

    const avgResultCount = totalSearches > 0
      ? allSearches.reduce((sum, l) => sum + l.resultCount, 0) / totalSearches
      : 0;

    const noResultRate = totalSearches > 0 ? (noResultSearches / totalSearches) * 100 : 0;

    return {
      todaySearches,
      totalSearches,
      noResultSearches,
      noResultRate: Math.round(noResultRate * 100) / 100,
      avgResultCount: Math.round(avgResultCount * 100) / 100,
    };
  }

  async getSearchTerms() {
    const logs = await this.prisma.searchLog.groupBy({
      by: ['query'],
      where: {
        source: 'search',
        query: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    return logs.map((l) => ({
      query: l.query,
      count: l._count.id,
    }));
  }

  async getTopContacts() {
    const logs = await this.prisma.searchLog.groupBy({
      by: ['contactId'],
      where: {
        source: 'view',
        contactId: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const contactIds = logs.map((l) => l.contactId).filter(Boolean) as number[];
    const contacts = contactIds.length > 0
      ? await this.prisma.contact.findMany({
          where: { id: { in: contactIds } },
          include: { department: true, title: true },
        })
      : [];

    const contactMap = new Map(contacts.map((c) => [c.id, c]));

    return logs.map((l) => ({
      contact: contactMap.get(l.contactId!) || null,
      count: l._count.id,
    }));
  }

  async getUsageHourly() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const logs = await this.prisma.searchLog.findMany({
      where: {
        source: 'search',
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    });

    const hourly: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourly[i] = 0;

    for (const log of logs) {
      const hour = log.createdAt.getHours();
      hourly[hour] = (hourly[hour] || 0) + 1;
    }

    return Object.entries(hourly).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    }));
  }

  async getUsageDaily() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const logs = await this.prisma.searchLog.findMany({
      where: {
        source: 'search',
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
    });

    const daily: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      daily[d.toISOString().split('T')[0]] = 0;
    }

    for (const log of logs) {
      const key = log.createdAt.toISOString().split('T')[0];
      if (daily[key] !== undefined) {
        daily[key]++;
      }
    }

    return Object.entries(daily)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getNoResults() {
    const logs = await this.prisma.searchLog.findMany({
      where: {
        source: 'search',
        resultCount: 0,
        query: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { query: true, createdAt: true },
    });

    return logs.map((l) => ({
      query: l.query,
      createdAt: l.createdAt,
    }));
  }

  async getFavStats() {
    const contacts = await this.prisma.contact.findMany({
      where: { isFav: true },
      orderBy: { updatedAt: 'desc' },
      include: { department: true, title: true },
      take: 5,
    });

    return contacts.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      department: c.department?.name || null,
      title: c.title?.name || null,
      favoritedAt: c.updatedAt,
    }));
  }
}
