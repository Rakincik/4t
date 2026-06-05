"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// Site Config Actions
// ============================================
export async function getSiteConfig() {
    let config = await prisma.siteConfig.findFirst();

    // Create default config if none exists
    if (!config) {
        config = await prisma.siteConfig.create({
            data: {
                siteName: "4T Akademi",
                phone: "(0312) 433 40 44",
                whatsapp: "905531724044",
                email: "destek@4takademi.com",
                address: "İlkbahar Mah. 593 Sk. No:2 Çankaya/ANKARA",
                workingHours: "09:00 - 19:00",
            },
        });
    }

    return config;
}

export async function updateSiteConfig(formData: FormData) {
    const config = await prisma.siteConfig.findFirst();

    const data = {
        siteName: formData.get("siteName") as string,
        phone: formData.get("phone") as string,
        whatsapp: formData.get("whatsapp") as string,
        email: formData.get("email") as string,
        address: formData.get("address") as string,
        workingHours: formData.get("workingHours") as string,
        footerText: formData.get("footerText") as string || null,
    };

    if (config) {
        await prisma.siteConfig.update({
            where: { id: config.id },
            data,
        });
    } else {
        await prisma.siteConfig.create({ data });
    }

    revalidatePath("/admin/site");
    revalidatePath("/"); // Revalidate frontend

    return { success: true };
}

// ============================================
// Menu Actions
// ============================================
export async function getMenus() {
    return prisma.menu.findMany({
        include: {
            items: {
                orderBy: { order: "asc" },
            },
        },
        orderBy: { title: "asc" },
    });
}

export async function getMenu(slug: string) {
    return prisma.menu.findUnique({
        where: { slug },
        include: {
            items: {
                orderBy: { order: "asc" },
            },
        },
    });
}

export async function createMenu(formData: FormData) {
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;

    await prisma.menu.create({
        data: { slug, title },
    });

    revalidatePath("/admin/site/menuler");
    return { success: true };
}

export async function deleteMenu(id: string) {
    await prisma.menu.delete({ where: { id } });
    revalidatePath("/admin/site/menuler");
    return { success: true };
}

// ============================================
// Menu Item Actions
// ============================================
export async function addMenuItem(formData: FormData) {
    const menuId = formData.get("menuId") as string;
    const label = formData.get("label") as string;
    const url = formData.get("url") as string;

    // Get the highest order number
    const lastItem = await prisma.menuItem.findFirst({
        where: { menuId },
        orderBy: { order: "desc" },
    });

    await prisma.menuItem.create({
        data: {
            menuId,
            label,
            url,
            order: (lastItem?.order ?? -1) + 1,
        },
    });

    revalidatePath("/admin/site/menuler");
    revalidatePath("/"); // Revalidate frontend
    return { success: true };
}

export async function updateMenuItem(formData: FormData) {
    const id = formData.get("id") as string;
    const label = formData.get("label") as string;
    const url = formData.get("url") as string;
    const isActive = formData.get("isActive") === "true";

    await prisma.menuItem.update({
        where: { id },
        data: { label, url, isActive },
    });

    revalidatePath("/admin/site/menuler");
    revalidatePath("/");
    return { success: true };
}

export async function deleteMenuItem(id: string) {
    await prisma.menuItem.delete({ where: { id } });
    revalidatePath("/admin/site/menuler");
    revalidatePath("/");
    return { success: true };
}

export async function reorderMenuItems(items: { id: string; order: number }[]) {
    await Promise.all(
        items.map((item) =>
            prisma.menuItem.update({
                where: { id: item.id },
                data: { order: item.order },
            })
        )
    );

    revalidatePath("/admin/site/menuler");
    revalidatePath("/");
    return { success: true };
}
