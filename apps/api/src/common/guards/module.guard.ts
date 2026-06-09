import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_KEY } from '../decorators/module-access.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const moduleKey = this.reflector.getAllAndOverride<string>(MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!moduleKey) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Yetkisiz erisim');
    }

    const mod = await this.prisma.module.findUnique({ where: { key: moduleKey } });
    if (!mod || !mod.enabled) {
      throw new ForbiddenException('Bu modul su anda aktif degil');
    }

    const permission = await this.prisma.userModulePermission.findFirst({
      where: { userId: user.id, moduleId: mod.id },
    });
    if (!permission) {
      throw new ForbiddenException('Bu module erisim yetkiniz bulunmuyor');
    }
    return true;
  }
}
