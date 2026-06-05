import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'kurslar_backup.json');
        
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "kurslar_backup.json bulunamadı! Lütfen root dizinine yüklediğinizden emin olun." }, { status: 404 });
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        const courses = JSON.parse(data);

        let addedCount = 0;
        let skipCount = 0;
        let errors: any[] = [];

        for (const item of courses) {
            try {
                const existing = await prisma.course.findUnique({
                    where: { slug: item.slug }
                });

                if (!existing) {
                    const { 
                        id, createdAt, updatedAt, 
                        variants, addons, coupons, 
                        ...baseData 
                    } = item;

                    await prisma.course.create({
                        data: {
                            ...baseData,
                            variants: variants?.length > 0 ? {
                                create: variants.map((v: any) => { const {id, courseId, ...clean} = v; return clean; })
                            } : undefined,
                            addons: addons?.length > 0 ? {
                                create: addons.map((a: any) => { const {id, courseId, ...clean} = a; return clean; })
                            } : undefined,
                            coupons: coupons?.length > 0 ? {
                                create: coupons.map((c: any) => { const {id, courseId, ...clean} = c; return clean; })
                            } : undefined
                        }
                    });
                    addedCount++;
                } else {
                    skipCount++;
                }
            } catch (err: any) {
                console.error(`Error adding course ${item.slug}:`, err);
                errors.push({ slug: item.slug, error: err.message });
            }
        }

        return NextResponse.json({
            message: "Tüm sistem Import edildi!",
            total_in_file: courses.length,
            added: addedCount,
            skipped_duplicates: skipCount,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (e: any) {
        console.error("Import Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
