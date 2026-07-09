import prisma from "@/lib/prisma";
import FlixClient, { FlixProduct } from "./FlixClient";

export const metadata = {
  title: "FLIX Paketleri | 4T Akademi",
  description: "Türkiye'nin en kapsamlı video eğitim platformu.",
};

export const revalidate = 60; // 1 dakikada bir cache yeniler

export default async function FlixPageWrapper() {
  const courses = await prisma.course.findMany({
    where: { 
      type: "FLIX",
      isActive: true,
      isDeleted: false
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      description: true,
      hours: true,
      questions: true,
      oldPrice: true,
      price: true,
      bookPrice: true,
      badge: true,
    }
  });

  const flixProducts: FlixProduct[] = courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    desc: c.subtitle || c.description?.slice(0, 100) || "Video eğitim paketi.",
    hours: c.hours || "100+",
    questions: c.questions || "1000+",
    originalPrice: c.oldPrice || c.price,
    price: c.price,
    bookPrice: c.bookPrice || 0,
    badge: c.badge,
  }));

  return <FlixClient flixProducts={flixProducts} />;
}
