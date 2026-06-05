import prisma from "@/lib/prisma";
import KurslarClient from "./KurslarClient";

export const metadata = {
  title: "Kurslar | 4T Akademi",
  description: "Türkiye'nin en seçkin eğitim programlarını keşfedin.",
};

// Next.js ISR veya dinamik ayarları isteğe bağlı eklenebilir
export const revalidate = 60; // 1 dakikada bir cache yeniler

export default async function KurslarPage() {
  // Veritabanından AKTİF kursları çek. (Mock data yerine canlı data)
  const courses = await prisma.course.findMany({
    where: { isActive: true, type: { not: "FLIX" } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      price: true,
      oldPrice: true,
      imageUrl: true,
      type: true,
      color: true,
      learningOutcomes: true,
    }
  });

  // Props'a uygun hala getirmek için dönüştürme (Adapter)
  const formattedCourses = courses.map(c => {
    let finalLearningOutcomes = [];
    if (c.learningOutcomes) {
      try {
        const parsed = typeof c.learningOutcomes === 'string' ? JSON.parse(c.learningOutcomes) : c.learningOutcomes;
        if (Array.isArray(parsed)) finalLearningOutcomes = parsed;
      } catch (e) {}
    }

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: c.category || "Tümü",
      type: c.type || "KURS",
      imageUrl: c.imageUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      originalPrice: c.oldPrice ? `₺${c.oldPrice}` : null,
      discountedPrice: `₺${c.price}`,
      price: c.price,
      learningOutcomes: finalLearningOutcomes,
      color: c.color || "#3B82F6",
    };
  });

  return <KurslarClient initialCourses={formattedCourses} />;
}
