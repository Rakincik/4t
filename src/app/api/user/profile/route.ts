import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                tcNo: true,
                city: true,
                district: true,
                address: true,
                role: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Profile GET API Error:", error);
        return NextResponse.json({ error: "Profil bilgileri yüklenirken hata oluştu." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { name, phone, tcNo, city, district, address } = body;

        // Validations
        if (name && name.trim().length < 3) {
            return NextResponse.json({ error: "Ad Soyad en az 3 karakter olmalıdır." }, { status: 400 });
        }

        if (phone && phone.replace(/\D/g, "").length < 10) {
            return NextResponse.json({ error: "Telefon numarası geçersiz." }, { status: 400 });
        }

        if (tcNo && tcNo.trim().length !== 11) {
            return NextResponse.json({ error: "TC Kimlik numarası 11 hane olmalıdır." }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name ? name.trim() : undefined,
                phone: phone ? phone.trim() : undefined,
                tcNo: tcNo ? tcNo.trim() : undefined,
                city: city !== undefined ? city : undefined,
                district: district !== undefined ? district : undefined,
                address: address !== undefined ? address : undefined
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                tcNo: true,
                city: true,
                district: true,
                address: true,
                role: true
            }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error: any) {
        console.error("Profile POST API Error:", error);
        return NextResponse.json({ error: "Profil güncellenirken hata oluştu." }, { status: 500 });
    }
}
