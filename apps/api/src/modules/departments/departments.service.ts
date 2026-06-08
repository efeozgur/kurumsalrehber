import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { contacts: true } } },
    });
  }

  async findOne(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: { _count: { select: { contacts: true } } },
    });
    if (!department) {
      throw new NotFoundException('Birim bulunamadı');
    }
    return department;
  }

  async create(name: string) {
    const existing = await this.prisma.department.findUnique({
      where: { name },
    });
    if (existing) {
      throw new ConflictException('Bu birim adı zaten kayıtlı');
    }
    return this.prisma.department.create({ data: { name } });
  }

  async update(id: number, name: string) {
    await this.findOne(id);
    const existing = await this.prisma.department.findUnique({
      where: { name },
    });
    if (existing && existing.id !== id) {
      throw new ConflictException('Bu birim adı zaten kayıtlı');
    }
    return this.prisma.department.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    if (department._count.contacts > 0) {
      throw new ConflictException(
        'Bu birime bağlı kişiler var. Önce kişileri taşıyın veya silin.',
      );
    }
    await this.prisma.department.delete({ where: { id } });
    return { message: 'Birim silindi' };
  }
}
