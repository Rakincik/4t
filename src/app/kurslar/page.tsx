import prisma from "@/lib/prisma";
import KurslarClient from "./KurslarClient";

export const metadata = {
  title: "Kurslar | 4T Akademi",
  description: "Türkiye'nin en seçkin eğitim programlarını keşfedin.",
};

// Next.js ISR veya dinamik ayarları isteğe bağlı eklenebilir
export const revalidate = 60; // 1 dakikada bir cache yeniler

import { Suspense } from "react";

export default async function KurslarPage() {
  const [courses, activeCategoriesDB, contents] = await Promise.all([
    prisma.course.findMany({
      where: { isActive: true, isDeleted: false, type: { not: "FLIX" } },
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
        createdAt: true,
        isInstallmentApplicable: true,
      }
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: { name: true, slug: true }
    }),
    prisma.pageContent.findMany({
      where: { pageSlug: "kurslar" },
      orderBy: { sectionKey: "asc" }
    })
  ]);

  const cms: Record<string, any> = {};
  for (const c of contents) {
    cms[c.sectionKey] = {
      id: c.id,
      title: c.title,
      content: c.content,
      metadata: c.metadata,
    };
  }

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
      createdAt: c.createdAt,
      isInstallmentApplicable: c.isInstallmentApplicable,
    };
  });

  const normalizeTR = (s: string) => s.trim().toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c");

  const usedCategories = new Set<string>();
  formattedCourses.forEach(c => {
    if (c.category) {
      c.category.split(',').forEach(cat => {
        const trimmed = cat.trim().toLowerCase();
        if (trimmed) usedCategories.add(trimmed);
      });
    }
  });

  const relevantCategories = activeCategoriesDB.filter(cat => 
    usedCategories.has(cat.slug.toLowerCase()) || 
    usedCategories.has(normalizeTR(cat.name))
  );

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <KurslarClient initialCourses={formattedCourses} activeCategories={relevantCategories} initialCms={cms} />
    </Suspense>
  );
}

