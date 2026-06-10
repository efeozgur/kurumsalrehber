import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { AuthModule } from '../auth/auth.module';
import { RehberAuthGuard } from '../../common/guards/rehber-auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [ContactsController],
  providers: [ContactsService, RehberAuthGuard],
})
export class ContactsModule {}
