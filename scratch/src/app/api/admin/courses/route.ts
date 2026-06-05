import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

async function checkAdmin(req: NextRequest) {
    const token = await getToken({ req });
    return token && token.role === "ADMIN";
}

// GET: List courses
export async function GET(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            oldPrice: true,
            category: true,
            isActive: true,
        },
    });

    return NextResponse.json(courses);
}

// POST: Create course
export async function POST(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, slug, description, price, oldPrice, imageUrl, category, isActive } = body;

        if (!title || !slug || price === undefined) {
            return NextResponse.json(
                { error: "Title, slug and price are required" },
                { status: 400 }
            );
        }

        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description,
                price: parseFloat(price),
                oldPrice: oldPrice ? parseFloat(oldPrice) : null,
                imageUrl,
                category,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(course);
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "Slug already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
