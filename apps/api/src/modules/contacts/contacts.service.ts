import {
  Injectable,
  NotFoundException,
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

  async search(
    query?: string,
    departmentId?: number,
    titleId?: number,
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
      }
    }

    const skip = (page - 1) * limit;

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

    return {
      contactCount,
      departmentCount,
      userCount,
      recentContacts,
    };
  }
}
