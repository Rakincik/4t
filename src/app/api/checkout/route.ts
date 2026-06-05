import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
    try {
        // 1. Auth Kontrolü
        const token = await getToken({ req });
        if (!token || !token.sub) {
            return NextResponse.json({ error: "Sipariş oluşturmak için giriş yapmanız gerekmektedir." }, { status: 401 });
        }

        const userId = token.sub;

        // 2. Request okuma
        const body = await req.json();
        const { items, customerName, customerPhone, customerEmail, paymentMethod, couponCode, customerTc, customerCity, customerDistrict, customerAddress } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Sepetiniz boş." }, { status: 400 });
        }

        // 3. Fiyat Doğrulama (DB'den çek)
        const courseIds = items.map((i: any) => i.id);
        const courses = await prisma.course.findMany({
            where: { id: { in: courseIds } }
        });

        if (courses.length === 0) {
            return NextResponse.json({ error: "Geçerli bir kurs bulunamadı." }, { status: 400 });
        }

        // 4. Toplam Sepet Tutarı ve OrderItem hazırlığı
        let totalAmount = 0;
        const orderItemsToCreate = [];

        for (const item of items) {
            const course = courses.find(c => c.id === item.id);
            if (!course) continue;

            const qty = Number(item.qty) || 1;
            const price = course.price;
            totalAmount += (price * qty);

            orderItemsToCreate.push({
                courseId: course.id,
                price: price,
                quantity: qty
            });
        }

        // 4.5 Kupon Doğrulama
        let couponId = null;
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
            if (!coupon) {
                return NextResponse.json({ error: "Geçersiz kupon kodu." }, { status: 400 });
            }
            if (!coupon.isActive) {
                return NextResponse.json({ error: "Bu kupon aktif değil." }, { status: 400 });
            }
            if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
                return NextResponse.json({ error: "Bu kuponun süresi dolmuş." }, { status: 400 });
            }
            if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
                return NextResponse.json({ error: "Bu kupon limitine ulaştı." }, { status: 400 });
            }
            if (coupon.minOrder && totalAmount < coupon.minOrder) {
                return NextResponse.json({ error: `Kuponu kullanmak için minimum ₺${coupon.minOrder} tutarında sipariş vermelisiniz.` }, { status: 400 });
            }
            
            // Eğer kupon belli bir kursa bağlıysa sepette o kursun kontrolü
            if (coupon.courseId && !orderItemsToCreate.some(i => i.courseId === coupon.courseId)) {
                return NextResponse.json({ error: "Bu kupon sepetinizdeki ürünler için geçerli değil." }, { status: 400 });
            }

            couponId = coupon.id;
            
            // İndirim uygulama işlemi (Şimdilik fiyatlar ön tarafta da hesaplanabileceği için backend sadece orders'a yazıp kullanimi arttırır)
            if (coupon.type === "PERCENT") {
                totalAmount -= (totalAmount * coupon.amount) / 100;
            } else {
                totalAmount -= coupon.amount;
            }
            if (totalAmount < 0) totalAmount = 0;
            
            // Kullanım miktarını artır
            await prisma.coupon.update({
                where: { id: coupon.id },
                data: { usedCount: { increment: 1 } }
            });
        }

        // Benzersiz sipariş numarası üret (Örn: 4T-240418-1934)
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `4T-${dateStr}-${randomStr}`;

        // 5. Siparişi Oluştur (PENDING)
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId,
                totalAmount,
                status: "PENDING", // Her halükarda EFT/Havale "PENDING" başlar
                customerName: customerName || token.name,
                customerEmail: customerEmail || token.email,
                customerPhone,
                customerTc,
                customerCity,
                customerDistrict,
                customerAddress,
                // EFT açıklaması
                notes: `Ödeme Yöntemi: ${paymentMethod || "EFT / Havale"}`,
                couponId: couponId,
                items: {
                    create: orderItemsToCreate
                }
            }
        });

        // 6. Sonuç dön
        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ error: "Sipariş oluşturulurken beklenmeyen bir hata meydana geldi." }, { status: 500 });
    }
}
