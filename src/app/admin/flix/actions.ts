"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFlixPackages(page: number = 1, limit: number = 12) {
    const where = { type: "FLIX" as any, isDeleted: false };
    const [packages, totalCount] = await Promise.all([
        prisma.course.findMany({
            where,
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                oldPrice: true,
                isActive: true,
                sortOrder: true,
                createdAt: true,
                imageUrl: true,
                _count: { select: { orderItems: true, courseAccess: true } },
                variants: { orderBy: { order: 'asc' } }
            },
        }),
        prisma.course.count({ where })
    ]);
    return { packages, totalCount };
}

export async function getFlixPackage(id: string) {
    return prisma.course.findUnique({ 
        where: { id },
        include: { variants: { orderBy: { order: 'asc'} } }
    });
}

function parseFlixFormData(formData: FormData) {
    return {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        subtitle: formData.get("subtitle") as string || null,
        description: formData.get("description") as string || null,
        price: parseFloat(formData.get("price") as string) || 0,
        oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null,
        imageUrl: formData.get("imageUrl") as string || null,
        videoUrl: formData.get("videoUrl") as string || null,
        category: "flix",
        type: "FLIX" as any,
        isActive: formData.get("isActive") === "true",
        isCouponApplicable: formData.get("isCouponApplicable") !== "false",
        sortOrder: formData.get("sortOrder") ? parseInt(formData.get("sortOrder") as string) : 999,
        hours: formData.get("hours") as string || null,
        questions: formData.get("questions") as string || null,
        bookPrice: formData.get("bookPrice") ? parseFloat(formData.get("bookPrice") as string) : null,
        badge: formData.get("badge") as string || null,
        features: formData.get("features") ? JSON.parse(formData.get("features") as string) : null,
        episodes: formData.get("episodes") ? JSON.parse(formData.get("episodes") as string) : null,
        cast: formData.get("cast") ? JSON.parse(formData.get("cast") as string) : null,
        tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : null,
        instructorList: formData.get("instructorList") as string || null,
    };
}

function parseRelations(formData: FormData) {
    const variantsList = formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [];
    return {
        variants: variantsList.map((v: any, i: number) => ({ id: v.id, title: v.title, price: Number(v.price), oldPrice: v.oldPrice ? Number(v.oldPrice) : null, accessDurationDays: v.accessDurationDays ? Number(v.accessDurationDays) : null, order: i }))
    };
}

function revalidateFlixPaths(slug?: string) {
    revalidatePath("/admin/flix");
    revalidatePath("/flix");
    if (slug) revalidatePath(`/flix/${slug}`);
}

export async function createFlixPackage(formData: FormData) {
    const data = parseFlixFormData(formData);
    const rels = parseRelations(formData);

    const existing = await prisma.course.findUnique({ where: { slug: data.slug } });
    if (existing) {
        throw new Error("Bu URL adresi (slug) zaten kullanılıyor. Lütfen paket adını veya URL'sini değiştirin.");
    }

    const pkg = await prisma.course.create({ 
        data: {
            ...data,
            variants: { create: rels.variants.map((v: any) => ({ title: v.title, price: v.price, oldPrice: v.oldPrice, accessDurationDays: v.accessDurationDays, order: v.order })) }
        }
    });
    revalidateFlixPaths();
    return { success: true, id: pkg.id };
}

export async function updateFlixPackage(id: string, formData: FormData) {
    const data = parseFlixFormData(formData);
    const rels = parseRelations(formData);

    const existingSlug = await prisma.course.findUnique({ where: { slug: data.slug } });
    if (existingSlug && existingSlug.id !== id) {
        throw new Error("Bu URL adresi (slug) zaten başka bir paket tarafından kullanılıyor.");
    }
    
    const existingVariants = await prisma.courseVariant.findMany({ where: { courseId: id } });
    const incomingVariantIds = rels.variants.map((v: any) => v.id).filter(Boolean);
    const variantsToDelete = existingVariants.filter(v => !incomingVariantIds.includes(v.id));

    // Satılmış varyasyonları silmeye çalışırken çökmeyi önlemek için
    for (const v of variantsToDelete) {
        try {
            await prisma.courseVariant.delete({ where: { id: v.id } });
        } catch (e: any) {
            if (e.code === 'P2003') {
                throw new Error(`Silmeye çalıştığınız "${v.title}" seçeneği daha önce satın alındığı için silinemez. Lütfen silmek yerine gizleyin veya adını güncelleyin.`);
            }
            throw e;
        }
    }

    // Ana paketi güncelle
    await prisma.course.update({ 
        where: { id }, 
        data: { ...data }
    });

    // Varyasyonları Upsert (Ekle veya Güncelle) yap
    for (const v of rels.variants) {
        if (v.id) {
            await prisma.courseVariant.update({
                where: { id: v.id },
                data: { title: v.title, price: v.price, oldPrice: v.oldPrice, accessDurationDays: v.accessDurationDays, order: v.order }
            });
        } else {
            await prisma.courseVariant.create({
                data: { courseId: id, title: v.title, price: v.price, oldPrice: v.oldPrice, accessDurationDays: v.accessDurationDays, order: v.order }
            });
        }
    }

    revalidateFlixPaths(data.slug);
    return { success: true };
}

export async function deleteFlixPackage(id: string) {
    try {
        const orderCount = await prisma.orderItem.count({
            where: { courseId: id }
        });

        if (orderCount === 0) {
            await prisma.course.delete({ where: { id } });
        } else {
            const course = await prisma.course.findUnique({ where: { id }, select: { slug: true } });
            const uniqueSlug = course ? `${course.slug}-deleted-${Date.now()}` : `${id}-deleted-${Date.now()}`;
            
            await prisma.course.update({
                where: { id },
                data: {
                    isDeleted: true,
                    isActive: false,
                    slug: uniqueSlug
                }
            });
        }
        revalidateFlixPaths();
        return { success: true };
    } catch (e: any) {
        console.error("Delete flix error:", e);
        return { success: false, error: "Silme işlemi sırasında beklenmeyen bir hata oluştu." };
    }
}
