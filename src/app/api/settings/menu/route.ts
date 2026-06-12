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

      // Auto-populate 'header-uzaktan' with categories if it's empty
      const uzaktanMenu = menus.find(m => m.slug === "header-uzaktan");
      if (uzaktanMenu && uzaktanMenu.items.length === 0) {
        const activeCategories = await prisma.category.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" }
        });

        // Add them as dynamic items
        uzaktanMenu.items = activeCategories.map((cat, idx) => ({
          id: `auto-cat-${cat.id}`,
          menuId: uzaktanMenu.id,
          label: cat.name,
          url: `/kurslar?kategori=${encodeURIComponent(cat.name)}`,
          desc: "Kategoriye ait tüm eğitimler",
          order: idx,
          isActive: true,
          parentId: null,
          children: []
        }));
      }

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

    if (menu.slug === "header-uzaktan" && menu.items.length === 0) {
      const activeCategories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" }
      });
      menu.items = activeCategories.map((cat, idx) => ({
        id: `auto-cat-${cat.id}`,
        menuId: menu.id,
        label: cat.name,
        url: `/kurslar?kategori=${encodeURIComponent(cat.name)}`,
        desc: "Kategoriye ait tüm eğitimler",
        order: idx,
        isActive: true,
        parentId: null,
        children: []
      }));
    }

    return NextResponse.json({ items: menu.items }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("API Menu Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
