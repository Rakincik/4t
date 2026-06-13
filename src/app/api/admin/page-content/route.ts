import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";

async function checkAdmin(req: NextRequest) {
    const token = await getToken({ req });
    return token && token.role === "ADMIN";
}

// GET: Belirli bir sayfanın tüm bölümlerini getir
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageSlug = searchParams.get("page");

    if (!pageSlug) {
        return NextResponse.json({ error: "page parametresi gerekli" }, { status: 400 });
    }

    const contents = await prisma.pageContent.findMany({
        where: { pageSlug },
        orderBy: { sectionKey: "asc" },
    });

    // sectionKey -> data map'i oluştur
    const sections: Record<string, any> = {};
    for (const c of contents) {
        sections[c.sectionKey] = {
            id: c.id,
            title: c.title,
            content: c.content,
            metadata: c.metadata,
        };
    }

    return NextResponse.json(sections, {
        headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
    });
}

// POST: Sayfa bölümlerini toplu güncelle/oluştur
export async function POST(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { pageSlug, sections } = body;

        if (!pageSlug || !sections) {
            return NextResponse.json({ error: "pageSlug ve sections gerekli" }, { status: 400 });
        }

        // Her bölümü upsert et
        const results = [];
        for (const [sectionKey, data] of Object.entries(sections) as [string, any][]) {
            const result = await prisma.pageContent.upsert({
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
            results.push(result);
        }

        // Versiyon snapshot'ı kaydet
        await prisma.pageContentVersion.create({
            data: {
                pageSlug,
                snapshot: sections,
                label: body.versionLabel || null,
            },
        });

        // Eski versiyonları temizle (son 50 tane tut)
        const allVersions = await prisma.pageContentVersion.findMany({
            where: { pageSlug },
            orderBy: { createdAt: "desc" },
            select: { id: true },
        });
        if (allVersions.length > 50) {
            const toDelete = allVersions.slice(50).map((v) => v.id);
            await prisma.pageContentVersion.deleteMany({ where: { id: { in: toDelete } } });
        }

        // Ön belleği temizle ki değişiklikler hemen listeye yansısın
        revalidatePath("/admin/sayfalar");
        revalidatePath("/admin/sayfalar/orgun-egitim");
        if (pageSlug.startsWith("orgun-egitim-")) {
            revalidatePath(`/orgun-egitim/${pageSlug.replace("orgun-egitim-", "")}`);
        } else {
            revalidatePath(`/${pageSlug}`);
        }

        return NextResponse.json({ success: true, count: results.length });
    } catch (error) {
        console.error("Error saving page content:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE: Sayfa içeriğini ve versiyonlarını sil
export async function DELETE(req: NextRequest) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageSlug = searchParams.get("page");

    if (!pageSlug) {
        return NextResponse.json({ error: "page parametresi gerekli" }, { status: 400 });
    }

    try {
        await prisma.pageContent.deleteMany({ where: { pageSlug } });
        await prisma.pageContentVersion.deleteMany({ where: { pageSlug } });

        revalidatePath("/admin/sayfalar");
        revalidatePath("/admin/sayfalar/orgun-egitim");
        if (pageSlug.startsWith("orgun-egitim-")) {
            revalidatePath(`/orgun-egitim/${pageSlug.replace("orgun-egitim-", "")}`);
        } else {
            revalidatePath(`/${pageSlug}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting page content:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

