import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async checkSetup() {
    const userCount = await this.prisma.user.count();
    return { needsSetup: userCount === 0 };
  }

  async setup(username: string, password: string) {
    const userCount = await this.prisma.user.count();
    if (userCount > 0) {
      throw new ForbiddenException(
        'Sistem zaten kurulu. İlk admin oluşturulamaz.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });

    return {
      message: 'İlk admin kullanıcısı oluşturuldu',
      username: user.username,
    };
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        contact: { select: { firstName: true, lastName: true, sicilNo: true } },
      },
    });
    if (!user) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      firstTimeLogin: user.firstTimeLogin,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.contact?.firstName || null,
        lastName: user.contact?.lastName || null,
        sicilNo: user.contact?.sicilNo || null,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        contact: { select: { firstName: true, lastName: true, sicilNo: true } },
      },
    });
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      firstTimeLogin: user.firstTimeLogin,
      firstName: user.contact?.firstName || null,
      lastName: user.contact?.lastName || null,
      sicilNo: user.contact?.sicilNo || null,
    };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı');
    }

    if (!user.firstTimeLogin) {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new UnauthorizedException('Mevcut şifre hatalı');
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, firstTimeLogin: false },
    });

    return { message: 'Şifre başarıyla değiştirildi' };
  }

  async forgotPassword(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        contact: { select: { firstName: true, lastName: true, sicilNo: true } },
      },
    });
    if (!user) {
      throw new BadRequestException('Bu sicil numarasına ait kullanıcı bulunamadı');
    }

    const token = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
    const exp = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExp: exp },
    });

    return {
      message: 'Şifre sıfırlama kodu oluşturuldu',
      token,
      firstName: user.contact?.firstName || null,
      lastName: user.contact?.lastName || null,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gte: new Date() },
      },
    });
    if (!user) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş şifre sıfırlama kodu');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
        firstTimeLogin: false,
      },
    });

    return { message: 'Şifre başarıyla sıfırlandı' };
  }

  async syncUsersFromContacts() {
    const contacts = await this.prisma.contact.findMany({
      where: {
        sicilNo: { not: null },
        user: null,
      },
    });

    let created = 0;
    for (const contact of contacts) {
      const existing = await this.prisma.user.findUnique({
        where: { username: contact.sicilNo! },
      });
      if (existing) continue;

      const hashedPassword = await bcrypt.hash('Adalet', 10);
      await this.prisma.user.create({
        data: {
          username: contact.sicilNo!,
          password: hashedPassword,
          role: 'USER',
          firstTimeLogin: true,
          contactId: contact.id,
        },
      });
      created++;
    }

    return { message: `${created} kullanıcı hesabı oluşturuldu` };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        firstTimeLogin: true,
        createdAt: true,
        contact: { select: { firstName: true, lastName: true, sicilNo: true } },
      },
    });
  }

  async createUser(username: string, password: string, role?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existing) {
      throw new BadRequestException('Bu kullanıcı adı zaten kullanılıyor');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role || 'ADMIN',
      },
      select: { id: true, username: true, role: true, createdAt: true },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı');
    }

    const adminCount = await this.prisma.user.count();
    if (adminCount <= 1) {
      throw new BadRequestException('Son admin kullanıcı silinemez');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'Kullanıcı silindi' };
  }
}
