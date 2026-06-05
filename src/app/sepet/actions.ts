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

        const courseIds = cartItems.map(i => i.id);
        const courses = await prisma.course.findMany({
            where: { id: { in: courseIds } },
            select: { id: true, isCouponApplicable: true }
        });

        let totalAmount = 0;
        let discountableAmount = 0;
        let isCourseInCart = false;

        cartItems.forEach(item => {
            const course = courses.find(c => c.id === item.id);
            const isApplicable = course?.isCouponApplicable ?? true;
            
            const itemTotal = (item.price * item.qty);
            totalAmount += itemTotal;
            
            if (isApplicable) {
                discountableAmount += itemTotal;
            }

            if (coupon.courseId && item.id === coupon.courseId && isApplicable) {
                isCourseInCart = true;
            }
        });

        if (discountableAmount === 0) {
            return { error: "Sepetinizdeki ürünler indirim kuponu kullanımına kapalıdır." };
        }

        if (coupon.minOrder && totalAmount < coupon.minOrder) {
            return { error: `Kuponu kullanmak için minimum ₺${coupon.minOrder} tutarında sipariş vermelisiniz.` };
        }

        if (coupon.courseId && !isCourseInCart) {
            return { error: "Bu kupon sepetinizdeki ürünler için geçerli değil veya seçili üründe kupon kullanımı kapalıdır." };
        }

        return { 
            success: true, 
            coupon: {
                id: coupon.id,
                code: coupon.code,
                type: coupon.type,
                amount: coupon.amount,
                courseId: coupon.courseId
            }
        };
    } catch (error) {
        console.error("Coupon Validation Error:", error);
        return { error: "Kupon doğrulanırken bir hata oluştu." };
    }
}
