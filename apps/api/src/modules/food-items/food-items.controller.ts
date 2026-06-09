import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FoodItemsService } from './food-items.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('FoodItems')
@Controller()
export class FoodItemsController {
  constructor(private foodItemsService: FoodItemsService) {}

  @Public()
  @Get('api/food-items')
  findAll(@Query('category') category?: string) {
    return this.foodItemsService.findAll(category);
  }

  @ApiBearerAuth()
  @Post('api/admin/food-items')
  create(@Body() dto: CreateFoodItemDto) {
    return this.foodItemsService.create(dto.name, dto.category);
  }

  @ApiBearerAuth()
  @Delete('api/admin/food-items/:id')
  remove(@Param('id') id: string) {
    return this.foodItemsService.remove(+id);
  }
}
