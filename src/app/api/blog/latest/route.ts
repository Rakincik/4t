import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(posts, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return NextResponse.json([], { status: 500 });
  }
}
