import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Try to get featured posts first
    let posts = await prisma.blogPost.findMany({
      where: { isPublished: true, isFeatured: true },
      take: 3,
      orderBy: { createdAt: "desc" }
    });

    // If no featured posts are found, fallback to latest published posts
    if (posts.length === 0) {
      posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        take: 3,
        orderBy: { createdAt: "desc" }
      });
    }

    return NextResponse.json(posts, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return NextResponse.json([], { status: 500 });
  }
}
