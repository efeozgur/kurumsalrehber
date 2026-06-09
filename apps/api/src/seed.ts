import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const departments = [
  { name: 'İdari İşler' },
  { name: 'Hukuk' },
  { name: 'Muhasebe' },
  { name: 'Bilgi İşlem' },
  { name: 'İnsan Kaynakları' },
];

const titles = [
  'Avukat', 'Hakim', 'Savcı', 'Yazı İşleri Müdürü',
  'Şef', 'Memur', 'Uzman', 'Müdür', 'Tekniker', 'Koordinatör',
];

const people = [
  { first: 'Ahmet', last: 'Yılmaz', title: 'Müdür', dept: 'İdari İşler', dahili: '1001', cep: '5321110001' },
  { first: 'Ayşe', last: 'Demir', title: 'Memur', dept: 'İdari İşler', dahili: '1002', cep: '5321110002' },
  { first: 'Mehmet', last: 'Kaya', title: 'Yazı İşleri Müdürü', dept: 'İdari İşler', dahili: '1003', cep: '5321110003' },
  { first: 'Fatma', last: 'Şahin', title: 'Şef', dept: 'İdari İşler', dahili: '1004', cep: '5321110004' },
  { first: 'Mustafa', last: 'Öztürk', title: 'Memur', dept: 'İdari İşler', dahili: '1005', cep: '5321110005' },
  { first: 'Zeynep', last: 'Çelik', title: 'Uzman', dept: 'İdari İşler', dahili: '1006', cep: '5321110006' },
  { first: 'Ali', last: 'Koç', title: 'Memur', dept: 'İdari İşler', dahili: '1007', cep: '5321110007' },
  { first: 'Elif', last: 'Yıldız', title: 'Şef', dept: 'İdari İşler', dahili: '1008', cep: '5321110008' },
  { first: 'Hüseyin', last: 'Arslan', title: 'Memur', dept: 'İdari İşler', dahili: '1009', cep: '5321110009' },
  { first: 'Hatice', last: 'Kurt', title: 'Uzman', dept: 'İdari İşler', dahili: '1010', cep: '5321110010' },
  { first: 'İbrahim', last: 'Aydın', title: 'Avukat', dept: 'Hukuk', dahili: '2001', cep: '5321120001' },
  { first: 'Merve', last: 'Güneş', title: 'Avukat', dept: 'Hukuk', dahili: '2002', cep: '5321120002' },
  { first: 'Murat', last: 'Aslan', title: 'Hakim', dept: 'Hukuk', dahili: '2003', cep: '5321120003' },
  { first: 'Esra', last: 'Doğan', title: 'Savcı', dept: 'Hukuk', dahili: '2004', cep: '5321120004' },
  { first: 'Kemal', last: 'Özdemir', title: 'Avukat', dept: 'Hukuk', dahili: '2005', cep: '5321120005' },
  { first: 'Sema', last: 'Kılıç', title: 'Avukat', dept: 'Hukuk', dahili: '2006', cep: '5321120006' },
  { first: 'Burak', last: 'Aksoy', title: 'Hakim', dept: 'Hukuk', dahili: '2007', cep: '5321120007' },
  { first: 'Derya', last: 'Erdoğan', title: 'Savcı', dept: 'Hukuk', dahili: '2008', cep: '5321120008' },
  { first: 'Can', last: 'Güler', title: 'Avukat', dept: 'Hukuk', dahili: '2009', cep: '5321120009' },
  { first: 'Pınar', last: 'Tunç', title: 'Avukat', dept: 'Hukuk', dahili: '2010', cep: '5321120010' },
  { first: 'Oğuz', last: 'Polat', title: 'Müdür', dept: 'Muhasebe', dahili: '3001', cep: '5331130001' },
  { first: 'Hande', last: 'Yavuz', title: 'Şef', dept: 'Muhasebe', dahili: '3002', cep: '5331130002' },
  { first: 'Serkan', last: 'Karadeniz', title: 'Uzman', dept: 'Muhasebe', dahili: '3003', cep: '5331130003' },
  { first: 'Aslı', last: 'Gökalp', title: 'Memur', dept: 'Muhasebe', dahili: '3004', cep: '5331130004' },
  { first: 'Tolga', last: 'Ertürk', title: 'Uzman', dept: 'Muhasebe', dahili: '3005', cep: '5331130005' },
  { first: 'Ceren', last: 'Sönmez', title: 'Memur', dept: 'Muhasebe', dahili: '3006', cep: '5331130006' },
  { first: 'Gökhan', last: 'Acar', title: 'Şef', dept: 'Muhasebe', dahili: '3007', cep: '5331130007' },
  { first: 'Ece', last: 'Durmuş', title: 'Memur', dept: 'Muhasebe', dahili: '3008', cep: '5331130008' },
  { first: 'Fırat', last: 'Kaplan', title: 'Uzman', dept: 'Muhasebe', dahili: '3009', cep: '5331130009' },
  { first: 'İrem', last: 'Bozkurt', title: 'Memur', dept: 'Muhasebe', dahili: '3010', cep: '5331130010' },
  { first: 'Deniz', last: 'Çetin', title: 'Müdür', dept: 'Bilgi İşlem', dahili: '4001', cep: '5341140001' },
  { first: 'Cem', last: 'Korkmaz', title: 'Tekniker', dept: 'Bilgi İşlem', dahili: '4002', cep: '5341140002' },
  { first: 'Sibel', last: 'Özer', title: 'Uzman', dept: 'Bilgi İşlem', dahili: '4003', cep: '5341140003' },
  { first: 'Emre', last: 'Bulut', title: 'Tekniker', dept: 'Bilgi İşlem', dahili: '4004', cep: '5341140004' },
  { first: 'Gamze', last: 'Keskin', title: 'Uzman', dept: 'Bilgi İşlem', dahili: '4005', cep: '5341140005' },
  { first: 'Onur', last: 'Eren', title: 'Tekniker', dept: 'Bilgi İşlem', dahili: '4006', cep: '5341140006' },
  { first: 'Büşra', last: 'Taş', title: 'Uzman', dept: 'Bilgi İşlem', dahili: '4007', cep: '5341140007' },
  { first: 'Uğur', last: 'Yalçın', title: 'Tekniker', dept: 'Bilgi İşlem', dahili: '4008', cep: '5341140008' },
  { first: 'Meltem', last: 'Tekin', title: 'Koordinatör', dept: 'Bilgi İşlem', dahili: '4009', cep: '5341140009' },
  { first: 'Volkan', last: 'Ateş', title: 'Tekniker', dept: 'Bilgi İşlem', dahili: '4010', cep: '5341140010' },
  { first: 'Nur', last: 'Kara', title: 'Müdür', dept: 'İnsan Kaynakları', dahili: '5001', cep: '5351150001' },
  { first: 'Okan', last: 'Şimşek', title: 'Uzman', dept: 'İnsan Kaynakları', dahili: '5002', cep: '5351150002' },
  { first: 'Dilek', last: 'Ünal', title: 'Şef', dept: 'İnsan Kaynakları', dahili: '5003', cep: '5351150003' },
  { first: 'Barış', last: 'Gündüz', title: 'Uzman', dept: 'İnsan Kaynakları', dahili: '5004', cep: '5351150004' },
  { first: 'Sevgi', last: 'Alp', title: 'Memur', dept: 'İnsan Kaynakları', dahili: '5005', cep: '5351150005' },
  { first: 'Erkan', last: 'Köse', title: 'Uzman', dept: 'İnsan Kaynakları', dahili: '5006', cep: '5351150006' },
  { first: 'Nuray', last: 'Metin', title: 'Memur', dept: 'İnsan Kaynakları', dahili: '5007', cep: '5351150007' },
  { first: 'Hakan', last: 'Turan', title: 'Uzman', dept: 'İnsan Kaynakları', dahili: '5008', cep: '5351150008' },
  { first: 'Aylin', last: 'Sezer', title: 'Koordinatör', dept: 'İnsan Kaynakları', dahili: '5009', cep: '5351150009' },
  { first: 'Mert', last: 'Ceylan', title: 'Memur', dept: 'İnsan Kaynakları', dahili: '5010', cep: '5351150010' },
];

async function main() {
  console.log('Seed verileri oluşturuluyor...');

  // Admin kullanıcı
  const adminCount = await prisma.user.count();
  if (adminCount === 0) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { username: 'admin', password: hashed, role: 'SUPER_ADMIN' },
    });
    console.log('Admin kullanıcı oluşturuldu: admin / admin123');
  }

  // Varsayılan ipuçları
  const tipCount = await prisma.tip.count();
  if (tipCount === 0) {
    const defaultTips = [
      'Kişi ünvanına tıklayarak o ünvandaki personeli listeleyebilirsiniz.',
      'Birim (Görev Yeri) bilgisine tıklayarak o birimdeki tüm personeli görüntüleyebilirsiniz.',
      'Ad, soyad, telefon numarası veya e-posta ile hızlı arama yapabilirsiniz.',
      'Kişi kartlarındaki sicil numarası ile personeli kolayca tanımlayabilirsiniz.',
      'Liste ve grid görünümleri arasında geçiş yaparak sonuçları tercihinize göre görüntüleyebilirsiniz.',
    ];
    for (let i = 0; i < defaultTips.length; i++) {
      await prisma.tip.create({ data: { text: defaultTips[i], order: i } });
    }
    console.log('Varsayılan ipuçları oluşturuldu.');
  }

  // Birimler
  const deptMap: Record<string, number> = {};
  for (const d of departments) {
    const dept = await prisma.department.upsert({
      where: { name: d.name },
      update: {},
      create: { name: d.name },
    });
    deptMap[d.name] = dept.id;
  }
  console.log(`${departments.length} birim oluşturuldu.`);

  // Ünvanlar
  const titleMap: Record<string, number> = {};
  for (const t of titles) {
    const title = await prisma.title.upsert({
      where: { name: t },
      update: {},
      create: { name: t },
    });
    titleMap[t] = title.id;
  }
  console.log(`${titles.length} ünvan oluşturuldu.`);

  // Kişiler
  for (const p of people) {
    const existing = await prisma.contact.findFirst({
      where: { firstName: p.first, lastName: p.last },
    });
    if (!existing) {
      await prisma.contact.create({
        data: {
          firstName: p.first,
          lastName: p.last,
          sicilNo: p.dahili,
          phoneInternal: p.dahili,
          phoneMobile: p.cep,
          email: `${p.first.toLocaleLowerCase('tr-TR')}.${p.last.toLocaleLowerCase('tr-TR')}@example.com`,
          departmentId: deptMap[p.dept],
          titleId: titleMap[p.title],
        },
      });
    }
  }
  console.log(`${people.length} kişi oluşturuldu.`);

  // Varsayılan ayarlar
  const settingCount = await prisma.setting.count();
  if (settingCount === 0) {
    await prisma.setting.create({ data: { key: 'tipSpeed', value: '4000' } });
    console.log('Varsayılan ayarlar oluşturuldu.');
  }

  // Varsayılan modüller
  const modulesCount = await prisma.module.count();
  if (modulesCount === 0) {
    await prisma.module.create({
      data: { key: 'meal-plans', name: 'Yemek Listesi', description: 'Haftalık yemek listesi yönetimi', enabled: true },
    });
    console.log('Varsayılan modüller oluşturuldu.');
  }

  // Varsayılan yemekler
  const foodCount = await prisma.foodItem.count();
  if (foodCount === 0) {
    const defaultFoods = [
      { name: 'Mercimek Çorbası', category: 'soup' },
      { name: 'Ezogelin Çorbası', category: 'soup' },
      { name: 'Tarhana Çorbası', category: 'soup' },
      { name: 'Domates Çorbası', category: 'soup' },
      { name: 'Kuru Fasulye', category: 'main' },
      { name: 'Pilav', category: 'main' },
      { name: 'Tavuk Şiş', category: 'main' },
      { name: 'Köfte', category: 'main' },
      { name: 'Izgara Balık', category: 'main' },
      { name: 'Makarna', category: 'main' },
      { name: 'Mevsim Salata', category: 'salad' },
      { name: 'Çoban Salata', category: 'salad' },
      { name: 'Yeşil Salata', category: 'salad' },
      { name: 'Rus Salatası', category: 'salad' },
    ];
    for (const food of defaultFoods) {
      await prisma.foodItem.create({ data: food });
    }
    console.log('Varsayılan yemekler oluşturuldu.');
  }

  // Demo SearchLog verileri (son 30 gün)
  const searchLogCount = await prisma.searchLog.count();
  if (searchLogCount === 0) {
    const now = new Date();
    const queries = [
      'Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Mustafa', 'Zeynep', 'Ali', 'Elif',
      'Hukuk', 'Muhasebe', 'Bilgi İşlem', 'İnsan Kaynakları', 'İdari İşler',
      'Avukat', 'Müdür', 'Memur', 'Tekniker', 'Hakim', 'Savcı',
      'Yılmaz', 'Demir', 'Kaya', 'Koç', 'Yıldız',
      'dahili', 'telefon', 'mail', 'adres',
    ];
    const noResultQueries = ['xyztest', 'bulunamadı', 'olmayankisi', 'yanlış', 'test12345', 'deneme'];

    const logs: any[] = [];

    // Normal aramalar
    for (let i = 0; i < 80; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const date = new Date(now.getTime() - daysAgo * 86400000 - hoursAgo * 3600000);
      const query = queries[Math.floor(Math.random() * queries.length)];
      logs.push({
        query,
        resultCount: Math.floor(Math.random() * 20) + 1,
        source: 'search',
        createdAt: date,
      });
    }

    // Boş sonuç dönen aramalar
    for (let i = 0; i < 12; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now.getTime() - daysAgo * 86400000);
      const query = noResultQueries[Math.floor(Math.random() * noResultQueries.length)];
      logs.push({
        query,
        resultCount: 0,
        source: 'search',
        createdAt: date,
      });
    }

    // Görüntüleme logları (contactId 1-50 arası)
    for (let i = 0; i < 30; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now.getTime() - daysAgo * 86400000);
      logs.push({
        contactId: Math.floor(Math.random() * 50) + 1,
        resultCount: 1,
        source: 'view',
        createdAt: date,
      });
    }

    // Export logları
    for (let i = 0; i < 5; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now.getTime() - daysAgo * 86400000);
      logs.push({
        resultCount: 0,
        source: 'export',
        createdAt: date,
      });
    }

    await prisma.searchLog.createMany({ data: logs });
    console.log('Demo SearchLog verileri oluşturuldu.');
  }

  console.log('Seed tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
