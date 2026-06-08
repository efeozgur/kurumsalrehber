import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { UploadModule } from './modules/upload/upload.module';
import { TitlesModule } from './modules/titles/titles.module';
import { TipsModule } from './modules/tips/tips.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ContactsModule,
    DepartmentsModule,
    UploadModule,
    TitlesModule,
    TipsModule,
  ],
})
export class AppModule {}
