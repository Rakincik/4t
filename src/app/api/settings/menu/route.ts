import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const prefix = searchParams.get("prefix");

  if (!slug && !prefix) {
    return NextResponse.json({ error: "Slug or prefix is required" }, { status: 400 });
  }

  try {
    if (prefix) {
      const menus = await prisma.menu.findMany({
        where: { slug: { startsWith: prefix } },
        include: {
          items: {
            where: { parentId: null, isActive: true },
            include: {
              children: {
                where: { isActive: true },
                orderBy: { order: "asc" }
              }
            },
            orderBy: { order: "asc" }
          }
        }
      });
      return NextResponse.json({ menus }, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      });
    }

    const menu = await prisma.menu.findUnique({
      where: { slug: slug! },
      include: {
        items: {
          where: { parentId: null, isActive: true },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { order: "asc" }
            }
          },
          orderBy: { order: "asc" }
        }
      }
    });

    if (!menu) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: menu.items }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("API Menu Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
