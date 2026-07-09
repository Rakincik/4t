"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAbandonedCarts() {
    try {
        const carts = await prisma.abandonedCart.findMany({
            where: { isRecovered: false },
            orderBy: { createdAt: "desc" }
        });

        // Collect all non-empty emails and phones to look up matching users
        const emails = carts.map(c => c.email).filter(Boolean) as string[];
        const phones = carts.map(c => c.phone).filter(Boolean) as string[];

        // Find registered users with matching email or phone
        const matchingUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { in: emails } },
                    { phone: { in: phones } }
                ]
            },
            select: {
                id: true,
                email: true,
                phone: true
            }
        });

        // Map matching email/phone to their user IDs
        const userMap = new Map<string, string>();
        for (const u of matchingUsers) {
            if (u.email) userMap.set(u.email.toLowerCase(), u.id);
            if (u.phone) userMap.set(u.phone, u.id);
        }

        // Format dates and json to standard types, adding userId if found
        return carts.map(c => {
            let userId: string | null = null;
            if (c.email && userMap.has(c.email.toLowerCase())) {
                userId = userMap.get(c.email.toLowerCase()) || null;
            } else if (c.phone && userMap.has(c.phone)) {
                userId = userMap.get(c.phone) || null;
            }

            return {
                id: c.id,
                name: c.name || "Misafir Öğrenci",
                email: c.email || "-",
                phone: c.phone || "-",
                courses: (c.courses as any[]) || [],
                createdAt: c.createdAt.toISOString(),
                userId
            };
        });
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
