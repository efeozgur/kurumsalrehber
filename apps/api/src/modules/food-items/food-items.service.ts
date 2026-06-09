import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FoodItemsService {
  constructor(private prisma: PrismaService) {}

  findAll(category?: string) {
    const where = category ? { category } : {};
    return this.prisma.foodItem.findMany({ where, orderBy: { name: 'asc' } });
  }

  create(name: string, category: string) {
    return this.prisma.foodItem.create({ data: { name, category } });
  }

  async remove(id: number) {
    await this.prisma.foodItem.delete({ where: { id } });
    return { message: 'Yemek silindi' };
  }
}
