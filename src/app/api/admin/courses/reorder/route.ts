import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const items = await request.json();
        
        if (!Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid data format. Expected an array." }, { status: 400 });
        }

        // Perform all updates in a transaction
        await prisma.$transaction(
            items.map((item: { id: string; sortOrder: number }) => 
                prisma.course.update({
                    where: { id: item.id },
                    data: { sortOrder: item.sortOrder }
                })
            )
        );

        return NextResponse.json({ success: true, message: "Sıralama başarıyla güncellendi." });
    } catch (error: any) {
        console.error("Reorder Error:", error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}
