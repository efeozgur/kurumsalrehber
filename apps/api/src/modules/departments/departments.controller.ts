import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { Public } from '../../common/decorators/public.decorator';

class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

@ApiTags('Departments')
@Controller()
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Public()
  @Get('api/departments')
  findAll() {
    return this.departmentsService.findAll();
  }

  @Public()
  @Get('api/departments/:id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Post('api/admin/departments')
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto.name);
  }

  @ApiBearerAuth()
  @Put('api/admin/departments/:id')
  update(@Param('id') id: string, @Body() dto: CreateDepartmentDto) {
    return this.departmentsService.update(+id, dto.name);
  }

  @ApiBearerAuth()
  @Delete('api/admin/departments/:id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}
