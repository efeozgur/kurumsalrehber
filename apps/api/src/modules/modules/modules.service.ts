import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.module.findMany({ orderBy: { id: 'asc' } });
  }

  findByKey(key: string) {
    return this.prisma.module.findUnique({ where: { key } });
  }

  update(id: number, data: { enabled: boolean }) {
    return this.prisma.module.update({ where: { id }, data });
  }
}
