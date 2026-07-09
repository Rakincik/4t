"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAbandonedCarts() {
    try {
        const carts = await prisma.abandonedCart.findMany({
            where: { isRecovered: false },
            orderBy: { createdAt: "desc" }
        });

        // Format dates and json to standard types
        return carts.map(c => ({
            id: c.id,
            name: c.name || "Misafir Öğrenci",
            email: c.email || "-",
            phone: c.phone || "-",
            courses: (c.courses as any[]) || [],
            createdAt: c.createdAt.toISOString()
        }));
    } catch (error) {
        console.error("getAbandonedCarts Error:", error);
        return [];
    }
}

export async function deleteAbandonedCart(id: string) {
    try {
        await prisma.abandonedCart.delete({
            where: { id }
        });
        revalidatePath("/admin/sepet-takip");
        return { success: true };
    } catch (error: any) {
        console.error("deleteAbandonedCart Error:", error);
        return { success: false, error: "Kayıt silinirken hata oluştu." };
    }
}
