import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const TURKISH_MAP: Record<string, string> = {
  'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
  'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c',
  'I': 'i',
};

function normalizeTurkish(text: string): string {
  let result = text.toLowerCase();
  for (const [tr, en] of Object.entries(TURKISH_MAP)) {
    result = result.replace(new RegExp(tr, 'g'), en);
  }
  return result;
}

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  private scoreContact(contact: any, query: string): number {
    const q = query.toLowerCase();
    let score = 0;
    const fields: [string, number][] = [
      [contact.firstName?.toLowerCase(), 10],
      [contact.lastName?.toLowerCase(), 10],
      [contact.sicilNo?.toLowerCase(), 5],
      [contact.phoneInternal?.toLowerCase(), 3],
      [contact.phoneMobile?.toLowerCase(), 3],
      [contact.email?.toLowerCase(), 3],
      [contact.title?.name?.toLowerCase(), 4],
      [contact.department?.name?.toLowerCase(), 4],
    ];
    for (const [val, weight] of fields) {
      if (val === q) score += weight * 3;
      else if (val?.includes(q)) score += weight;
    }
    return score;
  }

  async search(
    query?: string,
    departmentId?: number,
    titleId?: number,
    isFav?: boolean,
    page = 1,
    limit = 20,
  ) {
    const where: any = {};

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (titleId) {
      where.titleId = titleId;
    }

    if (isFav !== undefined) {
      where.isFav = isFav;
    }

    if (query && query.trim()) {
      const raw = query.trim();
      const normalized = normalizeTurkish(raw);
      const upper = raw.toLocaleUpperCase('tr-TR');
      const lower = raw.toLocaleLowerCase('tr-TR');

      const variants = [...new Set([raw, normalized, upper, lower])];

      where.OR = [];
      for (const field of ['firstName', 'lastName', 'sicilNo', 'phoneInternal', 'phoneMobile', 'email']) {
        for (const v of variants) {
          where.OR.push({ [field]: { contains: v } });
        }
      }
      for (const v of variants) {
        where.OR.push({ title: { name: { contains: v } } });
        where.OR.push({ department: { name: { contains: v } } });
      }
    }

    const [allContacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        include: { department: true, title: true },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      }),
      this.prisma.contact.count({ where }),
    ]);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      allContacts.sort((a, b) => this.scoreContact(b, q) - this.scoreContact(a, q));
    }

    const skip = (page - 1) * limit;
    const contacts = allContacts.slice(skip, skip + limit);

    return {
      data: contacts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: { department: true, title: true },
    });
    if (!contact) {
      throw new NotFoundException('Kişi bulunamadı');
    }
    return contact;
  }

  async create(data: {
    firstName: string;
    lastName: string;
    titleId?: number;
    phoneInternal?: string;
    phoneMobile?: string;
    email?: string;
    avatar?: string;
    departmentId?: number;
  }) {
    return this.prisma.contact.create({
      data,
      include: { department: true, title: true },
    });
  }

  async update(
    id: number,
    data: {
      firstName?: string;
      lastName?: string;
      titleId?: number;
      phoneInternal?: string;
      phoneMobile?: string;
      email?: string;
      avatar?: string;
      departmentId?: number;
    },
  ) {
    await this.findOne(id);
    return this.prisma.contact.update({
      where: { id },
      data,
      include: { department: true, title: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.contact.delete({ where: { id } });
    return { message: 'Kişi silindi' };
  }

  async importRows(rows: Record<string, any>[]) {
    let imported = 0;
    const errors: { row: number; reason: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      try {
        const firstName = row['Ad'] || row['ad'] || row['firstname'] || row['firstName'] || '';
        const lastName = row['Soyad'] || row['soyad'] || row['lastname'] || row['lastName'] || '';

        if (!firstName || !lastName) {
          errors.push({ row: rowNum, reason: 'Ad ve Soyad zorunludur' });
          continue;
        }

        const sicilNo = String(row['Sicil No'] || row['sicilNo'] || row['sicil_no'] || '') || undefined;
        const phoneInternal = String(row['Dahili'] || row['dahili'] || row['phoneInternal'] || '') || undefined;
        const phoneMobile = String(row['Cep'] || row['cep'] || row['phoneMobile'] || '') || undefined;
        const email = String(row['Email'] || row['email'] || '') || undefined;

        let departmentId: number | undefined;
        const deptName = row['Birim'] || row['birim'] || row['department'] || row['departmentName'] || '';
        if (deptName) {
          const dept = await this.prisma.department.upsert({
            where: { name: String(deptName) },
            update: {},
            create: { name: String(deptName) },
          });
          departmentId = dept.id;
        }

        let titleId: number | undefined;
        const titleName = row['Ünvan'] || row['unvan'] || row['title'] || row['titleName'] || '';
        if (titleName) {
          const title = await this.prisma.title.upsert({
            where: { name: String(titleName) },
            update: {},
            create: { name: String(titleName) },
          });
          titleId = title.id;
        }

        await this.prisma.contact.create({
          data: {
            firstName: String(firstName),
            lastName: String(lastName),
            sicilNo,
            phoneInternal,
            phoneMobile,
            email,
            departmentId,
            titleId,
          },
        });

        imported++;
      } catch (e: any) {
        errors.push({ row: rowNum, reason: e.message || 'Bilinmeyen hata' });
      }
    }

    return { total: rows.length, imported, errors };
  }

  async exportData(format: 'xlsx' | 'csv', departmentId?: number) {
    const where: any = {};
    if (departmentId) {
      where.departmentId = departmentId;
    }

    const contacts = await this.prisma.contact.findMany({
      where,
      include: { department: true, title: true },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    const rows = contacts.map((c) => ({
      'Ad': c.firstName,
      'Soyad': c.lastName,
      'Sicil No': c.sicilNo || '',
      'Ünvan': c.title?.name || '',
      'Birim': c.department?.name || '',
      'Dahili': c.phoneInternal || '',
      'Cep': c.phoneMobile || '',
      'Email': c.email || '',
    }));

    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(wb, ws, 'Kişiler');

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(ws);
      return { buffer: Buffer.from(csv, 'utf-8'), ext: 'csv', type: 'text/csv; charset=utf-8' };
    }

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return { buffer, ext: 'xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
  }

  async toggleFavorite(id: number) {
    const contact = await this.findOne(id);
    const updated = await this.prisma.contact.update({
      where: { id },
      data: { isFav: !contact.isFav },
      include: { department: true, title: true },
    });
    return updated;
  }

  async getFavorites(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { isFav: true };
    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        include: { department: true, title: true },
        skip,
        take: limit,
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      }),
      this.prisma.contact.count({ where }),
    ]);
    return {
      data: contacts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getStats() {
    const [contactCount, departmentCount, userCount] = await Promise.all([
      this.prisma.contact.count(),
      this.prisma.department.count(),
      this.prisma.user.count(),
    ]);

    const recentContacts = await this.prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { department: true, title: true },
    });

    const departments = await this.prisma.department.findMany({
      include: { _count: { select: { contacts: true } } },
      orderBy: { name: 'asc' },
    });

    const departmentDistribution = departments.map((d) => ({
      name: d.name,
      value: d._count.contacts,
    }));

    const titleDistribution = await this.prisma.title.findMany({
      include: { _count: { select: { contacts: true } } },
      orderBy: { name: 'asc' },
    });

    return {
      contactCount,
      departmentCount,
      userCount,
      recentContacts,
      departmentDistribution,
      titleDistribution: titleDistribution.map((t) => ({ name: t.name, value: t._count.contacts })),
    };
  }
}
