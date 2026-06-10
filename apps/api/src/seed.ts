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
    { key: 'teknik-servis', name: 'Teknik Servis', description: 'Aktif edildiğinde kullanıcılar arıza bildirimi yapabilir.', enabled: true },
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

  // Varsayılan teknik servis çözüm önerileri
  const solutionCount = await prisma.serviceSolution.count();
  if (solutionCount === 0) {
    const defaultSolutions = [
      { title: 'Yazıcı kağıt sıkışması', description: 'Kağıdı çekmeceden çıkarın, sıkışan kağıdı yavaşça düz bir şekilde çekin. Yazıcıyı kapatıp açın.', keywords: 'yazıcı,kağıt,sıkışma,printer' },
      { title: 'Bilgisayar açılmıyor', description: 'Güç kablosunu kontrol edin, prize takılı olduğundan emin olun. Güç düğmesine basılı tutun.', keywords: 'bilgisayar,açılmıyor,güç,pc' },
      { title: 'İnternet bağlantısı yok', description: 'Modemi fişten çekip 30 saniye bekleyin, tekrar takın. Ethernet kablosunu kontrol edin.', keywords: 'internet,bağlantı,modem,wifi,ağ' },
      { title: 'Yazıcı çıktı almıyor', description: 'Toneri kontrol edin, kağıt olup olmadığını kontrol edin. Yazıcıyı yeniden başlatın.', keywords: 'yazıcı,çıktı,toner,baskı' },
      { title: 'Monitör görüntü vermiyor', description: 'Kablo bağlantılarını kontrol edin. Monitörün güç ışığını kontrol edin. Farklı bir kablo deneyin.', keywords: 'monitör,görüntü,ekran,kablo' },
      { title: 'Klavye çalışmıyor', description: 'USB bağlantısını kontrol edin, farklı bir porta takın. Bilgisayarı yeniden başlatın.', keywords: 'klavye,tuş,çalışmıyor,usb' },
      { title: 'Fare imleci hareket etmiyor', description: 'Pilini kontrol edin (kablosuzsa). USB bağlantısını kontrol edin. Farklı bir yüzeyde deneyin.', keywords: 'fare,mouse,imleç,çalışmıyor' },
    ];
    for (const sol of defaultSolutions) {
      await prisma.serviceSolution.create({ data: sol });
    }
    console.log('Varsayılan çözüm önerileri oluşturuldu.');
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
