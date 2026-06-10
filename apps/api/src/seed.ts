import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Başlangıç yapılandırması oluşturuluyor...');

  // Admin kullanıcı
  const adminCount = await prisma.user.count();
  if (adminCount === 0) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { username: 'admin', password: hashed, role: 'SUPER_ADMIN' },
    });
    console.log('Admin kullanıcı oluşturuldu: admin / admin123');
  }

  // VESAYET_ADMIN kullanıcısı
  const vesayetAdminExists = await prisma.user.findUnique({ where: { username: 'vesayet' } });
  if (!vesayetAdminExists) {
    const hashed = await bcrypt.hash('vesayet123', 10);
    await prisma.user.create({
      data: { username: 'vesayet', password: hashed, role: 'VESAYET_ADMIN' },
    });
    console.log('Vesayet admin kullanıcı oluşturuldu: vesayet / vesayet123');
  }

  // Varsayılan ayarlar
  const settingCount = await prisma.setting.count();
  if (settingCount === 0) {
    await prisma.setting.create({ data: { key: 'tipSpeed', value: '4000' } });
    console.log('Varsayılan ayarlar oluşturuldu.');
  }

  // Varsayılan modüller
  const defaultModules = [
    { key: 'meal-plans', name: 'Yemek Listesi', description: 'Haftalık yemek listesi yönetimi' },
    { key: 'vesayet', name: 'Vesayet', description: 'Vesayet kısıtlı ve banka hesabı yönetimi' },
    { key: 'rehber-auth', name: 'Rehber Kimlik Doğrulama', description: 'Aktif edildiğinde telefon rehberini kullanmak için giriş yapmak zorunludur.', enabled: false },
  ];
  for (const mod of defaultModules) {
    await prisma.module.upsert({
      where: { key: mod.key },
      update: {},
      create: { key: mod.key, name: mod.name, description: mod.description, enabled: mod.enabled !== undefined ? mod.enabled : true },
    });
  }

  // Varsayılan bankalar
  const bankCount = await prisma.bank.count();
  if (bankCount === 0) {
    const defaultBanks = [
      { name: 'T. Vakıflar Bankası' },
      { name: 'Ziraat Bankası' },
    ];
    for (const bank of defaultBanks) {
      await prisma.bank.upsert({
        where: { name: bank.name },
        update: {},
        create: bank,
      });
    }
    console.log('Varsayılan bankalar oluşturuldu.');
  }

  // Tüm kullanıcılara modül izinlerini ver
  const allUsers = await prisma.user.findMany();
  const allModules = await prisma.module.findMany();
  for (const u of allUsers) {
    for (const mod of allModules) {
      await prisma.userModulePermission.upsert({
        where: { userId_moduleId: { userId: u.id, moduleId: mod.id } },
        update: {},
        create: { userId: u.id, moduleId: mod.id },
      });
    }
  }
  console.log('Kullanıcı modül izinleri oluşturuldu.');

  console.log('Yapılandırma tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
