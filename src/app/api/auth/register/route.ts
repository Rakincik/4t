import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, phone, tcNo, address, city } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Ad, e-posta ve şifre gerekli" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Şifre en az 6 karakter olmalı" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Bu e-posta adresi zaten kullanılıyor" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone: phone || null,
                tcNo: tcNo || null,
                address: address || null,
                city: city || null,
                password: hashedPassword,
                role: "STUDENT",
            },
        });

        return NextResponse.json(
            {
                message: "Kayıt başarılı",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: `Kayıt başarısız: ${error instanceof Error ? error.message : "Bilinmeyen hata"}` },
            { status: 500 }
        );
    }
}
