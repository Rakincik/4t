import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";
import axios from "axios";

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
        const { 
            items, 
            customerName, 
            customerPhone, 
            customerEmail, 
            paymentMethod, 
            couponCode, 
            customerTc, 
            customerCity, 
            customerDistrict, 
            customerAddress,
            cardHolderName,
            cardNumber,
            expMonth,
            expYear,
            cvc,
            installmentNumber
        } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Sepetiniz boş." }, { status: 400 });
        }

        // 3. Fiyat Doğrulama (DB'den çek)
        const courseIds = items.map((i: any) => i.id);
        const courses = await prisma.course.findMany({
            where: {
                OR: [
                    { id: { in: courseIds } },
                    { slug: { in: courseIds } }
                ]
            }
        });

        if (courses.length === 0) {
            return NextResponse.json({ error: "Geçerli bir kurs bulunamadı." }, { status: 400 });
        }

        // 4. Toplam Sepet Tutarı ve OrderItem hazırlığı
        let totalAmount = 0;
        const orderItemsToCreate = [];

        for (const item of items) {
            const course = courses.find(c => c.id === item.id || c.slug === item.id);
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

        const isCC = paymentMethod === "Kredi Kartı";

        // 5. Siparişi Oluştur (PENDING)
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId,
                totalAmount,
                status: "PENDING", // Moka durumunda da ilk başta PENDING başlar, callback'te PAID veya FAILED olur
                customerName: customerName || token.name,
                customerEmail: customerEmail || token.email,
                customerPhone,
                customerTc,
                customerCity,
                customerDistrict,
                customerAddress,
                notes: `Ödeme Yöntemi: ${paymentMethod || "EFT / Havale"}`,
                couponId: couponId,
                items: {
                    create: orderItemsToCreate
                }
            }
        });

        // 5.5 Kredi Kartı ise Moka POS ile Ödeme Başlat
        if (isCC) {
            try {
                const mokaDealerCode = process.env.MOKA_DEALER_CODE || "1731";
                const mokaUsername = process.env.MOKA_USERNAME || "TestMoka2";
                const mokaPassword = process.env.MOKA_PASSWORD || "HYSYHDS8DU8HU";
                const isTest = process.env.MOKA_IS_TEST !== "false";

                const baseUrl = isTest ? "https://service.refmokaunited.com" : "https://service.mokaunited.com";
                
                // CheckKey hesaplama: SHA256(DealerCode + "MK" + Username + "PD" + Password)
                const checkKeyRaw = mokaDealerCode + "MK" + mokaUsername + "PD" + mokaPassword;
                const checkKey = crypto.createHash("sha256").update(checkKeyRaw).digest("hex");

                // Temiz IP adresi
                const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

                // ExpYear 4 hane olmalı
                let formattedExpYear = expYear.trim();
                if (formattedExpYear.length === 2) {
                    formattedExpYear = "20" + formattedExpYear;
                }

                // Redirect URL
                const redirectUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/checkout/moka-callback`;

                const mokaPayload = {
                    PaymentDealerAuthentication: {
                        DealerCode: mokaDealerCode,
                        Username: mokaUsername,
                        Password: mokaPassword,
                        CheckKey: checkKey
                    },
                    PaymentDealerRequest: {
                        CardHolderFullName: cardHolderName.trim(),
                        CardNumber: cardNumber.replace(/\D/g, ""),
                        ExpMonth: expMonth.padStart(2, "0"),
                        ExpYear: formattedExpYear,
                        CvcNumber: cvc.trim(),
                        CardToken: "",
                        Amount: totalAmount,
                        Currency: "TL",
                        InstallmentNumber: Number(installmentNumber) || 1,
                        ClientIP: clientIp,
                        OtherTrxCode: orderNumber,
                        IsPoolPayment: 0,
                        IsPreAuth: 0,
                        IsTokenized: 0,
                        Software: "4T Akademi",
                        Description: `${orderNumber} Nolu Sipariş Ödemesi`,
                        ReturnHash: 1,
                        RedirectUrl: redirectUrl,
                        RedirectType: 0,
                        BuyerInformation: {
                            BuyerFullName: customerName || token.name || "Müşteri",
                            BuyerGsmNumber: customerPhone.replace(/\D/g, "").slice(-10),
                            BuyerEmail: customerEmail || token.email || "email@4takademi.com",
                            BuyerAddress: `${customerAddress} ${customerDistrict} / ${customerCity}`.substring(0, 150)
                        }
                    }
                };

                const response = await axios.post(`${baseUrl}/PaymentDealer/DoDirectPaymentThreeD`, mokaPayload);

                if (response.data && response.data.ResultCode === "Success" && response.data.Data?.Url) {
                    const mokaUrl = response.data.Data.Url;
                    const codeForHash = response.data.Data.CodeForHash;

                    // Siparişi codeForHash ile güncelle
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { 
                            codeForHash,
                            notes: `Ödeme Yöntemi: Kredi Kartı (3D Başlatıldı). CodeForHash: ${codeForHash}`
                        }
                    });

                    return NextResponse.json({ success: true, redirectUrl: mokaUrl, orderId: order.id });
                } else {
                    const resultMessage = response.data?.ResultMessage || "Moka API'den geçersiz yanıt alındı.";
                    const resultCode = response.data?.ResultCode || "MokaError";
                    
                    // Siparişi FAILED durumuna getir
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { 
                            status: "FAILED",
                            notes: `Ödeme Başlatılamadı. Hata Kodu: ${resultCode}, Mesaj: ${resultMessage}`
                        }
                    });

                    return NextResponse.json({ 
                        error: `Ödeme işlemi başlatılamadı: ${resultMessage} (Kod: ${resultCode})` 
                    }, { status: 400 });
                }
            } catch (err: any) {
                console.error("Moka Payment Initiation Error:", err);
                
                await prisma.order.update({
                    where: { id: order.id },
                    data: { 
                        status: "FAILED",
                        notes: `Sistem Ödeme Hatası: ${err.message || err}`
                    }
                });

                return NextResponse.json({ 
                    error: "Ödeme entegrasyonu sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyiniz." 
                }, { status: 500 });
            }
        }

        // 6. Sonuç dön (EFT/Havale için)
        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error: any) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ 
            error: "Sipariş oluşturulurken beklenmeyen bir hata meydana geldi.",
            details: error?.message || String(error),
            stack: error?.stack
        }, { status: 500 });
    }

}
