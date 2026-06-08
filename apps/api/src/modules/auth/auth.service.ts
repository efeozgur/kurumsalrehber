import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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
    const user = await this.prisma.user.findUnique({ where: { username } });
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
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }
    return user;
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, role: true, createdAt: true },
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
