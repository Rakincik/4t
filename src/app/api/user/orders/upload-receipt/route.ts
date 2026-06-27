import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { orderId, receiptUrl } = body;

        if (!orderId || !receiptUrl) {
            return NextResponse.json({ error: "Sipariş ID ve Dekont URL gereklidir." }, { status: 400 });
        }

        // Find the order and verify ownership
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
        }

        if (order.userId !== userId) {
            return NextResponse.json({ error: "Bu işlem için yetkiniz bulunmamaktadır." }, { status: 403 });
        }

        // Update the receiptUrl in database
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                receiptUrl,
                notes: order.notes 
                    ? `${order.notes}\n[Sistem]: Öğrenci dekont yükledi.` 
                    : "[Sistem]: Öğrenci dekont yükledi."
            }
        });

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error: any) {
        console.error("Upload Receipt API Error:", error);
        return NextResponse.json({ error: "Dekont kaydedilirken hata oluştu." }, { status: 500 });
    }
}
