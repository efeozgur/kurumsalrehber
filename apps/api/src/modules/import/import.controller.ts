import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Import')
@ApiBearerAuth()
@Controller('api/admin/import')
export class ImportController {
  constructor(private importService: ImportService) {}

  @Post('discover')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async discover(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Lütfen bir dosya seçin');
    }

    if (!file.originalname.endsWith('.db') && !file.originalname.endsWith('.sqlite') && !file.originalname.endsWith('.sqlite3')) {
      throw new BadRequestException('Lütfen geçerli bir SQLite veritabanı dosyası seçin (.db, .sqlite, .sqlite3)');
    }

    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    const filePath = this.importService.saveTempFile(file.buffer, ext);

    try {
      const tables = this.importService.discoverSchema(filePath);
      return { tables, filePath };
    } finally {
      this.importService.cleanupTempFile(filePath);
    }
  }

  @Post('execute')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async executeImport(
    @UploadedFile() file: Express.Multer.File,
    @Body('config') configStr: string,
  ) {
    if (!file) {
      throw new BadRequestException('Lütfen bir dosya seçin');
    }

    if (!configStr) {
      throw new BadRequestException('Yapılandırma bilgisi eksik');
    }

    let config: any;
    try {
      config = JSON.parse(configStr);
    } catch {
      throw new BadRequestException('Geçersiz yapılandırma formatı');
    }

    if (!config.contactTable) {
      throw new BadRequestException('Kişi tablosu seçilmedi');
    }

    if (!config.mapping?.firstName && !config.mapping?.fullName) {
      throw new BadRequestException('Ad (veya Ad Soyad) alan eşleştirmesi zorunludur');
    }

    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    const filePath = this.importService.saveTempFile(file.buffer, ext);

    try {
      return await this.importService.executeImport(filePath, config);
    } finally {
      this.importService.cleanupTempFile(filePath);
    }
  }

  @Roles('SUPER_ADMIN')
  @Post('clear')
  async clear() {
    return this.importService.clearAll();
  }
}
