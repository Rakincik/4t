"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// Course CRUD
// ============================================
export async function getCourses() {
    return prisma.course.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            oldPrice: true,
            isActive: true,
            type: true,
            category: true,
            createdAt: true,
            variants: { orderBy: { order: 'asc'} },
            addons: { orderBy: { order: 'asc'} }
        }
    });
}

export async function getCourse(id: string) {
    return prisma.course.findUnique({
        where: { id },
        include: { variants: { orderBy: { order: 'asc'} }, addons: { orderBy: { order: 'asc'} }, coupons: { orderBy: { createdAt: 'desc' } } },
    });
}

function parseFormData(formData: FormData) {
    return {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        color: formData.get("color") as string || "#3B82F6",
        emoji: formData.get("emoji") as string || null,
        subtitle: formData.get("subtitle") as string || null,
        description: formData.get("description") as string || null,
        price: parseFloat(formData.get("price") as string) || 0,
        oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null,
        imageUrl: formData.get("imageUrl") as string || null,
        gallery: formData.get("gallery") ? JSON.parse(formData.get("gallery") as string) : null,
        videoUrl: formData.get("videoUrl") as string || null,
        category: formData.get("category") as string || null,
        type: (formData.get("type") as string || "KURS") as any,
        isActive: formData.get("isActive") === "true",
        isCouponApplicable: formData.get("isCouponApplicable") !== "false",
        sortOrder: formData.get("sortOrder") ? parseInt(formData.get("sortOrder") as string) : 999,
        hours: formData.get("hours") as string || null,
        questions: formData.get("questions") as string || null,
        bookPrice: formData.get("bookPrice") ? parseFloat(formData.get("bookPrice") as string) : null,
        badge: formData.get("badge") as string || null,
        duration: formData.get("duration") as string || null,
        studentCount: formData.get("studentCount") as string || null,
        resources: formData.get("resources") as string || null,
        features: formData.get("features") ? JSON.parse(formData.get("features") as string) : null,
        bentoFeatures: formData.get("bentoFeatures") ? JSON.parse(formData.get("bentoFeatures") as string) : null,
        learningOutcomes: formData.get("learningOutcomes") ? JSON.parse(formData.get("learningOutcomes") as string) : null,
        curriculum: formData.get("curriculum") ? JSON.parse(formData.get("curriculum") as string) : null,
        instructor: formData.get("instructor") ? JSON.parse(formData.get("instructor") as string) : null,
        instructorList: formData.get("instructorList") as string || null,
        episodes: formData.get("episodes") ? JSON.parse(formData.get("episodes") as string) : null,
        cast: formData.get("cast") ? JSON.parse(formData.get("cast") as string) : null,
        tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : null,
        accessEndDate: formData.get("accessEndDate") ? new Date(formData.get("accessEndDate") as string) : null,
        accessDurationDays: formData.get("accessDurationDays") ? parseInt(formData.get("accessDurationDays") as string) : null,
        flixUpsellText: formData.get("flixUpsellText") as string || null,
        flixUpsellLink: formData.get("flixUpsellLink") as string || null,
    };
}

function parseRelations(formData: FormData) {
    const variantsList = formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [];
    const addonsList = formData.get("addons") ? JSON.parse(formData.get("addons") as string) : [];
    const couponsList = formData.get("coupons") ? JSON.parse(formData.get("coupons") as string) : [];

    return {
        variants: variantsList.map((v: any, i: number) => ({ id: v.id, title: v.title, price: Number(v.price), oldPrice: v.oldPrice ? Number(v.oldPrice) : null, order: i, accessDurationDays: v.accessDurationDays ? Number(v.accessDurationDays) : null })),
        addons: addonsList.map((a: any, i: number) => ({ id: a.id, title: a.title, price: Number(a.price), order: i })),
        coupons: couponsList.map((c: any) => {
            const parsedAmount = Number(c.amount);
            if (!parsedAmount || parsedAmount <= 0) {
                throw new Error("Kupon indirimi sıfırdan büyük olmalıdır.");
            }
            return {
                id: c.id,
                code: c.code.toUpperCase(),
                type: c.type,
                amount: parsedAmount,
                maxUses: c.maxUses ? Number(c.maxUses) : null,
                expiresAt: c.expiresAt ? new Date(c.expiresAt) : null,
                isActive: c.isActive
            };
        })
    };
}

function revalidateAll(slug?: string) {
    revalidatePath("/admin/kurslar");
    revalidatePath("/admin/kurslar/[id]", "page");
    revalidatePath("/kurslar");
    revalidatePath("/flix");
    revalidatePath("/kamplar");
    if (slug) revalidatePath(`/kurs/${slug}`);
}

export async function createCourse(formData: FormData) {
    try {
        const data = parseFormData(formData);
        const rels = parseRelations(formData);

        const existing = await prisma.course.findUnique({ where: { slug: data.slug } });
        if (existing) {
            return { success: false, error: "Bu URL adresi (slug) zaten kullanılıyor. Lütfen kurs adını veya URL'sini değiştirin." };
        }

        const course = await prisma.course.create({ 
            data: {
                ...data,
                variants: { create: rels.variants.map((v: any) => ({ title: v.title, price: v.price, oldPrice: v.oldPrice, accessDurationDays: v.accessDurationDays, order: v.order })) },
                addons: { create: rels.addons.map((a: any) => ({ title: a.title, price: a.price, order: a.order })) }
            } 
        });
        // Create coupons linked to this course
        if (rels.coupons.length > 0) {
            for (const c of rels.coupons) {
                await prisma.coupon.create({ data: { code: c.code, type: c.type, amount: c.amount, maxUses: c.maxUses, expiresAt: c.expiresAt, isActive: c.isActive, courseId: course.id } });
            }
        }
        revalidateAll();
        return { success: true, id: course.id };
    } catch (e: any) {
        console.error("Create course error:", e);
        return { success: false, error: e.message || "Kurs oluşturulurken bir hata oluştu." };
    }
}

export async function updateCourse(id: string, formData: FormData) {
    try {
        const data = parseFormData(formData);
        const rels = parseRelations(formData);
        
        const existingSlug = await prisma.course.findUnique({ where: { slug: data.slug } });
        if (existingSlug && existingSlug.id !== id) {
            return { success: false, error: "Bu URL adresi (slug) zaten başka bir paket/kurs tarafından kullanılıyor. Lütfen farklı bir ad seçin." };
        }

        // Varyasyonları yönet
        const existingVariants = await prisma.courseVariant.findMany({ where: { courseId: id } });
        const incomingVariantIds = rels.variants.map((v: any) => v.id).filter(Boolean);
        const variantsToDelete = existingVariants.filter(v => !incomingVariantIds.includes(v.id));

        for (const v of variantsToDelete) {
            try { await prisma.courseVariant.delete({ where: { id: v.id } }); } 
            catch (e: any) { if (e.code === 'P2003') return { success: false, error: `"${v.title}" varyasyonu satın alındığı için silinemez.` }; throw e; }
        }

        // Eklentileri yönet
        const existingAddons = await prisma.courseAddon.findMany({ where: { courseId: id } });
        const incomingAddonIds = rels.addons.map((a: any) => a.id).filter(Boolean);
        const addonsToDelete = existingAddons.filter(a => !incomingAddonIds.includes(a.id));

        for (const a of addonsToDelete) {
            try { await prisma.courseAddon.delete({ where: { id: a.id } }); }
            catch (e: any) { if (e.code === 'P2003') return { success: false, error: `"${a.title}" eklentisi satın alındığı için silinemez.` }; throw e; }
        }
        
        await prisma.course.update({ 
            where: { id }, 
            data: { ...data } 
        });

        for (const v of rels.variants) {
            if (v.id) await prisma.courseVariant.update({ where: { id: v.id }, data: { title: v.title, price: v.price, oldPrice: v.oldPrice, accessDurationDays: v.accessDurationDays, order: v.order } });
            else await prisma.courseVariant.create({ data: { courseId: id, title: v.title, price: v.price, oldPrice: v.oldPrice, accessDurationDays: v.accessDurationDays, order: v.order } });
        }

        for (const a of rels.addons) {
            if (a.id) await prisma.courseAddon.update({ where: { id: a.id }, data: { title: a.title, price: a.price, order: a.order } });
            else await prisma.courseAddon.create({ data: { courseId: id, title: a.title, price: a.price, order: a.order } });
        }

        // Sync coupons: upsert existing, create new, delete removed
        const existingCoupons = await prisma.coupon.findMany({ where: { courseId: id } });
        const submittedIds = rels.coupons.filter((c: any) => c.id).map((c: any) => c.id);
        // Delete removed coupons
        const toDelete = existingCoupons.filter(ec => !submittedIds.includes(ec.id));
        for (const d of toDelete) { await prisma.coupon.delete({ where: { id: d.id } }); }
        // Upsert coupons
        for (const c of rels.coupons) {
            if (c.id) {
                await prisma.coupon.update({ where: { id: c.id }, data: { code: c.code, type: c.type, amount: c.amount, maxUses: c.maxUses, expiresAt: c.expiresAt, isActive: c.isActive } });
            } else {
                await prisma.coupon.create({ data: { code: c.code, type: c.type, amount: c.amount, maxUses: c.maxUses, expiresAt: c.expiresAt, isActive: c.isActive, courseId: id } });
            }
        }
        revalidateAll(data.slug);
        return { success: true };
    } catch (e: any) {
        console.error("Update course error:", e);
        return { success: false, error: e.message || "Kurs güncellenirken bir hata oluştu." };
    }
}

export async function deleteCourse(id: string) {
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

        revalidateAll();
        return { success: true };
    } catch (e: any) {
        console.error("Delete course error:", e);
        return { success: false, error: "Silme işlemi sırasında beklenmeyen bir hata oluştu." };
    }
}

export async function deleteCustomCategory(category: string) {
    if (!category || category.trim() === "") return { error: "Geçersiz kategori adı" };
    
    // Bu kategoriyi kullanan tüm kursların kategorisini sıfırla
    await prisma.course.updateMany({
        where: { category },
        data: { category: null }
    });
    
    revalidateAll();
    return { success: true };
}
