import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
    console.log("Eski kategorileri kullanan kurslar aranıyor...\n");
    const categories = await prisma.category.findMany();
    const existingSlugs = new Set(categories.map(c => c.slug));
    
    const courses = await prisma.course.findMany({
        select: { id: true, title: true, category: true }
    });

    let found = 0;
    for (const course of courses) {
        if (course.category && !existingSlugs.has(course.category)) {
            console.log(`- Kurs: "${course.title}"`);
            console.log(`  Bozuk Kategori: ${course.category}\n`);
            found++;
        }
    }
    
    if (found === 0) {
        console.log("Tebrikler! Hatalı (eski) kategori kullanan hiçbir kurs bulunamadı.");
    } else {
        console.log(`Toplam ${found} adet kurs bulundu.`);
    }
}

run().catch(console.error).finally(() => prisma.$disconnect());
