import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed verileri oluşturuluyor...');

  const adminCount = await prisma.user.count();
  if (adminCount === 0) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { username: 'admin', password: hashed, role: 'SUPER_ADMIN' },
    });
    console.log('Admin kullanıcı oluşturuldu: admin / admin123');
  }

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

  console.log('Seed tamamlandı! (demo verisi yüklenmedi)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
