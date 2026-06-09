import { IsString, IsInt, Min, Max, IsArray } from 'class-validator';

export class CreateMealPlanDto {
  @IsString()
  weekStart: string;

  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  soup: string;

  @IsArray()
  mainDishes: string[];

  @IsString()
  salad: string;
}
