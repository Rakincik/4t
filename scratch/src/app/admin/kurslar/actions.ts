"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// Course CRUD
// ============================================
export async function getCourses() {
    return prisma.course.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getCourse(id: string) {
    return prisma.course.findUnique({
        where: { id },
    });
}

export async function createCourse(formData: FormData) {
    const data = {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string || null,
        price: parseFloat(formData.get("price") as string) || 0,
        oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null,
        imageUrl: formData.get("imageUrl") as string || null,
        category: formData.get("category") as string || null,
        isActive: formData.get("isActive") === "true",
    };

    const course = await prisma.course.create({ data });

    revalidatePath("/admin/kurslar");
    revalidatePath("/kurslar");

    return { success: true, id: course.id };
}

export async function updateCourse(id: string, formData: FormData) {
    const data = {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string || null,
        price: parseFloat(formData.get("price") as string) || 0,
        oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null,
        imageUrl: formData.get("imageUrl") as string || null,
        category: formData.get("category") as string || null,
        isActive: formData.get("isActive") === "true",
    };

    await prisma.course.update({
        where: { id },
        data,
    });

    revalidatePath("/admin/kurslar");
    revalidatePath("/kurslar");
    revalidatePath(`/kurs/${data.slug}`);

    return { success: true };
}

export async function deleteCourse(id: string) {
    await prisma.course.delete({
        where: { id },
    });

    revalidatePath("/admin/kurslar");
    revalidatePath("/kurslar");

    return { success: true };
}
