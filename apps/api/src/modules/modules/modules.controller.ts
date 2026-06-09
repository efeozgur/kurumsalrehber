import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiTags('Modules')
@ApiBearerAuth()
@Controller('api/admin/modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(+id, dto);
  }
}
