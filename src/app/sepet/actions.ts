"use server";

import prisma from "@/lib/prisma";

export async function validateCouponAction(code: string, cartItems: { id: string; price: number; qty: number }[]) {
    try {
        if (!code) return { error: "Lütfen bir kupon kodu girin." };

        const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } });
        
        if (!coupon) return { error: "Geçersiz kupon kodu." };
        if (!coupon.isActive) return { error: "Bu kupon aktif değil." };
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { error: "Bu kuponun süresi dolmuş." };
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { error: "Bu kupon limitine ulaştı." };

        const normalizedCartItems = cartItems.map(item => {
            if (item.id && typeof item.id === "string" && item.id.startsWith("flix-")) {
                const parts = item.id.split("-");
                const courseId = parts[1];
                const variantId = parts[2] || null;
                return {
                    ...item,
                    originalId: item.id,
                    id: courseId,
                    variantId: variantId
                };
            }
            return {
                ...item,
                originalId: item.id,
                variantId: null
            };
        });

        const courseIds = normalizedCartItems.map(i => i.id);
        const courses = await prisma.course.findMany({
            where: { id: { in: courseIds } },
            select: { id: true, isCouponApplicable: true }
        });

        let totalAmount = 0;
        let discountableAmount = 0;
        let isCouponValidForItem = false;

        normalizedCartItems.forEach(item => {
            const course = courses.find(c => c.id === item.id);
            const isApplicable = course?.isCouponApplicable ?? true;
            
            const itemTotal = (item.price * item.qty);
            totalAmount += itemTotal;
            
            let isThisItemMatch = true;
            if (coupon.courseId) {
                if (item.id !== coupon.courseId) {
                    isThisItemMatch = false;
                } else if (coupon.variantId && item.variantId !== coupon.variantId) {
                    isThisItemMatch = false;
                }
            } else {
                // Global kuponlar için hariç tutulanları kontrol et
                const excludedCourses = (coupon.excludedCourseIds as string[]) || [];
                const excludedVariants = (coupon.excludedVariantIds as string[]) || [];
                if (excludedCourses.includes(item.id)) {
                    isThisItemMatch = false;
                } else if (item.variantId && excludedVariants.includes(item.variantId)) {
                    isThisItemMatch = false;
                }
            }

            if (isThisItemMatch && isApplicable) {
                discountableAmount += itemTotal;
                isCouponValidForItem = true;
            }
        });

        if (coupon.courseId && !isCouponValidForItem) {
            return { error: "Bu kupon sepetinizdeki ürünler için geçerli değil veya seçili üründe kupon kullanımı kapalıdır." };
        }

        if (discountableAmount === 0) {
            return { error: "Sepetinizdeki ürünler indirim kuponu kullanımına kapalıdır veya bu kuponun geçerli olmadığı ürünlerdir." };
        }

        if (coupon.minOrder && totalAmount < coupon.minOrder) {
            return { error: `Kuponu kullanmak için minimum ₺${coupon.minOrder} tutarında sipariş vermelisiniz.` };
        }

        return { 
            success: true, 
            coupon: {
                id: coupon.id,
                code: coupon.code,
                type: coupon.type,
                amount: coupon.amount,
                courseId: coupon.courseId,
                variantId: coupon.variantId,
                excludedCourseIds: coupon.excludedCourseIds,
                excludedVariantIds: coupon.excludedVariantIds
            }
        };
    } catch (error) {
        console.error("Coupon Validation Error:", error);
        return { error: "Kupon doğrulanırken bir hata oluştu." };
    }
}

export async function getRecommendedCoursesAction(excludeIds: string[]) {
    try {
        // Sepetteki kursları çekip adminin elle belirlediği öneri ID'lerini toplayalım
        const cartCourses = await prisma.course.findMany({
            where: { id: { in: excludeIds } },
            select: { recommendedCourseIds: true }
        });

        let manualIds: string[] = [];
        cartCourses.forEach((c: any) => {
            if (c.recommendedCourseIds && Array.isArray(c.recommendedCourseIds)) {
                manualIds = [...manualIds, ...c.recommendedCourseIds];
            }
        });

        // Sepette halihazırda olanları ve mükerrer kayıtları temizleyelim
        manualIds = Array.from(new Set(manualIds)).filter(id => !excludeIds.includes(id));

        let recommendedCourses: any[] = [];

        // 1. Eğer admin elle önerilen kurs eklediyse onları yükleyelim
        if (manualIds.length > 0) {
            recommendedCourses = await prisma.course.findMany({
                where: {
                    id: { in: manualIds },
                    isActive: true,
                    isDeleted: false
                },
                take: 3,
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    price: true,
                    oldPrice: true,
                    imageUrl: true,
                    category: true,
                    isCouponApplicable: true,
                    isInstallmentApplicable: true,
                }
            });
        }

        // 2. Eğer elle eklenen kurs sayısı 3'ten azsa veya hiç yoksa otomatik öneriyle tamamlayalım
        if (recommendedCourses.length < 3) {
            const currentRecIds = recommendedCourses.map(c => c.id);
            const remainingToTake = 3 - recommendedCourses.length;

            const autoCourses = await prisma.course.findMany({
                where: {
                    id: { notIn: [...excludeIds, ...currentRecIds] },
                    isActive: true,
                    isDeleted: false
                },
                take: remainingToTake,
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    price: true,
                    oldPrice: true,
                    imageUrl: true,
                    category: true,
                    isCouponApplicable: true,
                    isInstallmentApplicable: true,
                }
            });

            recommendedCourses = [...recommendedCourses, ...autoCourses];
        }

        return { success: true, courses: recommendedCourses };
    } catch (err: any) {
        console.error("Recommendations Fetch Error:", err);
        return { success: false, error: err.message };
    }
}
