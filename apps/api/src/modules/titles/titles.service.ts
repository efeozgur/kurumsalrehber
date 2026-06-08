import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TitlesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.title.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { contacts: true } } },
    });
  }

  async findOne(id: number) {
    const title = await this.prisma.title.findUnique({
      where: { id },
      include: { _count: { select: { contacts: true } } },
    });
    if (!title) throw new NotFoundException('Ünvan bulunamadı');
    return title;
  }

  async create(name: string) {
    return this.prisma.title.create({ data: { name } });
  }

  async update(id: number, name: string) {
    await this.findOne(id);
    return this.prisma.title.update({ where: { id }, data: { name } });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.contact.updateMany({ where: { titleId: id }, data: { titleId: null } });
    return this.prisma.title.delete({ where: { id } });
  }
}
