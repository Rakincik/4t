import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

async function checkAdmin(req: NextRequest) {
    const token = await getToken({ req });
    return token && token.role === "ADMIN";
}

// GET: List all course accesses
export async function GET(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accesses = await prisma.courseAccess.findMany({
        orderBy: { grantedAt: "desc" },
        include: {
            user: { select: { id: true, name: true, email: true } },
            course: { select: { id: true, title: true } },
        },
    });

    return NextResponse.json(accesses);
}

// POST: Grant course access to a user
export async function POST(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { userId, courseId, expiresAt } = body;

        if (!userId || !courseId) {
            return NextResponse.json(
                { error: "userId and courseId are required" },
                { status: 400 }
            );
        }

        // Check if access already exists
        const existing = await prisma.courseAccess.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });

        if (existing) {
            return NextResponse.json(
                { error: "User already has access to this course" },
                { status: 400 }
            );
        }

        const access = await prisma.courseAccess.create({
            data: {
                userId,
                courseId,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                course: { select: { id: true, title: true } },
            },
        });

        return NextResponse.json(access);
    } catch (error) {
        console.error("Error granting access:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE: Remove course access
export async function DELETE(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Access ID required" }, { status: 400 });
    }

    try {
        await prisma.courseAccess.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Access not found" }, { status: 404 });
    }
}
