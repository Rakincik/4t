import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const config = await prisma.siteConfig.findFirst({
            select: { headerAnnouncement: true }
        });
        return NextResponse.json(
            { announcement: config?.headerAnnouncement || "Geleceğe Hazırlık" },
            { headers: { "Cache-Control": "public, s-maxage=2, stale-while-revalidate=8" } }
        );
    } catch (e) {
        return NextResponse.json({ announcement: "Geleceğe Hazırlık" });
    }
}
