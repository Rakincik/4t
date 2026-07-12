"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAbandonedCarts() {
    try {
        const carts = await prisma.abandonedCart.findMany({
            where: { isRecovered: false },
            orderBy: { createdAt: "desc" }
        });

        // Fetch all course prices to calculate cart total values
        const coursesDb = await prisma.course.findMany({
            select: { id: true, price: true }
        });
        const priceMap = new Map<string, number>();
        coursesDb.forEach(c => priceMap.set(c.id, c.price));

        // Collect all non-empty emails and phones to look up matching users
        const emails = carts.map(c => c.email).filter(Boolean) as string[];
        const phones = carts.map(c => c.phone).filter(Boolean) as string[];

        // Find registered users with matching email or phone
        const matchingUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { in: emails } },
                    { phone: { in: phones } }
                ]
            },
            select: {
                id: true,
                email: true,
                phone: true
            }
        });

        // Map matching email/phone to their user IDs
        const userMap = new Map<string, string>();
        for (const u of matchingUsers) {
            if (u.email) userMap.set(u.email.toLowerCase(), u.id);
            if (u.phone) userMap.set(u.phone, u.id);
        }

        // Format dates and json to standard types, adding userId if found
        return carts.map(c => {
            let userId: string | null = null;
            if (c.email && userMap.has(c.email.toLowerCase())) {
                userId = userMap.get(c.email.toLowerCase()) || null;
            } else if (c.phone && userMap.has(c.phone)) {
                userId = userMap.get(c.phone) || null;
            }

            // Calculate total cart value
            const coursesList = (c.courses as any[]) || [];
            let cartValue = 0;
            coursesList.forEach(item => {
                if (typeof item.price === "number") {
                    cartValue += item.price;
                } else if (item.id && priceMap.has(item.id)) {
                    cartValue += priceMap.get(item.id) || 0;
                }
            });

            return {
                id: c.id,
                name: c.name || "Misafir Öğrenci",
                email: c.email || "-",
                phone: c.phone || "-",
                courses: coursesList,
                createdAt: c.createdAt.toISOString(),
                userId,
                status: c.status || "PENDING",
                cartValue
            };
        });
    } catch (error) {
        console.error("getAbandonedCarts Error:", error);
        return [];
    }
}

export async function deleteAbandonedCart(id: string) {
    try {
        await prisma.abandonedCart.delete({
            where: { id }
        });
        revalidatePath("/admin/sepet-takip");
        return { success: true };
    } catch (error: any) {
        console.error("deleteAbandonedCart Error:", error);
        return { success: false, error: "Kayıt silinirken hata oluştu." };
    }
}

export async function recoverAbandonedCartAction(id: string) {
    try {
        const cart = await prisma.abandonedCart.findUnique({
            where: { id }
        });
        if (!cart) return { success: false, error: "Sepet kaydı bulunamadı." };

        const courseList = (cart.courses as any[]) || [];
        
        // Extract base course IDs for database verification
        const dbQueryIds = courseList.map(c => {
            if (c.id && c.id.startsWith("flix-")) {
                const parts = c.id.split("-");
                // format: flix-{courseId}-{variantId} or flix-{courseId}-{variantId}-book
                return parts[1]; // courseId
            }
            return c.id;
        }).filter(Boolean);

        const dbCourses = await prisma.course.findMany({
            where: { id: { in: dbQueryIds }, isDeleted: false, isActive: true },
            select: {
                id: true,
                slug: true,
                title: true,
                price: true,
                imageUrl: true,
                isCouponApplicable: true,
                isInstallmentApplicable: true
            }
        });

        const activeCourseIds = new Set(dbCourses.map(c => c.id));

        // Reconstruct the recovered courses list from the saved courses in JSON,
        // but only for those whose base courses are still active in the database.
        const recoveredCourses: any[] = [];
        for (const item of courseList) {
            let baseId = item.id;
            if (item.id && item.id.startsWith("flix-")) {
                const parts = item.id.split("-");
                baseId = parts[1];
            }
            
            if (activeCourseIds.has(baseId)) {
                // If it's a FLIX variant, we might have saved its custom title and price in the JSON.
                // We should use the JSON values if they exist, falling back to the database course values.
                const dbCourse = dbCourses.find(c => c.id === baseId);
                
                recoveredCourses.push({
                    id: item.id || dbCourse?.id,
                    slug: item.slug || dbCourse?.slug,
                    title: item.title || dbCourse?.title,
                    price: typeof item.price === "number" ? item.price : dbCourse?.price,
                    originalPrice: typeof item.originalPrice === "number" ? item.originalPrice : item.price || dbCourse?.price,
                    imageUrl: item.imageUrl || dbCourse?.imageUrl,
                    category: item.category || (item.id?.startsWith("flix-") ? "FLIX" : undefined),
                    isCouponApplicable: item.isCouponApplicable !== undefined ? item.isCouponApplicable : dbCourse?.isCouponApplicable,
                    isInstallmentApplicable: item.isInstallmentApplicable !== undefined ? item.isInstallmentApplicable : dbCourse?.isInstallmentApplicable
                });
            }
        }

        return { success: true, courses: recoveredCourses };
    } catch (error: any) {
        console.error("recoverAbandonedCartAction Error:", error);
        return { success: false, error: error.message || "Sepet yüklenirken hata oluştu." };
    }
}

export async function updateCartStatus(id: string, status: string) {
    try {
        await prisma.abandonedCart.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/admin/sepet-takip");
        return { success: true };
    } catch (error: any) {
        console.error("updateCartStatus Error:", error);
        return { success: false, error: "Durum güncellenirken hata oluştu." };
    }
}

export async function createRecoveryCoupon(name: string, amount: number = 10, customCode?: string) {
    try {
        let code = customCode?.trim().toUpperCase();
        
        if (!code) {
            // Strip non-turkish-alphabetic chars and convert to uppercase for firstName
            const cleanName = name.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "").toUpperCase();
            const firstName = cleanName.trim().split(' ')[0] || "SEPET";
            const randomDigits = Math.floor(100 + Math.random() * 900);
            code = `KRT-${firstName}-${randomDigits}`;
        }

        // Check if coupon code already exists to prevent duplicate key constraint errors
        const existing = await prisma.coupon.findUnique({
            where: { code }
        });
        if (existing) {
            return { success: false, error: `"${code}" kupon kodu zaten mevcut. Lütfen başka bir kod adı yazın.` };
        }

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 hours validity

        const coupon = await prisma.coupon.create({
            data: {
                code,
                type: "PERCENT",
                amount: amount, // custom amount
                minOrder: 0,
                maxUses: 1,
                usedCount: 0,
                isActive: true,
                expiresAt
            }
        });

        return { success: true, code: coupon.code, amount: amount };
    } catch (error: any) {
        console.error("createRecoveryCoupon Error:", error);
        return { success: false, error: error.message || "Kupon üretilirken hata oluştu." };
    }
}
