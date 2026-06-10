import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tables = [
    'searchLog',
    'userModulePermission',
    'bankAccount',
    'goldAccount',
    'ward',
    'mealPlan',
    'foodItem',
    'contact',
    'title',
    'department',
    'tip',
    'module',
    'setting',
    'user',
  ];

  for (const t of tables) {
    const r = await (prisma as any)[t].deleteMany();
    console.log(`${t}: ${r.count} kayit silindi`);
  }

  console.log('Veritabani temizlendi.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
