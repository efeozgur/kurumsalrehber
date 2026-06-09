import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Public } from '../../common/decorators/public.decorator';
import { CreateSearchLogDto } from './dto/create-search-log.dto';

@ApiTags('Analytics')
@Controller()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Public()
  @Post('api/analytics/log/search')
  async logSearch(@Body() dto: CreateSearchLogDto) {
    await this.analyticsService.logSearch(dto.query, dto.resultCount ?? 0);
    return { success: true };
  }

  @Public()
  @Post('api/analytics/log/view')
  async logView(@Body('contactId') contactId: number) {
    await this.analyticsService.logView(contactId);
    return { success: true };
  }

  @Public()
  @Post('api/analytics/log/export')
  async logExport() {
    await this.analyticsService.logExport();
    return { success: true };
  }

  @ApiBearerAuth()
  @Get('api/admin/analytics/summary')
  getSummary() {
    return this.analyticsService.getSummary();
  }

  @ApiBearerAuth()
  @Get('api/admin/analytics/search-terms')
  getSearchTerms() {
    return this.analyticsService.getSearchTerms();
  }

  @ApiBearerAuth()
  @Get('api/admin/analytics/top-contacts')
  getTopContacts() {
    return this.analyticsService.getTopContacts();
  }

  @ApiBearerAuth()
  @Get('api/admin/analytics/usage-hourly')
  getUsageHourly() {
    return this.analyticsService.getUsageHourly();
  }

  @ApiBearerAuth()
  @Get('api/admin/analytics/usage-daily')
  getUsageDaily() {
    return this.analyticsService.getUsageDaily();
  }

  @ApiBearerAuth()
  @Get('api/admin/analytics/no-results')
  getNoResults() {
    return this.analyticsService.getNoResults();
  }

  @ApiBearerAuth()
  @Get('api/admin/analytics/fav-stats')
  getFavStats() {
    return this.analyticsService.getFavStats();
  }
}
