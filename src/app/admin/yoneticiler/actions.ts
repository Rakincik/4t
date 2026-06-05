"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function getAdmins() {
    return prisma.user.findMany({
        where: { role: "ADMIN" },
        orderBy: { createdAt: "desc" },
    });
}

export async function createAdmin(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        throw new Error("Ad, E-posta ve Şifre zorunludur.");
    }
    
    if (password.length < 6) {
        throw new Error("Şifre en az 6 karakter olmalıdır.");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        if (existingUser.role === "ADMIN") {
            throw new Error("Bu e-posta adresi zaten bir yönetici hesabına ait.");
        } else {
            // Eğer öğrenciyse rolünü yükseltelim (kullanıcı "Evet yükselt" diyebilir ama şimdilik direkt yükseltiyoruz)
            await prisma.user.update({
                where: { id: existingUser.id },
                data: { role: "ADMIN" }
            });
            revalidatePath("/admin/yoneticiler");
            return { success: true, message: "Kullanıcı bulundu ve yönetici yapıldı." };
        }
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "ADMIN",
        }
    });

    revalidatePath("/admin/yoneticiler");
    return { success: true, message: "Yeni yönetici başarıyla oluşturuldu." };
}

export async function revokeAdmin(userId: string) {
    // Kendi kendini silmeyi önlemek için frontend'de (session kontrolü ile) veya burada ek önlem alınabilir.
    await prisma.user.update({
        where: { id: userId },
        data: { role: "STUDENT" }
    });
    
    revalidatePath("/admin/yoneticiler");
    return { success: true };
}

export async function getAdminById(id: string) {
    return prisma.user.findUnique({
        where: { id, role: "ADMIN" },
    });
}

export async function updateAdmin(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email) {
        throw new Error("Ad ve E-posta zorunludur.");
    }

    const dataToUpdate: any = { name, email };

    if (password) {
        if (password.length < 6) {
            throw new Error("Şifre en az 6 karakter olmalıdır.");
        }
        dataToUpdate.password = await hash(password, 12);
    }

    // Check if email is taken by another user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== id) {
        throw new Error("Bu e-posta adresi başka bir hesaba ait.");
    }

    await prisma.user.update({
        where: { id },
        data: dataToUpdate,
    });

    revalidatePath("/admin/yoneticiler");
    return { success: true, message: "Yönetici başarıyla güncellendi." };
}
