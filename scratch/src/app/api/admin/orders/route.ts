import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

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

        const validStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        // If order is paid, grant course access
        if (status === "PAID") {
            const orderWithItems = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            });

            if (orderWithItems) {
                for (const item of orderWithItems.items) {
                    // Upsert access (create if not exists)
                    await prisma.courseAccess.upsert({
                        where: {
                            userId_courseId: {
                                userId: orderWithItems.userId,
                                courseId: item.courseId,
                            },
                        },
                        create: {
                            userId: orderWithItems.userId,
                            courseId: item.courseId,
                        },
                        update: {}, // No update needed if exists
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
