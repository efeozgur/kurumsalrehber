import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', JSON.stringify(users, null, 2));

  const modules = await prisma.module.findMany();
  console.log('Modules:', JSON.stringify(modules, null, 2));

  const perms = await prisma.userModulePermission.findMany();
  console.log('Permissions:', JSON.stringify(perms, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
