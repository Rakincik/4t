import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function normalizeTR(str: string) {
    if (!str) return '';
    return str.trim().toLowerCase()
        .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
        .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        const courses = await prisma.course.findMany();
        
        let updated = 0;
        let logs: string[] = [];
        
        for (const course of courses) {
            if (!course.category) continue;
            
            // Tam eşleşme kontrolü (zaten düzgün olanlar)
            const exactMatch = categories.find(c => c.slug === course.category);
            if (exactMatch) continue;
            
            // Eğer tam eşleşmiyorsa eski metni normalize edelim
            const oldCatNormalized = normalizeTR(course.category);
            
            // Hem yeni slug ile hem de yeni ismin normalize edilmiş hali ile kıyaslayalım
            const newCat = categories.find(c => 
                c.slug === oldCatNormalized || 
                normalizeTR(c.name) === oldCatNormalized
            );
            
            if (newCat) {
                logs.push(`Eşleşti: '${course.title}' kursunun kategorisi '${course.category}' yerine '${newCat.slug}' yapıldı.`);
                await prisma.course.update({
                    where: { id: course.id },
                    data: { category: newCat.slug }
                });
                updated++;
            } else {
                // Kategori yoksa yeni oluştur
                const createdCat = await prisma.category.create({
                    data: {
                        name: course.category.replace(" (Eski)", ""),
                        slug: oldCatNormalized,
                        isActive: true
                    }
                });
                // Sonra bağla
                logs.push(`Yeni Kategori Oluşturuldu ve Bağlandı: '${course.category}' -> '${createdCat.name}'`);
                await prisma.course.update({
                    where: { id: course.id },
                    data: { category: createdCat.slug }
                });
                categories.push(createdCat); // Sonraki kurslar için listeye ekle
                updated++;
            }
        }
        
        return NextResponse.json({ success: true, updated, logs });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
