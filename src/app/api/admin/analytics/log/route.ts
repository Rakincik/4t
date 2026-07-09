import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { courseId, event } = body;

        if (!courseId) {
            return NextResponse.json({ error: "courseId zorunludur." }, { status: 400 });
        }

        if (event === "view") {
            await prisma.course.update({
                where: { id: courseId },
                data: { viewsCount: { increment: 1 } }
            });
        } else if (event === "cart_add") {
            await prisma.course.update({
                where: { id: courseId },
                data: { cartAddsCount: { increment: 1 } }
            });
        } else {
            return NextResponse.json({ error: "Geçersiz olay tipi." }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Analytics Log API Error:", err);
        return NextResponse.json({ error: err.message || "Log kaydedilemedi." }, { status: 500 });
    }
}
