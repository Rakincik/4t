import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendMetaCAPI } from "@/lib/meta-capi";

export async function POST(req: NextRequest) {
    try {
        // Moka redirects are POST requests with application/x-www-form-urlencoded content
        const formData = await req.formData();
        
        const hashValue = formData.get("hashValue")?.toString();
        const resultCode = formData.get("resultCode")?.toString();
        const resultMessage = formData.get("resultMessage")?.toString();
        const trxCode = formData.get("trxCode")?.toString();
        const OtherTrxCode = formData.get("OtherTrxCode")?.toString(); // This is the order number we sent (e.g. 4T-...)

        console.log("Moka Callback Triggered:", {
            hashValue,
            resultCode,
            resultMessage,
            trxCode,
            OtherTrxCode
        });

        if (!OtherTrxCode) {
            return NextResponse.redirect(
                new URL("/checkout/error?error=Siparis numarasi eksik.", process.env.NEXTAUTH_URL || req.url).toString(),
                303
            );
        }

        // Siparişi ve sipariş kalemlerini kurs bilgileriyle birlikte çek
        const order = await prisma.order.findUnique({
            where: { orderNumber: OtherTrxCode },
            include: {
                user: { select: { email: true, name: true, phone: true } },
                items: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.redirect(
                new URL(`/checkout/error?error=Siparis (${OtherTrxCode}) bulunamadi.`, process.env.NEXTAUTH_URL || req.url).toString(),
                303
            );
        }

        // Eğer sipariş zaten ödenmişse doğrudan başarı sayfasına yönlendir (yinelenen çağrılar için koruma)
        if (order.status === "PAID") {
            return NextResponse.redirect(
                new URL(`/checkout/success?orderId=${order.id}&method=cc`, process.env.NEXTAUTH_URL || req.url).toString(),
                303
            );
        }

        const codeForHash = order.codeForHash;
        if (!codeForHash) {
            return NextResponse.redirect(
                new URL(`/checkout/error?error=Siparis icin guvenlik kodu (codeForHash) bulunamadi.&orderId=${order.id}`, process.env.NEXTAUTH_URL || req.url).toString(),
                303
            );
        }

        // Hash Doğrulama Algoritması
        // Başarılı ödeme hash'i: SHA256(CodeForHash.toUpperCase() + "T")
        // Başarısız ödeme hash'i: SHA256(CodeForHash.toUpperCase() + "F")
        const upperCodeForHash = codeForHash.toUpperCase();
        const hashValue1 = crypto.createHash("sha256").update(upperCodeForHash + "T").digest("hex");
        const hashValue2 = crypto.createHash("sha256").update(upperCodeForHash + "F").digest("hex");

        const isSuccess = hashValue === hashValue1;
        const isFailed = hashValue === hashValue2;

        if (isSuccess) {
            // 1. Siparişi PAID olarak güncelle
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "PAID",
                    notes: `Ödeme Kredi Kartı ile başarıyla tahsil edildi. Moka TrxCode: ${trxCode || "Yok"}`
                }
            });

            // Terk edilmiş sepeti kurtarıldı olarak işaretle
            await prisma.abandonedCart.updateMany({
                where: {
                    OR: [
                        order.customerEmail ? { email: order.customerEmail } : undefined,
                        order.customerPhone ? { phone: order.customerPhone } : undefined
                    ].filter(Boolean) as any,
                    isRecovered: false
                },
                data: {
                    isRecovered: true
                }
            }).catch(err => console.error("Callback abandoned cart recovery error:", err));

            // Fire Meta Conversions API Purchase Event
            if (order.user) {
                const names = order.user.name.trim().split(" ");
                const firstName = names[0];
                const lastName = names.slice(1).join(" ") || "";

                sendMetaCAPI({
                    eventName: "Purchase",
                    email: order.user.email,
                    phone: order.user.phone,
                    firstName,
                    lastName,
                    value: order.totalAmount,
                    orderId: order.id,
                    userAgent: req.headers.get("user-agent") || undefined
                }).catch(err => console.error("Failed to fire CAPI on checkout success:", err));
            }

            // 2. Kullanıcıya kurs erişimlerini tanımla
            for (const item of order.items) {
                const course = item.course;
                let expiresAt: Date | null = null;

                if (course.accessEndDate) {
                    expiresAt = new Date(course.accessEndDate);
                } else if (course.accessDurationDays) {
                    expiresAt = new Date(Date.now() + course.accessDurationDays * 24 * 60 * 60 * 1000);
                }

                await prisma.courseAccess.upsert({
                    where: {
                        userId_courseId: {
                            userId: order.userId,
                            courseId: item.courseId
                        }
                    },
                    create: {
                        userId: order.userId,
                        courseId: item.courseId,
                        expiresAt
                    },
                    update: {
                        grantedAt: new Date(),
                        expiresAt
                    }
                });
            }

            // 3. Başarı sayfasına yönlendir (303 GET)
            return NextResponse.redirect(
                new URL(`/checkout/success?orderId=${order.id}&method=cc`, process.env.NEXTAUTH_URL || req.url).toString(),
                303
            );

        } else if (isFailed) {
            // Ödeme başarısız
            const errorMsg = resultMessage || "Ödeme banka veya POS sistemi tarafından reddedildi.";
            
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "FAILED",
                    notes: `Ödeme Başarısız. Moka ResultCode: ${resultCode || "Yok"}, Mesaj: ${errorMsg}`
                }
            });

            // Kupon kullanım sayacını geri düşür
            if (order.couponId) {
                await prisma.coupon.update({
                    where: { id: order.couponId },
                    data: { usedCount: { decrement: 1 } }
                }).catch(err => console.error("Coupon decrement error on callback fail:", err));
            }

            return NextResponse.redirect(
                new URL(`/checkout/error?error=${encodeURIComponent(errorMsg)}&orderId=${order.id}`, process.env.NEXTAUTH_URL || req.url).toString(),
                303
            );
        } else {
            // İmza uyuşmazlığı (Şüpheli işlem veya hatalı imza)
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "FAILED",
                    notes: `Güvenlik İmzası Uyuşmazlığı. Gelen: ${hashValue}, Beklenen(T): ${hashValue1}`
                }
            });

            // Kupon kullanım sayacını geri düşür
            if (order.couponId) {
                await prisma.coupon.update({
                    where: { id: order.couponId },
                    data: { usedCount: { decrement: 1 } }
                }).catch(err => console.error("Coupon decrement error on signature mismatch:", err));
            }

            return NextResponse.redirect(
                new URL(`/checkout/error?error=${encodeURIComponent("Geçersiz güvenlik imzası.")}&orderId=${order.id}`, process.env.NEXTAUTH_URL || req.url).toString(),
                303
            );
        }

    } catch (err: any) {
        console.error("Moka Callback Error:", err);
        return NextResponse.redirect(
            new URL(`/checkout/error?error=${encodeURIComponent("Ödeme sonucu işlenirken sistemsel bir hata oluştu.")}`, process.env.NEXTAUTH_URL || req.url).toString(),
            303
        );
    }
}
