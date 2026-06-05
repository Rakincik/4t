import prisma from '../src/lib/prisma';
import * as fs from 'fs';

async function main() {
    console.log("📥 JSON'dan Veritabanına Aktarım Başlıyor...");
    
    if (!fs.existsSync('./kurslar_backup.json')) {
        console.error("❌ HATA: kurslar_backup.json bulunamadı!");
        return;
    }

    const data = fs.readFileSync('./kurslar_backup.json', 'utf-8');
    const courses = JSON.parse(data);

    let addedCount = 0;
    let skipCount = 0;

    for (const item of courses) {
        // Zaten var mı kontrolü (Aynı sayfayı 2 kere basma ihtimaline karşı)
        const existing = await prisma.course.findFirst({
            where: { OR: [ { slug: item.slug }, { title: item.title } ]}
        });

        if (!existing) {
            await prisma.course.create({
                data: {
                    title: item.title,
                    slug: item.slug,
                    description: item.description,
                    price: item.price,
                    oldPrice: item.oldPrice,
                    imageUrl: item.imageUrl,
                    type: 'KURS',
                    category: item.category,
                    isActive: item.isActive,
                }
            });
            addedCount++;
            console.log(`✅ Veritabanına Eklendi: ${item.title}`);
        } else {
            console.log(`⚠️ Atlandı (Zaten Var): ${item.title}`);
            skipCount++;
        }
    }

    console.log(`\n🎉 MUHTEŞEM! Veritabanına aktarım bitti.`);
    console.log(`👉 Yeni Eklenen: ${addedCount}`);
    console.log(`👉 Zaten Var Olan (Atlanan): ${skipCount}`);
}

main().catch(e => {
    console.error("Ağır bir hata oluştu:", e.message);
}).finally(() => {
    prisma.$disconnect();
});
