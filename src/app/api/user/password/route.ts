import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Mevcut şifre ve yeni şifre gereklidir." }, { status: 400 });
        }

        if (newPassword.trim().length < 6) {
            return NextResponse.json({ error: "Yeni şifre en az 6 karakter olmalıdır." }, { status: 400 });
        }

        // Fetch user from DB to get the current hashed password
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        // Compare currentPassword with hashed db password
        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Mevcut şifre hatalı." }, { status: 400 });
        }

        // Hash the new password
        const hashedNewPassword = await hash(newPassword, 10);

        // Update password in DB
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        return NextResponse.json({ success: true, message: "Şifreniz başarıyla güncellendi." });
    } catch (error: any) {
        console.error("Password API Error:", error);
        return NextResponse.json({ error: "Şifre güncellenirken hata oluştu." }, { status: 500 });
    }
}
