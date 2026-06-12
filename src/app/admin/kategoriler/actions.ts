"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    const categories = await prisma.category.findMany({
        orderBy: { order: "asc" }
    });
    const courses = await prisma.course.findMany({
        select: { id: true, title: true, category: true, type: true }
    });
    
    return categories.map(cat => ({
        ...cat,
        courses: courses.filter(c => c.category === cat.slug)
    }));
}

export async function createCategory(formData: FormData) {
    const name = formData.get("name")?.toString();
    let slug = formData.get("slug")?.toString();
    const order = parseInt(formData.get("order")?.toString() || "0");
    const parentId = formData.get("parentId")?.toString() || null;
    const isActiveStr = formData.get("isActive")?.toString();
    const isActive = isActiveStr === "true" || isActiveStr === "on" ? true : isActiveStr === "false" ? false : true;

    if (!name) throw new Error("Kategori ismi zorunludur.");
    if (!slug) {
        slug = name.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) throw new Error("Bu slug zaten kullanılıyor.");

    const newCategory = await prisma.category.create({
        data: { name, slug, order, parentId, isActive }
    });

    revalidatePath("/admin/kategoriler");
    revalidatePath("/admin/kurslar");
    return newCategory;
}

export async function updateCategory(formData: FormData) {
    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const slug = formData.get("slug")?.toString();
    const orderStr = formData.get("order")?.toString();
    const parentId = formData.get("parentId")?.toString() || null;
    const isActiveStr = formData.get("isActive")?.toString();
    
    if (!id || !name || !slug) throw new Error("ID, İsim ve Slug zorunludur.");

    const data: any = { name, slug, parentId };
    if (orderStr) data.order = parseInt(orderStr);
    if (isActiveStr !== undefined) {
        data.isActive = isActiveStr === "true" || isActiveStr === "on";
    }

    await prisma.category.update({
        where: { id },
        data
    });

    revalidatePath("/admin/kategoriler");
    revalidatePath("/admin/kurslar");
    return { success: true };
}

export async function updateCategoryOrders(orders: { id: string; order: number }[]) {
    // Bulk update approach in Prisma requires a transaction of updates
    const updates = orders.map(o => 
        prisma.category.update({
            where: { id: o.id },
            data: { order: o.order }
        })
    );
    await prisma.$transaction(updates);

    revalidatePath("/admin/kategoriler");
    revalidatePath("/admin/kurslar");
    return { success: true };
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({
        where: { id }
    });

    revalidatePath("/admin/kategoriler");
    revalidatePath("/admin/kurslar");
    return { success: true };
}
