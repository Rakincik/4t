const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Kurs aktarımı başlatılıyor...");
    
    if (!fs.existsSync("kurslar_backup.json")) {
        console.error("❌ HATA: kurslar_backup.json dosyası bulunamadı!");
        process.exit(1);
    }

    const raw = fs.readFileSync("kurslar_backup.json", "utf-8");
    const courses = JSON.parse(raw);

    console.log(`📦 Toplam ${courses.length} adet kurs bulundu, veritabanına yazılıyor...`);

    let success = 0;
    let failed = 0;

    for (const course of courses) {
        try {
            // ID çakışması olmaması için varsa güncelliyor, yoksa yeni oluşturuyor
            await prisma.course.upsert({
                where: { slug: course.slug },
                update: course,
                create: course,
            });
            success++;
            console.log(`✅ Eklendi: ${course.title}`);
        } catch (error) {
            console.error(`❌ Eklenemedi: ${course.title}`, error.message);
            failed++;
        }
    }

    console.log(`\n🎉 İşlem tamamlandı! ${success} başarılı, ${failed} başarısız.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
