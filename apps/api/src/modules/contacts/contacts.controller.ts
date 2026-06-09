import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Contacts')
@Controller()
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Public()
  @Get('api/contacts/search')
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'titleId', required: false })
  @ApiQuery({ name: 'fav', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  search(
    @Query('q') q?: string,
    @Query('departmentId') departmentId?: string,
    @Query('titleId') titleId?: string,
    @Query('fav') fav?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contactsService.search(
      q,
      departmentId ? +departmentId : undefined,
      titleId ? +titleId : undefined,
      fav === 'true' ? true : undefined,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Public()
  @Get('api/contacts/fav/list')
  listFavorites(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contactsService.getFavorites(
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Public()
  @Get('api/contacts/:id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Public()
  @Patch('api/contacts/:id/favorite')
  toggleFavorite(@Param('id') id: string) {
    return this.contactsService.toggleFavorite(+id);
  }

  @ApiBearerAuth()
  @Post('api/admin/contacts')
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  @ApiBearerAuth()
  @Put('api/admin/contacts/:id')
  update(@Param('id') id: string, @Body() dto: CreateContactDto) {
    return this.contactsService.update(+id, dto);
  }

  @ApiBearerAuth()
  @Roles('SUPER_ADMIN')
  @Delete('api/admin/contacts/:id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }

  @ApiBearerAuth()
  @Get('api/admin/contacts')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  adminList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
  ) {
    return this.contactsService.search(
      q,
      undefined,
      undefined,
      undefined,
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  @ApiBearerAuth()
  @Post('api/admin/contacts/import')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async importContacts(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Lütfen bir dosya seçin');
    }

    const XLSX = await import('xlsx');
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    if (rows.length === 0) {
      throw new BadRequestException('Dosyada hiç veri bulunamadı');
    }

    return this.contactsService.importRows(rows);
  }

  @ApiBearerAuth()
  @Get('api/admin/contacts/export')
  @ApiQuery({ name: 'format', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  async exportContacts(
    @Res() res: Response,
    @Query('format') format?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    const fmt = format === 'csv' ? 'csv' : 'xlsx';
    const { buffer, ext, type } = await this.contactsService.exportData(fmt, departmentId ? +departmentId : undefined);
    res.setHeader('Content-Type', type);
    res.setHeader('Content-Disposition', `attachment; filename="kisiler.${ext}"`);
    res.send(buffer);
  }

  @ApiBearerAuth()
  @Get('api/admin/stats')
  getStats() {
    return this.contactsService.getStats();
  }
}
