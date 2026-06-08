import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'uploads', 'contacts'),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${uuid()}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
