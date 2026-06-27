"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteStudent(id: string) {
    if (!id) return { error: "ID bulunamadı." };

    try {
        await prisma.user.delete({
            where: { id }
        });
        revalidatePath("/admin/ogrenciler");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting student:", error);
        return { error: error.message || "Öğrenci silinirken bir hata oluştu." };
    }
}
