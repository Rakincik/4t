import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

// Middleware to check admin role
async function checkAdmin(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || token.role !== "ADMIN") {
        return false;
    }
    return true;
}

// GET: List users
export async function GET(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as "ADMIN" | "STUDENT" | null;

    const users = await prisma.user.findMany({
        where: role ? { role } : undefined,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        },
    });

    return NextResponse.json(users);
}

// POST: Create user
export async function POST(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, email, password, phone, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required" },
                { status: 400 }
            );
        }

        const { hash } = await import("bcryptjs");
        const hashedPassword = await hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role: role || "STUDENT",
            },
        });

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
