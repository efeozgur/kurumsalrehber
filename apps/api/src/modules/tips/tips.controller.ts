import {
  Controller, Get, Post, Delete, Body, Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TipsService } from './tips.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Tips')
@Controller()
export class TipsController {
  constructor(private tipsService: TipsService) {}

  @Public()
  @Get('api/tips')
  findAll() {
    return this.tipsService.findAll();
  }

  @ApiBearerAuth()
  @Post('api/admin/tips')
  create(@Body() body: { text: string }) {
    return this.tipsService.create(body.text);
  }

  @ApiBearerAuth()
  @Delete('api/admin/tips/:id')
  remove(@Param('id') id: string) {
    return this.tipsService.remove(+id);
  }
}
