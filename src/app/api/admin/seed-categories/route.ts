import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const CATEGORIES = [
    { slug: "kaymakamlik", name: "Kaymakamlık", order: 1 },
    { slug: "kpss-a", name: "KPSS A", order: 2 },
    { slug: "hakimlik", name: "Hakimlik", order: 3 },
    { slug: "sayistay", name: "Sayıştay", order: 4 },
    { slug: "osym", name: "ÖSYM", order: 5 },
    { slug: "guy", name: "GUY", order: 6 },
];

export async function GET() {
    try {
        for (const c of CATEGORIES) {
            await prisma.category.upsert({
                where: { slug: c.slug },
                update: {},
                create: { slug: c.slug, name: c.name, order: c.order }
            });
        }
        return NextResponse.json({ success: true, message: "Kategoriler eklendi!" });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
