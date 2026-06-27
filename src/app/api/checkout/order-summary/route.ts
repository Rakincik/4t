import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function sha256(val?: string | null) {
    if (!val) return "";
    return crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex");
}

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
        return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                totalAmount: true,
                status: true,
                user: {
                    select: {
                        email: true,
                        phone: true,
                        name: true
                    }
                },
                items: {
                    select: {
                        price: true,
                        quantity: true,
                        course: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const names = (order.user?.name || "").trim().split(" ");
        const firstName = names[0] || "";
        const lastName = names.slice(1).join(" ") || "";

        // Format summary for GTM dataLayer ingestion
        const summary = {
            transactionId: order.id,
            value: order.totalAmount,
            status: order.status,
            hashedEmail: sha256(order.user?.email),
            hashedPhone: sha256(order.user?.phone),
            hashedFirstName: sha256(firstName),
            hashedLastName: sha256(lastName),
            items: order.items.map(item => ({
                id: item.course?.id || "",
                name: stripHtml(item.course?.title || ""),
                price: item.price,
                quantity: item.quantity
            }))
        };

        return NextResponse.json(summary);
    } catch (error) {
        console.error("Order summary fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
