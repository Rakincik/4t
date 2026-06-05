import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

async function checkAdmin(req: NextRequest) {
    const token = await getToken({ req });
    return token && token.role === "ADMIN";
}

// GET: Belirli bir sayfanın versiyon geçmişini getir
export async function GET(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageSlug = searchParams.get("page");

    if (!pageSlug) {
        return NextResponse.json({ error: "page parametresi gerekli" }, { status: 400 });
    }

    const versions = await prisma.pageContentVersion.findMany({
        where: { pageSlug },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
            id: true,
            label: true,
            createdAt: true,
        },
    });

    return NextResponse.json({ versions });
}

// POST: Belirli bir versiyona geri dön
export async function POST(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { versionId } = body;

        if (!versionId) {
            return NextResponse.json({ error: "versionId gerekli" }, { status: 400 });
        }

        const version = await prisma.pageContentVersion.findUnique({ where: { id: versionId } });
        if (!version) {
            return NextResponse.json({ error: "Versiyon bulunamadı" }, { status: 404 });
        }

        const snapshot = version.snapshot as Record<string, any>;
        const pageSlug = version.pageSlug;

        // Snapshot'taki her bölümü upsert et
        for (const [sectionKey, data] of Object.entries(snapshot)) {
            await prisma.pageContent.upsert({
                where: { pageSlug_sectionKey: { pageSlug, sectionKey } },
                update: {
                    title: data.title || null,
                    content: data.content || null,
                    metadata: data.metadata || null,
                },
                create: {
                    pageSlug,
                    sectionKey,
                    title: data.title || null,
                    content: data.content || null,
                    metadata: data.metadata || null,
                },
            });
        }

        // Geri alma versiyonu da kaydet
        await prisma.pageContentVersion.create({
            data: {
                pageSlug,
                snapshot,
                label: `🔄 Geri alındı (${new Date(version.createdAt).toLocaleString("tr-TR")})`,
            },
        });

        return NextResponse.json({ success: true, pageSlug });
    } catch (error) {
        console.error("Error restoring version:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
