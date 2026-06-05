import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const config = await prisma.siteConfig.findFirst();
        return NextResponse.json({ config });
    } catch (e) {
        return NextResponse.json({ error: "Failed to load config" }, { status: 500 });
    }
}
