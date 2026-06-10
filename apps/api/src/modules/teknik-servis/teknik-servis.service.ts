import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServisEventsService } from './servis-events.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeknikServisService {
  constructor(
    private prisma: PrismaService,
    private events: ServisEventsService,
  ) {}

  async create(data: { title: string; description: string; image?: string }, userId: number) {
    const request = await this.prisma.serviceRequest.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        reportedById: userId,
      },
      include: {
        reportedBy: {
          include: { contact: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    this.events.emit('new_request', request);
    return request;
  }

  async findByUser(userId: number) {
    return this.prisma.serviceRequest.findMany({
      where: { reportedById: userId },
      include: {
        reportedBy: {
          include: { contact: { select: { firstName: true, lastName: true } } },
        },
        assignedTo: {
          include: { contact: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.serviceRequest.findMany({
      include: {
        reportedBy: {
          include: { contact: { select: { firstName: true, lastName: true } } },
        },
        assignedTo: {
          include: { contact: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        reportedBy: {
          include: { contact: { select: { firstName: true, lastName: true } } },
        },
        assignedTo: {
          include: { contact: { select: { firstName: true, lastName: true } } },
        },
      },
    });
    if (!request) {
      throw new NotFoundException('Arıza kaydı bulunamadı');
    }
    return request;
  }

  async updateStatus(id: number, status: string, userId: number) {
    const request = await this.findOne(id);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    const isTech = await this.isTechUser(userId);
    const isOwner = request.reportedById === userId;

    if (status === 'resolved') {
      throw new BadRequestException('Çözüm işlemi için resolve metodunu kullanın');
    }

    const setting = await this.getSetting();

    if (status === 'closed' && setting?.closedBy === 'user' && isOwner) {
      await this.prisma.serviceRequest.update({
        where: { id },
        data: { status: 'resolved', closedAt: new Date(), resolvedBy: userId },
      });
      this.events.emit('status_change', { id, status: 'resolved' });
      return this.findOne(id);
    }

    if (!isTech) {
      throw new ForbiddenException('Bu işlem için teknik personel yetkisi gerekli');
    }

    const validTransitions: Record<string, string[]> = {
      submitted: ['seen'],
      seen: ['intervened'],
      intervened: ['resolved'],
    };

    if (!validTransitions[request.status]?.includes(status)) {
      throw new BadRequestException(`"${request.status}" durumundan "${status}" durumuna geçilemez`);
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status,
        ...(status === 'resolved' ? { closedAt: new Date(), resolvedBy: userId } : {}),
      },
    });

    this.events.emit('status_change', { id, status });
    return updated;
  }

  async resolve(id: number, resolution: string, userId: number) {
    const request = await this.findOne(id);
    const isTech = await this.isTechUser(userId);
    const setting = await this.getSetting();

    if (setting?.closedBy === 'user' && request.reportedById === userId) {
      // user can close
    } else if (isTech) {
      // tech can close
    } else {
      throw new ForbiddenException('Arızayı kapatma yetkiniz yok');
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'resolved',
        resolution,
        closedAt: new Date(),
        resolvedBy: userId,
      },
    });
  }

  async assignToSelf(id: number, userId: number) {
    const isTech = await this.isTechUser(userId);
    if (!isTech) {
      throw new ForbiddenException('Teknik personel yetkisi gerekli');
    }

    await this.findOne(id);
    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: { assignedToId: userId },
    });

    this.events.emit('assignment', { id, assignedToId: userId });
    return updated;
  }

  async searchSolutions(q: string) {
    if (!q || q.length < 2) return [];
    return this.prisma.serviceSolution.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { keywords: { contains: q } },
        ],
      },
      take: 10,
    });
  }

  // ─── Admin ──────────────────────────────────────────

  async getAssignments() {
    return this.prisma.serviceAssignment.findMany({
      include: {
        user: {
          include: { contact: { select: { firstName: true, lastName: true, sicilNo: true } } },
        },
      },
    });
  }

  async assignUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    return this.prisma.serviceAssignment.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async removeAssignment(userId: number) {
    const assignment = await this.prisma.serviceAssignment.findUnique({ where: { userId } });
    if (!assignment) throw new NotFoundException('Atama bulunamadı');
    await this.prisma.serviceAssignment.delete({ where: { userId } });
    return { message: 'Teknik personel yetkisi kaldırıldı' };
  }

  async isTechUser(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') return true;
    const assignment = await this.prisma.serviceAssignment.findUnique({ where: { userId } });
    return !!assignment;
  }

  async getSetting() {
    const setting = await this.prisma.setting.findUnique({ where: { key: 'teknik-servis' } });
    return setting ? JSON.parse(setting.value) : { closedBy: 'tech' };
  }

  async updateSetting(data: { closedBy: string }) {
    await this.prisma.setting.upsert({
      where: { key: 'teknik-servis' },
      update: { value: JSON.stringify(data) },
      create: { key: 'teknik-servis', value: JSON.stringify(data) },
    });
    return { message: 'Ayarlar güncellendi' };
  }

  async createSolution(data: { title: string; description: string; keywords: string }) {
    return this.prisma.serviceSolution.create({ data });
  }

  async deleteSolution(id: number) {
    await this.prisma.serviceSolution.delete({ where: { id } });
    return { message: 'Çözüm önerisi silindi' };
  }

  async getSolutions() {
    return this.prisma.serviceSolution.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
