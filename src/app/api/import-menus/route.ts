import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'menus_backup.json');
        
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "menus_backup.json bulunamadı!" }, { status: 404 });
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        const menus = JSON.parse(data);

        let addedCount = 0;
        let skipCount = 0;
        let errors: any[] = [];

        for (const item of menus) {
            try {
                const existing = await prisma.menu.findUnique({
                    where: { slug: item.slug }
                });

                if (existing) {
                    // Delete existing menu so we can completely wipe it and recreate with nested items (avoids complex nested upserts)
                    await prisma.menu.delete({ where: { id: existing.id } });
                }

                const { 
                    id, createdAt, updatedAt, 
                    items,
                    ...baseData 
                } = item;

                await prisma.menu.create({
                    data: {
                        ...baseData,
                        items: items?.length > 0 ? {
                            create: items.map((i: any) => { 
                                const {id, menuId, children, parentId, ...clean} = i; 
                                return {
                                    ...clean,
                                    children: children?.length > 0 ? {
                                        create: children.map((c: any) => {
                                            const {id, menuId, parentId, ...cClean} = c;
                                            return cClean;
                                        })
                                    } : undefined
                                }; 
                            })
                        } : undefined
                    }
                });
                addedCount++;
            } catch (err: any) {
                console.error(`Error adding menu ${item.slug}:`, err);
                errors.push({ slug: item.slug, error: err.message });
            }
        }

        return NextResponse.json({
            message: "Menüler Import edildi!",
            total_in_file: menus.length,
            added: addedCount,
            skipped_duplicates: skipCount,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (e: any) {
        console.error("Import Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
