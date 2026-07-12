import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.4takademi.com";

  // 1. Fetch active courses
  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      where: { isActive: true, isDeleted: false },
      select: { slug: true, updatedAt: true, type: true },
    });
  } catch (e) {
    console.error("Sitemap courses query failed:", e);
  }

  // 2. Fetch published blog posts
  let blogs: any[] = [];
  try {
    blogs = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (e) {
    console.error("Sitemap blogs query failed:", e);
  }

  // 3. Static routes
  const staticRoutes = [
    "",
    "/hakkimizda",
    "/basarilarimiz",
    "/egitmenler",
    "/iletisim",
    "/sss",
    "/flix",
    "/kurslar",
    "/kamplar",
    "/orgun-egitim",
    "/giris",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 4. Course routes
  const courseRoutes = courses.map((course) => {
    const prefix = course.type === "FLIX" ? "/flix" : "/kurs";
    return {
      url: `${baseUrl}${prefix}/${course.slug}`,
      lastModified: course.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // 5. Blog routes
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
