import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { TeknikServisService } from './teknik-servis.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin Teknik Servis')
@ApiBearerAuth()
@Controller('api/admin/teknik-servis')
export class AdminTeknikServisController {
  constructor(private service: TeknikServisService) {}

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('assignments')
  getAssignments() {
    return this.service.getAssignments();
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post('assignments')
  assignUser(@Body('userId') userId: number) {
    if (!userId) throw new BadRequestException('Kullanıcı ID gerekli');
    return this.service.assignUser(userId);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete('assignments/:userId')
  removeAssignment(@Param('userId') userId: string) {
    return this.service.removeAssignment(+userId);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('settings')
  getSettings() {
    return this.service.getSetting();
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch('settings')
  updateSettings(@Body('closedBy') closedBy: string) {
    if (!closedBy || !['user', 'tech'].includes(closedBy)) {
      throw new BadRequestException('closedBy değeri "user" veya "tech" olmalıdır');
    }
    return this.service.updateSetting({ closedBy });
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('solutions')
  getSolutions() {
    return this.service.getSolutions();
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post('solutions')
  createSolution(@Body() data: { title: string; description: string; keywords: string }) {
    if (!data.title || !data.description) {
      throw new BadRequestException('Başlık ve açıklama zorunludur');
    }
    return this.service.createSolution(data);
  }

  @Roles('SUPER_ADMIN')
  @Delete('solutions/:id')
  deleteSolution(@Param('id') id: string) {
    return this.service.deleteSolution(+id);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('users/search')
  @ApiQuery({ name: 'q', required: true })
  searchUsers(@Query('q') q: string) {
    return this.service.searchUsers(q || '');
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('personnel')
  getTechPersonnel() {
    return this.service.getTechPersonnel();
  }
}
