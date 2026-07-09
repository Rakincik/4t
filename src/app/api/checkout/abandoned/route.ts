import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, courses } = body;

        // At least email or phone is required to track
        if (!email && !phone) {
            return NextResponse.json({ error: "E-posta veya telefon numarası gereklidir." }, { status: 400 });
        }

        // Check if there is an active (unrecovered) abandoned cart for this email or phone
        const existingCart = await prisma.abandonedCart.findFirst({
            where: {
                OR: [
                    email ? { email } : undefined,
                    phone ? { phone } : undefined
                ].filter(Boolean) as any,
                isRecovered: false
            },
            orderBy: { createdAt: "desc" }
        });

        if (existingCart) {
            // Update the existing active cart
            await prisma.abandonedCart.update({
                where: { id: existingCart.id },
                data: {
                    name: name || existingCart.name,
                    email: email || existingCart.email,
                    phone: phone || existingCart.phone,
                    courses: courses || existingCart.courses,
                    updatedAt: new Date()
                }
            });
        } else {
            // Create a new abandoned cart record
            await prisma.abandonedCart.create({
                data: {
                    name: name || "Misafir Öğrenci",
                    email: email || null,
                    phone: phone || null,
                    courses: courses || [],
                    isRecovered: false
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Checkout Abandoned Cart API Error:", err);
        return NextResponse.json({ error: err.message || "Terk edilmiş sepet kaydedilemedi." }, { status: 500 });
    }
}
