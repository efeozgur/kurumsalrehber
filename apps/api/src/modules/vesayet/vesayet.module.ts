import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module';
import { VesayetController } from './vesayet.controller';
import { VesayetService } from './vesayet.service';
import { ModuleGuard } from '../../common/guards/module.guard';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [VesayetController],
  providers: [VesayetService, ModuleGuard],
})
export class VesayetModule {}
