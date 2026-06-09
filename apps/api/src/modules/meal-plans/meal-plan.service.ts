import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MealPlanService {
  constructor(private prisma: PrismaService) {}

  async findByWeek(weekStart: string) {
    const meals = await this.prisma.mealPlan.findMany({
      where: { weekStart },
      orderBy: { dayOfWeek: 'asc' },
    });
    return meals.map((m) => ({
      ...m,
      mainDishes: JSON.parse(m.mainDishes),
    }));
  }

  async findToday(weekStart: string, dayOfWeek: number) {
    const meal = await this.prisma.mealPlan.findFirst({
      where: { weekStart, dayOfWeek },
    });
    if (!meal) return null;
    return { ...meal, mainDishes: JSON.parse(meal.mainDishes) };
  }

  async create(data: {
    weekStart: string;
    dayOfWeek: number;
    soup: string;
    mainDishes: string[];
    salad: string;
  }) {
    return this.prisma.mealPlan.create({
      data: {
        weekStart: data.weekStart,
        dayOfWeek: data.dayOfWeek,
        soup: data.soup,
        mainDishes: JSON.stringify(data.mainDishes),
        salad: data.salad,
      },
    });
  }

  async update(
    id: number,
    data: {
      weekStart?: string;
      dayOfWeek?: number;
      soup?: string;
      mainDishes?: string[];
      salad?: string;
    },
  ) {
    const existing = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Yemek kaydı bulunamadı');

    const updateData: any = {};
    if (data.weekStart) updateData.weekStart = data.weekStart;
    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
    if (data.soup !== undefined) updateData.soup = data.soup;
    if (data.mainDishes) updateData.mainDishes = JSON.stringify(data.mainDishes);
    if (data.salad !== undefined) updateData.salad = data.salad;

    return this.prisma.mealPlan.update({ where: { id }, data: updateData });
  }

  async remove(id: number) {
    const existing = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Yemek kaydı bulunamadı');
    await this.prisma.mealPlan.delete({ where: { id } });
    return { message: 'Yemek kaydı silindi' };
  }
}
