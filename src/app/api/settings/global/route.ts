import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const config = await prisma.siteConfig.findFirst();
        return NextResponse.json(
            { config },
            { headers: { "Cache-Control": "public, s-maxage=2, stale-while-revalidate=8" } }
        );
    } catch (e) {
        return NextResponse.json({ error: "Failed to load config" }, { status: 500 });
    }
}
