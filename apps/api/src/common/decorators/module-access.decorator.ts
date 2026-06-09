import { SetMetadata } from '@nestjs/common';

export const MODULE_KEY = 'moduleKey';
export const ModuleAccess = (moduleKey: string) => SetMetadata(MODULE_KEY, moduleKey);
