// Dosya Yolu: app/kurslar/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

import {
  UsersIcon,
  ClockIcon,
  TagIcon,
  PlayCircleIcon
} from "@heroicons/react/24/outline";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import CourseCard from "@/app/components/CourseCard";
import FadeIn from "@/app/components/ui/FadeIn"; // Animasyon için

/* ---------------------------------------------------------------- */
/* DATA (MOCK)                                                      */
/* ---------------------------------------------------------------- */
const allCourses = [
  {
    id: 1,
    slug: "115-donem-kaymakamlik",
    title: "115. Dönem Kaymakamlık Eğitim Kursu",
    category: "Kaymakamlık",
    type: "Canlı Ders",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺19.500",
    discountedPrice: "₺15.500",
    duration: "500+",
    studentCount: "250",
    isNew: true,
  },
  {
    id: 2,
    slug: "kpss-a-premium",
    title: "KPSS A Premium Online Kursu (2026)",
    category: "KPSS A",
    type: "Canlı Ders",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺17.000",
    discountedPrice: "₺14.500",
    duration: "600+",
    studentCount: "410",
  },
  {
    id: 3,
    slug: "sayistay-soru-kampi",
    title: "Sayıştay Denetçiliği Soru Çözüm Kampı",
    category: "Sayıştay",
    type: "Kamp",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺5.000",
    discountedPrice: "₺3.500",
    duration: "100",
    studentCount: "180",
  },
  {
    id: 4,
    slug: "iktisat-flix",
    title: "İktisat FLIX (VOD Paket)",
    category: "FLIX",
    type: "FLIX",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-16954a187c3d?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺4.000",
    discountedPrice: "₺2.000",
    duration: "150",
    studentCount: "700+",
  },
  {
    id: 5,
    slug: "guy-hazirlik",
    title: "Gelir Uzman Yrd. (GUY) Hazırlık Paketi",
    category: "GUY",
    type: "Canlı Ders",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺8.000",
    discountedPrice: "₺6.500",
    duration: "250",
    studentCount: "300",
  },
  {
    id: 6,
    slug: "hukuk-flix",
    title: "Tüm Hukuk FLIX Paketi",
    category: "FLIX",
    type: "FLIX",
    imageUrl:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺4.000",
    discountedPrice: "₺2.000",
    duration: "200",
    studentCount: "550",
  },
];

const categories = ["Tümü", "Kaymakamlık", "KPSS A", "Sayıştay", "GUY", "FLIX"];
const types = ["Tümü", "Canlı Ders", "Kamp", "FLIX"] as const;

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function normalizeTR(s: string) {
  return s.trim().toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c");
}

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Basit filtreleme
  const filteredCourses = useMemo(() => {
    const normSearch = normalizeTR(searchTerm);
    return allCourses.filter((c) => {
      const matchCat = activeCategory === "Tümü" || c.category === activeCategory;
      const matchSearch = normalizeTR(c.title).includes(normSearch);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* --- FAZ 1: MODERN HERO VE İSTATİSTİK BANDI --- */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        {/* Soyut Arka Plan Deseni (Kurumsal Gri) */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 mb-6 border border-red-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                2026 Erken Kayıt Dönemi
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-[#0B1221] tracking-tight leading-[1.1] mb-6">
                Geleceğinizi <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                  Şansa Bırakmayın.
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Türkiye'nin en seçkin eğitmen kadrosu ve yapay zeka destekli öğrenme sistemiyle,
                hedefinize en kısa ve sağlam yoldan ulaşın.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* İstatistik Bandı (Slim Strip) */}
      <div className="border-y border-gray-100 bg-gray-50/50">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-start gap-8 md:gap-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-gray-400" />
              <span><strong className="text-gray-900">25K+</strong> Öğrenci</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <span><strong className="text-gray-900">10K+</strong> Video Saati</span>
            </div>
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-gray-400" />
              <span><strong className="text-gray-900">%95</strong> Başarı Oranı</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300 mx-2"></div>
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <CheckBadgeIcon className="w-5 h-5" />
              <span>%100 Memnuniyet Garantisi</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FAZ 2: STICKY FILTRE BAR (MİNİMALİST) --- */}
      <section className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Kategori Hapları */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                    activeCategory === cat
                      ? "bg-[#0B1221] text-white border-[#0B1221] shadow-md transform scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Arama ve Sıralama */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64 group">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#0B1221] transition-colors" />
                <input
                  type="text"
                  placeholder="Kurs ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                />
              </div>
              <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0B1221] transition-colors">
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- FAZ 3: KART GRID --- */}
      <section className="py-12 bg-gray-50 min-h-[600px]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">

          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeCategory === "Tümü" ? "Tüm Eğitim Programları" : `${activeCategory} Eğitimleri`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredCourses.length} kurs listeleniyor
              </p>
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, idx) => (
                <FadeIn key={course.id} delay={idx * 0.05}>
                  {/* Yeni tasarladığımız CourseCard bileşeni */}
                  <CourseCard {...course} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FunnelIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sonuç Bulunamadı</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                Arama kriterlerinize uygun bir kurs bulamadık. Lütfen filtreleri temizleyip tekrar deneyin.
              </p>
              <button
                onClick={() => { setActiveCategory("Tümü"); setSearchTerm(""); }}
                className="mt-6 px-6 py-2 rounded-xl bg-[#0B1221] text-white text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
