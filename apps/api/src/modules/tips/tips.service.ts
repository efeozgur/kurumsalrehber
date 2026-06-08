import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tip.findMany({ orderBy: { order: 'asc' } });
  }

  create(text: string) {
    return this.prisma.tip.create({ data: { text } });
  }

  async remove(id: number) {
    await this.prisma.tip.delete({ where: { id } });
    return { message: 'İpucu silindi' };
  }
}
