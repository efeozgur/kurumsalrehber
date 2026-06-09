import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Settings')
@Controller('api/admin/settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Public()
  @Get()
  getAll() {
    return this.settingsService.getAll();
  }

  @ApiBearerAuth()
  @Post()
  update(@Body() dto: UpdateSettingDto) {
    return this.settingsService.set(dto.key, dto.value);
  }
}
