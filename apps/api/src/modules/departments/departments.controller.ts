import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';
import { ApiBearerAuth, ApiTags, ApiProperty } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

class CreateDepartmentDto {
  @ApiProperty({ description: 'Birim adı' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Üst birim ID', required: false })
  @IsOptional()
  @IsInt()
  parentId?: number;
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
  @Get('api/departments/tree')
  getTree() {
    return this.departmentsService.getTree();
  }

  @Public()
  @Get('api/departments/:id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Post('api/admin/departments')
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto.name, dto.parentId);
  }

  @ApiBearerAuth()
  @Put('api/admin/departments/:id')
  update(@Param('id') id: string, @Body() dto: CreateDepartmentDto) {
    return this.departmentsService.update(+id, dto.name, dto.parentId);
  }

  @ApiBearerAuth()
  @Roles('SUPER_ADMIN')
  @Delete('api/admin/departments/:id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}
