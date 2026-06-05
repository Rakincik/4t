import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const defaultMenus = [
        { slug: "header-uzaktan", title: "Uzaktan Eğitim (Header)" },
        { slug: "header-orgun", title: "Ankara Örgün (Header)" },
        { slug: "header-kamplar", title: "Kamplar (Header)" },
        { slug: "header-flix", title: "4T Flix (Header)" },
        { slug: "header-blog", title: "Blog (Header)" },
        { slug: "header-hakkimizda", title: "Hakkımızda (Header)" }
    ];

    const results = [];
    for (const menu of defaultMenus) {
        const existing = await prisma.menu.findUnique({ where: { slug: menu.slug } });
        if (!existing) {
            await prisma.menu.create({ data: menu });
            results.push(`Created: ${menu.slug}`);
        } else {
            results.push(`Already exists: ${menu.slug}`);
        }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Seed API Error:", error);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
