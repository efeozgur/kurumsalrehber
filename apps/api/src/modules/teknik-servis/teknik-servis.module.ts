import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TeknikServisService } from './teknik-servis.service';
import { TeknikServisController } from './teknik-servis.controller';
import { AdminTeknikServisController } from './admin-teknik-servis.controller';
import { ServisEventsService } from './servis-events.service';
import { ModuleGuard } from '../../common/guards/module.guard';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/teknik-servis',
    }),
  ],
  controllers: [TeknikServisController, AdminTeknikServisController],
  providers: [TeknikServisService, ServisEventsService, ModuleGuard],
})
export class TeknikServisModule {}
