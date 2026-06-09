import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MealPlanController } from './meal-plan.controller';
import { MealPlanService } from './meal-plan.service';

@Module({
  imports: [PrismaModule],
  controllers: [MealPlanController],
  providers: [MealPlanService],
})
export class MealPlanModule {}
