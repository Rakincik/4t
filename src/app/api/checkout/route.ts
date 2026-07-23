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

        // 3. Fiyat Doğrulama (Önce ID'leri normalize et ve DB'den çek)
        const normalizedItems = items.map((item: any) => {
            if (item.id && typeof item.id === "string" && item.id.startsWith("flix-")) {
                const parts = item.id.split("-");
                const courseId = parts[1];
                const variantId = parts[2] || null;
                const hasBook = parts.includes("book");
                return {
                    id: courseId,
                    qty: item.qty,
                    variantId: variantId || item.variantId || null,
                    selectedAddonIds: hasBook ? ["flix-book"] : (item.selectedAddonIds || [])
                };
            }
            return {
                id: item.id,
                qty: item.qty,
                variantId: item.variantId || null,
                selectedAddonIds: item.selectedAddonIds || []
            };
        });

        const courseIds = normalizedItems.map((i: any) => i.id);
        const courses = await prisma.course.findMany({
            where: {
                OR: [
                    { id: { in: courseIds } },
                    { slug: { in: courseIds } }
                ]
            },
            include: {
                variants: true,
                addons: true
            }
        });

        if (courses.length === 0) {
            return NextResponse.json({ error: "Geçerli bir kurs bulunamadı." }, { status: 400 });
        }

        // 4. Toplam Sepet Tutarı ve OrderItem hazırlığı
        let totalAmount = 0;
        const orderItemsToCreate = [];

        for (const item of normalizedItems) {
            const course = courses.find(c => c.id === item.id || c.slug === item.id);
            if (!course) continue;

            const qty = Number(item.qty) || 1;
            
            // 4.1 Fiyat Belirleme
            let basePrice = course.price;
            let chosenVariantId = null;

            if (item.variantId) {
                const variant = course.variants.find(v => v.id === item.variantId);
                if (variant) {
                    basePrice = variant.price;
                    chosenVariantId = variant.id;
                }
            } else if (course.variants && course.variants.length > 0) {
                basePrice = course.variants[0].price;
                chosenVariantId = course.variants[0].id;
            }

            // 4.2 Eklenti (Addons) Fiyatlarını Ekle
            let addonsTotal = 0;
            const addonItemsToCreate = [];

            if (item.selectedAddonIds && Array.isArray(item.selectedAddonIds)) {
                for (const addonId of item.selectedAddonIds) {
                    if (addonId === "flix-book") {
                        const flixBookPrice = course.bookPrice || 0;
                        addonsTotal += flixBookPrice;
                        addonItemsToCreate.push({
                            addonName: "Kitap Seti",
                            price: flixBookPrice
                        });
                    } else {
                        const addon = course.addons.find(a => a.id === addonId);
                        if (addon) {
                            addonsTotal += addon.price;
                            addonItemsToCreate.push({
                                addonId: addon.id,
                                addonName: addon.title,
                                price: addon.price
                            });
                        }
                    }
                }
            }

            const itemPrice = basePrice + addonsTotal;
            totalAmount += (itemPrice * qty);

            orderItemsToCreate.push({
                courseId: course.id,
                variantId: chosenVariantId,
                price: itemPrice,
                quantity: qty,
                addons: addonItemsToCreate.length > 0 ? {
                    create: addonItemsToCreate
                } : undefined
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
            
            // Eğer kupon belli bir kursa/seçeneğe bağlıysa sepette onun kontrolü
            let discountableAmount = 0;
            let hasMatchingItem = false;
            
            for (const item of orderItemsToCreate) {
                let matches = true;
                if (coupon.courseId) {
                    if (item.courseId !== coupon.courseId) {
                        matches = false;
                    } else if (coupon.variantId && item.variantId !== coupon.variantId) {
                        matches = false;
                    }
                } else {
                    // Global kuponlar için hariç tutulanları kontrol et
                    const excludedCourses = (coupon.excludedCourseIds as string[]) || [];
                    const excludedVariants = (coupon.excludedVariantIds as string[]) || [];
                    if (excludedCourses.includes(item.courseId)) {
                        matches = false;
                    } else if (item.variantId && excludedVariants.includes(item.variantId)) {
                        matches = false;
                    }
                }
                
                if (matches) {
                    discountableAmount += (item.price * item.quantity);
                    hasMatchingItem = true;
                }
            }

            if (discountableAmount === 0 || (coupon.courseId && !hasMatchingItem)) {
                return NextResponse.json({ error: "Bu kupon sepetinizdeki ürünler için geçerli değil veya seçili üründe kupon kullanımı kapalıdır." }, { status: 400 });
            }

            couponId = coupon.id;
            
            // İndirim uygulama işlemi
            let discount = 0;
            if (coupon.type === "PERCENT") {
                discount = (discountableAmount * coupon.amount) / 100;
            } else {
                discount = coupon.amount;
            }
            if (discount > discountableAmount) discount = discountableAmount;
            
            totalAmount -= discount;
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

        if (isCC && Number(installmentNumber) > 6) {
            return NextResponse.json({ error: "En fazla 6 taksit seçilebilir." }, { status: 400 });
        }

        // Son 30 dakikada bu kullanıcının başarısız (FAILED) siparişi varsa,
        // admin panelinde kirlilik yaratmaması için onu temizliyoruz (Cascade ile alt kalemler de silinir)
        try {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
            const oldFailedOrder = await prisma.order.findFirst({
                where: {
                    userId,
                    status: "FAILED",
                    createdAt: { gte: thirtyMinutesAgo }
                }
            });
            if (oldFailedOrder) {
                await prisma.order.delete({
                    where: { id: oldFailedOrder.id }
                });
            }
        } catch (cleanupErr) {
            console.error("Old failed order cleanup error:", cleanupErr);
        }

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

        // 5.2 EFT ise terk edilmiş sepeti kurtarıldı olarak işaretle
        if (!isCC) {
            await prisma.abandonedCart.updateMany({
                where: {
                    OR: [
                        customerEmail ? { email: customerEmail } : undefined,
                        customerPhone ? { phone: customerPhone } : undefined
                    ].filter(Boolean) as any,
                    isRecovered: false
                },
                data: {
                    isRecovered: true
                }
            }).catch(err => console.error("EFT abandoned cart recovery error:", err));
        }

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

                // Daha Güçlü IP Yakalama (Cloudflare, Nginx, Vercel uyumlu)
                let rawIp = 
                    req.headers.get("cf-connecting-ip") || 
                    req.headers.get("true-client-ip") ||
                    req.headers.get("x-real-ip") || 
                    req.headers.get("x-forwarded-for")?.split(",")[0] || 
                    req.headers.get("x-client-ip") ||
                    (req as any).ip || 
                    "127.0.0.1";

                let clientIp = rawIp.trim();
                
                // IPv6 ile port temizliği (örn: [2001:db8::1]:8080)
                if (clientIp.startsWith("[") && clientIp.includes("]")) {
                    const match = clientIp.match(/^\[(.*?)\]/);
                    if (match) {
                        clientIp = match[1];
                    }
                } else if (clientIp.includes(".") && clientIp.includes(":")) {
                    // IPv4 port temizliği (örnek: 192.168.1.1:8080)
                    const parts = clientIp.split(":");
                    if (parts.length >= 2) {
                        clientIp = parts[0];
                    }
                }

                // IPv4-mapped IPv6 adresini temizle (örnek: ::ffff:192.168.1.1 -> 192.168.1.1)
                if (clientIp.startsWith("::ffff:")) {
                    clientIp = clientIp.substring(7);
                }

                // Banka Sanal POS sistemleri IP adresini genellikle VARCHAR(15) olarak tutar.
                // Eğer IP adresi hala IPv6 formatındaysa ve 15 karakterden uzunsa (örn: 2a02:4e0:5615:... gibi)
                // Banka DB tarafında SL890 Teknik Hata patlamaması için geçerli formata uydurmamız veya IPv4 formatında bir değer göndermemiz gerekebilir.
                // Ancak TCMB gerçek IP istediği için öncelikle IP'yi olduğu gibi bırakıyoruz, sadece 15 karakter sınırını aşıyorsa ve IPv6 ise,
                // Moka'nın yeni sistemi IPv6 destekleyene kadar geçici bir Türkiye IPv4'ü atıyoruz ki ödemeler geçsin. 
                // Not: Eğer sunucu doğrudan IPv6 veriyorsa ve banka reddediyorsa bu en güvenli "fallback" yöntemidir.
                if (clientIp.includes(":") && clientIp.length > 15) {
                    clientIp = "185.163.111.111"; // Fallback Türkiye IP'si (Teknik hata almamak için)
                }

                // Eğer localhost'taysak veya IP alınamadıysa Moka'nın "8.8.8.8" (Google DNS) gibi blacklist'e aldığı IP'leri göndermemek için
                // geçerli görünümlü bir Türkiye / Standart IP'si gönderiyoruz.
                if (!isTest && (clientIp === "127.0.0.1" || clientIp === "::1" || !clientIp)) {
                    clientIp = "185.163.111.111"; // Fallback valid IP instead of 8.8.8.8 which might trigger fraud rules
                }

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
                    const resultMessage = response.data?.ResultMessage || "";
                    const resultCode = response.data?.ResultCode || "MokaError";
                    const friendlyMessage = mapMokaErrorToTurkish(resultCode, resultMessage);
                    
                    // Siparişi FAILED durumuna getir
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { 
                            status: "FAILED",
                            notes: `Ödeme Başlatılamadı. Hata Kodu: ${resultCode}, Mesaj: ${resultMessage || friendlyMessage}`
                        }
                    });

                    // Kupon kullanım sayacını geri düşür
                    if (couponId) {
                        await prisma.coupon.update({
                            where: { id: couponId },
                            data: { usedCount: { decrement: 1 } }
                        }).catch(err => console.error("Coupon decrement error:", err));
                    }

                    return NextResponse.json({ 
                        error: `${friendlyMessage} (Kod: ${resultCode})` 
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

                // Kupon kullanım sayacını geri düşür
                if (couponId) {
                    await prisma.coupon.update({
                        where: { id: couponId },
                        data: { usedCount: { decrement: 1 } }
                    }).catch(err => console.error("Coupon decrement error:", err));
                }

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

function mapMokaErrorToTurkish(resultCode: string, resultMessage: string): string {
    const code = (resultCode || "").trim();
    
    if (code.includes("Fraud.BuyerBlocked")) {
        return "Güvenlik nedeniyle bu kart veya IP adresi ile şu an ödeme yapılamamaktadır. Lütfen başka bir kartla deneyiniz veya bankanızla görüşünüz.";
    }
    if (code.includes("InvalidCardInfo") || code.includes("CheckCardInfo.InvalidCardInfo")) {
        return "Girdiğiniz kart bilgileri (kart numarası, son kullanma tarihi veya CVC) geçersizdir. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.";
    }
    if (code.includes("InsufficientFunds") || code.includes("InsufficientBalance")) {
        return "Kartınızın limiti yetersizdir. Lütfen limitinizi kontrol edip tekrar deneyiniz.";
    }
    if (code.includes("CardExpired") || code.includes("ExpiredCard")) {
        return "Kartınızın son kullanma tarihi dolmuştur. Lütfen geçerli bir kart kullanınız.";
    }
    if (code.includes("IncorrectCvc") || code.includes("IncorrectCvcNumber") || code.includes("CvcError")) {
        return "Girdiğiniz CVC/güvenlik kodu hatalıdır. Lütfen kontrol edip tekrar deneyiniz.";
    }
    if (code.includes("CardNotActive") || code.includes("CardBlocked") || code.includes("BlockedCard")) {
        return "Kartınız internet alışverişlerine veya kullanıma kapalıdır. Lütfen bankanızla görüşünüz.";
    }
    if (code.includes("DoNotHonor")) {
        return "İşlem bankanız tarafından onaylanmadı. Lütfen internet alışveriş limitinizi ve yetkilerini kontrol edip tekrar deneyiniz.";
    }
    if (code.includes("TransactionNotAllowed") || code.includes("TransactionNotAllowedForCardholder")) {
        return "Kart sahibi bu işlemi gerçekleştiremez. Lütfen bankanızla görüşerek kartınızın e-ticaret iznini kontrol ediniz.";
    }
    if (code.includes("RestrictedCard")) {
        return "Kısıtlı kart. Lütfen başka bir kartla deneyiniz veya bankanızla görüşünüz.";
    }
    if (code.includes("InstallmentNotAvailableForForeignCurrency")) {
        return "Yabancı para işlemlerinde taksit işlemi uygulanamaz.";
    }
    if (code.includes("ThisInstallmentNumberNotAvailableForDealer") || code.includes("ThisInstallmentNumberNotAvailableForVirtualPos")) {
        return "Seçtiğiniz taksit sayısı bayi hesabınızda veya sanal pos altyapısında tanımlı değildir.";
    }
    if (code.includes("ChannelPermissionNotAvailable")) {
        return "Moka ödeme kanalı yetkilendirmesi bulunamadı. Lütfen Moka destek ekibi ile iletişime geçiniz.";
    }

    return resultMessage || "Ödeme işlemi banka veya Moka tarafından reddedildi.";
}

