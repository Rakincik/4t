import prisma from "@/lib/prisma";
import KamplarClient from "./KamplarClient";

export const metadata = {
  title: "Kamplar | 4T Akademi",
  description: "Yoğunlaştırılmış Kamp Programları",
};

export const revalidate = 60; // 1 dakikada bir cache yeniler

export default async function KamplarPage() {
  // Veritabanından KAMP tipindeki kursları çek
  const kamplar = await prisma.course.findMany({
    where: { isActive: true, type: "KAMP" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      type: true,
      price: true,
      oldPrice: true,
      imageUrl: true,
      duration: true,
      studentCount: true,
      badge: true,
      color: true,
      learningOutcomes: true,
    }
  });

  // Client bileşeninin beklediği formata dönüştür
  const formattedKamplar = kamplar.map(c => {
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
      type: c.type || "KAMP",
      imageUrl: c.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
      originalPrice: c.oldPrice ? `₺${c.oldPrice}` : null,
      discountedPrice: `₺${c.price}`,
      duration: c.duration,
      studentCount: c.studentCount,
      isNew: c.badge === "Yeni" || false,
      color: c.color || "#F97316", // Kamplar için varsayılan turuncu
      learningOutcomes: finalLearningOutcomes,
    };
  });

  const activeCategoriesDB = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { name: true, slug: true }
  });
  
  // Sadece bu sayfadaki kampların gerçekten sahip olduğu kategorileri filtrele
  const normalizeTR = (s: string) => s.trim().toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c");

  const usedCategories = new Set(formattedKamplar.map(c => c.category ? c.category.toLowerCase() : ""));
  const relevantCategories = activeCategoriesDB.filter(cat => 
    usedCategories.has(cat.slug.toLowerCase()) || 
    usedCategories.has(normalizeTR(cat.name))
  );

  return <KamplarClient initialCourses={formattedKamplar} activeCategories={relevantCategories} />;
}
