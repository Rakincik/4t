// Dosya Yolu: app/kamplar/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon,
  FireIcon,
} from "@heroicons/react/24/solid";

import {
  UsersIcon,
  ClockIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

import MainHeader from "@/app/components/MainHeader";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/app/components/Footer"));
import CourseCard from "@/app/components/CourseCard";
import FadeIn from "@/app/components/ui/FadeIn";

/* ---------------------------------------------------------------- */
/* DATA (MOCK) - KAMP ÜRÜNLERİ                                      */
/* ---------------------------------------------------------------- */
const allKamplar = [
  {
    id: 101,
    slug: "guz-ramazan-kampi-kaymakamlik",
    title: "Güz Ramazan Kampı — Kaymakamlık Hazırlık",
    category: "Kaymakamlık",
    type: "Kamp",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺12.000",
    discountedPrice: "₺8.500",
    duration: "180",
    studentCount: "120",
    isNew: true,
  },
  {
    id: 102,
    slug: "guz-ramazan-kampi-kpss-a",
    title: "Güz Ramazan Kampı — KPSS A Grubu",
    category: "KPSS A",
    type: "Kamp",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺11.000",
    discountedPrice: "₺7.900",
    duration: "160",
    studentCount: "95",
    isNew: true,
  },
  {
    id: 103,
    slug: "yaz-yogun-kamp-kaymakamlik",
    title: "Yaz Yoğun Kamp — Kaymakamlık Tam Paket",
    category: "Kaymakamlık",
    type: "Kamp",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺14.000",
    discountedPrice: "₺10.500",
    duration: "250",
    studentCount: "200",
  },
  {
    id: 104,
    slug: "yaz-yogun-kamp-sayistay",
    title: "Yaz Yoğun Kamp — Sayıştay Denetçiliği",
    category: "Sayıştay",
    type: "Kamp",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺9.500",
    discountedPrice: "₺6.900",
    duration: "140",
    studentCount: "85",
  },
  {
    id: 105,
    slug: "kis-donemi-kampi-kpss-a",
    title: "Kış Dönemi Kampı — KPSS A Soru Çözüm",
    category: "KPSS A",
    type: "Kamp",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺7.500",
    discountedPrice: "₺5.200",
    duration: "100",
    studentCount: "150",
  },
  {
    id: 106,
    slug: "guy-ramazan-kampi",
    title: "GUY Ramazan Kampı — Gelir Uzman Yrd.",
    category: "GUY",
    type: "Kamp",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop",
    originalPrice: "₺8.000",
    discountedPrice: "₺5.500",
    duration: "120",
    studentCount: "110",
    isNew: true,
  },
];

const categories = ["Tümü", "Kaymakamlık", "KPSS A", "Sayıştay", "GUY"];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function normalizeTR(s: string) {
  return s.trim().toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c");
}

export default function KamplarPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  // Arama için Debounce (Geciktirme) Etkisi
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const filteredKamplar = useMemo(() => {
    const normSearch = normalizeTR(searchTerm);
    return allKamplar.filter((c) => {
      const matchCat = activeCategory === "Tümü" || c.category === activeCategory;
      const matchSearch = normalizeTR(c.title).includes(normSearch);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* --- HERO --- */}
      <section className="relative pt-12 pb-6 overflow-hidden">
        {/* Soyut Arka Plan */}
        <div className="absolute inset-0 bg-[radial-gradient(#fed7aa_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 mb-6 border border-orange-200">
                <FireIcon className="h-3.5 w-3.5" />
                Kamp Programları
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-[#0B1221] tracking-tight leading-[1.1] mb-6">
                Yoğunlaştırılmış <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                  Kamp Programları
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Dönemlere özel tasarlanmış, tempo yüksek kamp programlarıyla sınava en kısa sürede hazırlanın.
                Kamp içerikleri diğer paketlerden farklı, özel olarak hazırlanmıştır.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* İstatistik Bandı */}
      <div className="border-y border-orange-100 bg-orange-50/50">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-start gap-8 md:gap-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-orange-400" />
              <span><strong className="text-gray-900">2.500+</strong> Kamp Öğrencisi</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-orange-400" />
              <span><strong className="text-gray-900">6</strong> Aktif Kamp</span>
            </div>
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-orange-400" />
              <span><strong className="text-gray-900">%92</strong> Başarı Oranı</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-orange-200 mx-2"></div>
            <div className="flex items-center gap-2 text-orange-700 font-medium">
              <CheckBadgeIcon className="w-5 h-5" />
              <span>Özel Kamp İçeriği</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FİLTRE BAR --- */}
      <section className="bg-white border-b border-gray-100 transition-all">
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
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-md transform scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Arama */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64 group">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Kamp ara..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
                />
              </div>
              <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- KART GRID --- */}
      <section className="py-12 bg-gray-50 min-h-[600px]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">

          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FireIcon className="h-5 w-5 text-orange-500" />
                {activeCategory === "Tümü" ? "Tüm Kamp Programları" : `${activeCategory} Kampları`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredKamplar.length} kamp listeleniyor
              </p>
            </div>
          </div>

          {filteredKamplar.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredKamplar.map((course, idx) => (
                <FadeIn key={course.id} delay={idx * 0.05}>
                  <CourseCard {...course} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                <FunnelIcon className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sonuç Bulunamadı</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                Arama kriterlerinize uygun bir kamp bulamadık. Lütfen filtreleri temizleyip tekrar deneyin.
              </p>
              <button
                onClick={() => { setActiveCategory("Tümü"); setInputValue(""); setSearchTerm(""); }}
                className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-200"
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
