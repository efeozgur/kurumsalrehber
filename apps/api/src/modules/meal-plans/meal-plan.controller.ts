import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MealPlanService } from './meal-plan.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('MealPlans')
@Controller()
export class MealPlanController {
  constructor(private mealPlanService: MealPlanService) {}

  @Public()
  @Get('api/meal-plans')
  findByWeek(@Query('week') week?: string) {
    const weekStart = week || getWeekStart(new Date());
    return this.mealPlanService.findByWeek(weekStart);
  }

  @Public()
  @Get('api/meal-plans/today')
  findToday() {
    const now = new Date();
    const weekStart = getWeekStart(now);
    const dayOfWeek = (now.getDay() + 6) % 7; // 0=Monday .. 6=Sunday
    return this.mealPlanService.findToday(weekStart, dayOfWeek);
  }

  @ApiBearerAuth()
  @Post('api/admin/meal-plans')
  create(@Body() dto: CreateMealPlanDto) {
    return this.mealPlanService.create({
      ...dto,
      mainDishes: dto.mainDishes,
    });
  }

  @ApiBearerAuth()
  @Put('api/admin/meal-plans/:id')
  update(@Param('id') id: string, @Body() dto: UpdateMealPlanDto) {
    return this.mealPlanService.update(+id, dto);
  }

  @ApiBearerAuth()
  @Delete('api/admin/meal-plans/:id')
  remove(@Param('id') id: string) {
    return this.mealPlanService.remove(+id);
  }
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}
