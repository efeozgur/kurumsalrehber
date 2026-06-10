import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiQuery } from '@nestjs/swagger';
import { TeknikServisService } from './teknik-servis.service';
import { ServisEventsService } from './servis-events.service';
import { ModuleAccess } from '../../common/decorators/module-access.decorator';
import { ModuleGuard } from '../../common/guards/module.guard';
import { UseGuards } from '@nestjs/common';
import { join } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Teknik Servis')
@ApiBearerAuth()
@Controller('api/teknik-servis')
@ModuleAccess('teknik-servis')
@UseGuards(ModuleGuard)
export class TeknikServisController {
  constructor(
    private service: TeknikServisService,
    private eventsService: ServisEventsService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Request() req,
    @Body('title') title: string,
    @Body('description') description: string,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (!title || !description) {
      throw new BadRequestException('Başlık ve açıklama zorunludur');
    }

    let imagePath: string | undefined;
    if (image) {
      const ext = image.originalname.substring(image.originalname.lastIndexOf('.'));
      const filename = `${uuidv4()}${ext}`;
      const filePath = join(__dirname, '..', '..', '..', '..', 'uploads', 'teknik-servis', filename);
      writeFileSync(filePath, image.buffer);
      imagePath = `/uploads/teknik-servis/${filename}`;
    }

    return this.service.create({ title, description, image: imagePath }, req.user?.id);
  }

  @Get('my')
  getMy(@Request() req) {
    if (!req.user?.id) throw new BadRequestException('Giriş yapmalısınız');
    return this.service.findByUser(req.user.id);
  }

  @Get('solutions')
  @ApiQuery({ name: 'q', required: true })
  searchSolutions(@Query('q') q: string) {
    return this.service.searchSolutions(q || '');
  }

  @Get('events')
  events(@Request() req, @Res() res: Response) {
    if (!req.user?.id) {
      res.status(401).end();
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    const subscription = this.eventsService.subscribe().subscribe((event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    req.on('close', () => {
      subscription.unsubscribe();
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    return this.service.updateStatus(+id, status, req.user?.id);
  }

  // ─── Teknik Personel / Admin ───────────────────────

  @Get('admin/all')
  findAll() {
    return this.service.findAll();
  }

  @Patch('admin/:id/assign')
  assignToSelf(@Param('id') id: string, @Request() req) {
    return this.service.assignToSelf(+id, req.user?.id);
  }

  @Patch('admin/:id/assign/:userId')
  assignToUser(@Param('id') id: string, @Param('userId') userId: string, @Request() req) {
    return this.service.assignToUser(+id, +userId, req.user?.id);
  }

  @Patch('admin/:id/status')
  adminUpdateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    return this.service.updateStatus(+id, status, req.user?.id);
  }

  @Patch('admin/:id/resolve')
  resolve(
    @Param('id') id: string,
    @Body('resolution') resolution: string,
    @Request() req,
  ) {
    if (!resolution) throw new BadRequestException('Çözüm açıklaması zorunludur');
    return this.service.resolve(+id, resolution, req.user?.id);
  }
}
