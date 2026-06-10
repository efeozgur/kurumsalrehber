import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RehberAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const module = await this.prisma.module.findUnique({
      where: { key: 'rehber-auth' },
    });

    if (!module?.enabled) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Bu sayfayı görüntülemek için giriş yapmalısınız');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          contact: { select: { firstName: true, lastName: true, sicilNo: true } },
        },
      });
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }
      request.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.contact?.firstName || null,
        lastName: user.contact?.lastName || null,
        sicilNo: user.contact?.sicilNo || null,
        firstTimeLogin: user.firstTimeLogin,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş oturum');
    }
  }
}
