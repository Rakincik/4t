import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { sendMetaCAPI } from "@/lib/meta-capi";

async function checkAdmin(req: NextRequest) {
    const token = await getToken({ req });
    return token && token.role === "ADMIN";
}

// GET: List all orders
export async function GET(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                include: { course: { select: { id: true, title: true } } },
            },
        },
    });

    return NextResponse.json(orders);
}

// PATCH: Update order status
export async function PATCH(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json(
                { error: "orderId and status are required" },
                { status: 400 }
            );
        }

        const validStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        // If order is paid, grant course access with expiry
        if (status === "PAID") {
            const orderWithItems = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    user: { select: { email: true, name: true, phone: true } },
                    items: {
                        include: {
                            course: {
                                select: { id: true, accessEndDate: true, accessDurationDays: true }
                            },
                            variant: {
                                select: { accessDurationDays: true }
                            }
                        }
                    }
                },
            });

            if (orderWithItems) {
                if (orderWithItems.user) {
                    const names = orderWithItems.user.name.trim().split(" ");
                    const firstName = names[0];
                    const lastName = names.slice(1).join(" ") || "";

                    sendMetaCAPI({
                        eventName: "Purchase",
                        email: orderWithItems.user.email,
                        phone: orderWithItems.user.phone,
                        firstName,
                        lastName,
                        value: orderWithItems.totalAmount,
                        orderId: orderWithItems.id
                    }).catch(err => console.error("Failed to fire Meta CAPI on manual order approval:", err));
                }

                for (const item of orderWithItems.items) {
                    // Mevcut erişimi kontrol et (Uzatma mantığı için)
                    const existingAccess = await (prisma.courseAccess as any).findUnique({
                        where: {
                            userId_courseId: {
                                userId: orderWithItems.userId,
                                courseId: item.courseId,
                            }
                        }
                    });

                    // Eğer aktif bir süresi varsa, eklemeyi onun üzerine yap
                    let baseDate = new Date();
                    if (existingAccess && existingAccess.expiresAt && existingAccess.expiresAt > baseDate) {
                        baseDate = new Date(existingAccess.expiresAt);
                    }

                    // Erişim bitiş tarihi hesaplama
                    let expiresAt: Date | null = null;
                    
                    if (item.course.accessEndDate) {
                        // Sabit bitiş tarihi (sınav günü vb.)
                        expiresAt = new Date(item.course.accessEndDate);
                    } else if (item.variant?.accessDurationDays) {
                        // Varyasyon üzerinden X gün uzatma (Yeni eklendi)
                        expiresAt = new Date(baseDate);
                        expiresAt.setDate(expiresAt.getDate() + item.variant.accessDurationDays);
                    } else if (item.course.accessDurationDays) {
                        // Kurs üzerinden genel X gün uzatma
                        expiresAt = new Date(baseDate);
                        expiresAt.setDate(expiresAt.getDate() + item.course.accessDurationDays);
                    }
                    // null = süresiz erişim

                    await (prisma.courseAccess as any).upsert({
                        where: {
                            userId_courseId: {
                                userId: orderWithItems.userId,
                                courseId: item.courseId,
                            },
                        },
                        create: {
                            userId: orderWithItems.userId,
                            courseId: item.courseId,
                            expiresAt,
                        },
                        update: {
                            // Süreyi uzat
                            ...(expiresAt ? { expiresAt } : {}),
                        },
                    });
                }
            }
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
