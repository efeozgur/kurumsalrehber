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

  async getTree() {
    const departments = await this.prisma.department.findMany({
      include: {
        _count: { select: { contacts: true } },
        children: { include: { _count: { select: { contacts: true } } } },
      },
      orderBy: { name: 'asc' },
    });

    const buildTree = (parentId: number | null): any[] => {
      return departments
        .filter((d) => d.parentId === parentId)
        .map((d) => ({
          id: d.id,
          name: d.name,
          parentId: d.parentId,
          contactCount: d._count.contacts,
          children: buildTree(d.id),
        }));
    };

    return buildTree(null);
  }

  async create(name: string, parentId?: number) {
    const existing = await this.prisma.department.findUnique({
      where: { name },
    });
    if (existing) {
      throw new ConflictException('Bu birim adı zaten kayıtlı');
    }
    if (parentId) {
      await this.findOne(parentId);
    }
    return this.prisma.department.create({ data: { name, parentId: parentId || null } });
  }

  async update(id: number, name: string, parentId?: number) {
    await this.findOne(id);
    const existing = await this.prisma.department.findUnique({
      where: { name },
    });
    if (existing && existing.id !== id) {
      throw new ConflictException('Bu birim adı zaten kayıtlı');
    }
    if (parentId) {
      await this.findOne(parentId);
    }
    return this.prisma.department.update({
      where: { id },
      data: { name, parentId: parentId || null },
    });
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    if (department._count.contacts > 0) {
      throw new ConflictException(
        'Bu birime bağlı kişiler var. Önce kişileri taşıyın veya silin.',
      );
    }
    const childCount = await this.prisma.department.count({ where: { parentId: id } });
    if (childCount > 0) {
      throw new ConflictException(
        'Bu birime bağlı alt birimler var. Önce alt birimleri taşıyın veya silin.',
      );
    }
    await this.prisma.department.delete({ where: { id } });
    return { message: 'Birim silindi' };
  }
}
