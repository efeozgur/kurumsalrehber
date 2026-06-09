import {
  Controller, Get, Post, Put, Delete, Body, Param,
} from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TitlesService } from './titles.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

class CreateTitleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

@ApiTags('Titles')
@Controller()
export class TitlesController {
  constructor(private titlesService: TitlesService) {}

  @Public()
  @Get('api/titles')
  findAll() {
    return this.titlesService.findAll();
  }

  @ApiBearerAuth()
  @Post('api/admin/titles')
  create(@Body() dto: CreateTitleDto) {
    return this.titlesService.create(dto.name);
  }

  @ApiBearerAuth()
  @Put('api/admin/titles/:id')
  update(@Param('id') id: string, @Body() dto: CreateTitleDto) {
    return this.titlesService.update(+id, dto.name);
  }

  @ApiBearerAuth()
  @Roles('SUPER_ADMIN')
  @Delete('api/admin/titles/:id')
  remove(@Param('id') id: string) {
    return this.titlesService.remove(+id);
  }
}
