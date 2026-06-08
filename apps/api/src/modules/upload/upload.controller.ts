import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('api/admin/upload')
export class UploadController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Lütfen bir dosya seçin');
    }

    return {
      url: `/uploads/contacts/${file.filename}`,
      filename: file.filename,
    };
  }
}
