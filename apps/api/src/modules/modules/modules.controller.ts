import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Modules')
@Controller()
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Public()
  @Get('api/modules/:key/status')
  async getStatus(@Param('key') key: string) {
    const mod = await this.modulesService.findByKey(key);
    return { enabled: mod?.enabled ?? true };
  }

  @ApiBearerAuth()
  @Get('api/admin/modules')
  findAll() {
    return this.modulesService.findAll();
  }

  @ApiBearerAuth()
  @Patch('api/admin/modules/:id')
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(+id, dto);
  }
}
