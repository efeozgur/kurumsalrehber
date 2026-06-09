import { IsString, IsIn } from 'class-validator';

export class CreateFoodItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(['soup', 'main', 'salad'])
  category: string;
}
