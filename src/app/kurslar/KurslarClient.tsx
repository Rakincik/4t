"use client";

import { useMemo, useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  CheckBadgeIcon,
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
import FadeIn from "@/app/components/ui/FadeIn"; // Animasyon için

const defaultSmartCategories = [
  "Kaymakamlık", "KPSS A", "Sayıştay", "GUY", 
  "Adli ve İdari Yargı", "Banka Sınavları", "Kurum Sınavları", "VMY",
  "Kamp"
];

const sortOptions = [
  { value: "default", label: "Varsayılan Sıralama" },
  { value: "priceAsc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "priceDesc", label: "Fiyat: Yüksekten Düşüğe" }
];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function normalizeTR(s: string) {
  return s.trim().toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c");
}

export default function KurslarClient({ initialCourses }: { initialCourses: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("default");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Gelişmiş Debounce (Geciktirme) Arama Etkisi
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Filtre değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchTerm, sortOption, itemsPerPage]);

  // Gelişmiş filtreleme
  const filteredCourses = useMemo(() => {
    const normSearch = normalizeTR(searchTerm);
    return initialCourses.filter((c) => {
      let matchCat = false;
      const catNorm = normalizeTR(activeCategory);
      const titleNorm = normalizeTR(c.title);
      const cCatNorm = c.category ? normalizeTR(c.category) : "";

      if (catNorm === normalizeTR("Tümü")) matchCat = true;
      else if (catNorm === normalizeTR("FLIX")) matchCat = (c.type === "FLIX" || cCatNorm === "4t-flix" || cCatNorm === "flix");
      else if (catNorm === normalizeTR("Kamp")) matchCat = (c.type === "KAMP" || cCatNorm === "kamp" || titleNorm.includes("kamp"));
      else if (catNorm === normalizeTR("Kaymakamlık")) matchCat = titleNorm.includes("kaymakamlik") || cCatNorm === "kaymakamlik";
      else if (catNorm === normalizeTR("KPSS A")) matchCat = (titleNorm.includes("kpss") && !titleNorm.includes("kurum")) || cCatNorm === "kpss a";
      else if (catNorm === normalizeTR("Sayıştay")) matchCat = titleNorm.includes("sayistay") || cCatNorm === "sayistay";
      else if (catNorm === normalizeTR("GUY")) matchCat = (titleNorm.includes("guy") || titleNorm.includes("gelir uzman")) || cCatNorm === "guy";
      else if (catNorm === normalizeTR("Adli ve İdari Yargı")) matchCat = (titleNorm.includes("adli") || titleNorm.includes("idari") || titleNorm.includes("yargi"));
      else if (catNorm === normalizeTR("Banka Sınavları")) matchCat = titleNorm.includes("banka");
      else if (catNorm === normalizeTR("Kurum Sınavları")) matchCat = titleNorm.includes("kurum");
      else if (catNorm === normalizeTR("VMY")) matchCat = titleNorm.includes("vmy") || cCatNorm === "vmy";
      else matchCat = cCatNorm === catNorm; // fallback

      const matchSearch = titleNorm.includes(normSearch);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchTerm, initialCourses]);

  const sortedCourses = useMemo(() => {
    let sorted = [...filteredCourses];
    if (sortOption === "priceAsc") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "priceDesc") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return sorted;
  }, [filteredCourses, sortOption]);

  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCourses, currentPage, itemsPerPage]);

  const activeCategoriesList = useMemo(() => {
    const list = ["Tümü", ...defaultSmartCategories];
    const normList = list.map(c => normalizeTR(c));
    
    initialCourses.forEach(c => {
        if (c.category) {
            const normCat = normalizeTR(c.category);
            if (normCat !== "uzaktan-egitim" && normCat !== "4t-flix" && normCat !== "kamp") {
                if (!normList.includes(normCat)) {
                    list.push(c.category);
                    normList.push(normCat);
                }
            }
        }
    });
    return list;
  }, [initialCourses]);

  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* --- FAZ 1: MODERN HERO VE İSTATİSTİK BANDI --- */}
      <section className="relative pt-12 pb-6 overflow-hidden">
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

      {/* --- FAZ 2: FILTRE BAR (MİNİMALİST) --- */}
      <section className="bg-white border-b border-gray-100 transition-all">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Kategori Hapları */}
            <div className="flex flex-wrap items-center gap-2 pb-1 md:pb-0">
              {activeCategoriesList.map((cat) => (
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
                  {cat.toLocaleUpperCase("tr-TR")}
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                />
              </div>
              
              {/* Sıralama Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={cn(
                    "p-2.5 rounded-full border transition-colors",
                    isSortOpen ? "bg-[#0B1221] text-white border-[#0B1221]" : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0B1221]"
                  )}
                  title="Sıralama Seçenekleri"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                    <div className="text-xs font-bold text-gray-400 mb-2 px-3 pt-2 uppercase tracking-wider">Sıralama</div>
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortOption(opt.value); setIsSortOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          sortOption === opt.value ? "bg-gray-100 text-[#0B1221]" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                {sortedCourses.length} kurs listeleniyor
              </p>
            </div>
          </div>

          {sortedCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedCourses.map((course, idx) => (
                  <FadeIn key={course.id} delay={idx * 0.05}>
                    <CourseCard {...course} />
                  </FadeIn>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 font-medium">
                  Toplam <strong className="text-gray-900">{sortedCourses.length}</strong> eğitim listeleniyor.
                </div>
                
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Sayfa Başına Gösterim Seçici */}
                  <div className="flex items-center gap-2 mr-4">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Göster:</span>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-0.5">
                      {[12, 24, 36, 48].map((l) => (
                        <button
                          key={l}
                          onClick={() => { setItemsPerPage(l); setCurrentPage(1); }}
                          className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                            itemsPerPage === l 
                              ? "bg-[#0B1221] text-white shadow-sm" 
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        Önceki
                      </button>
                      
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const pNum = i + 1;
                          return (
                            <button
                              key={pNum}
                              onClick={() => setCurrentPage(pNum)}
                              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                                currentPage === pNum
                                  ? "bg-[#0B1221] text-white shadow-md"
                                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                              }`}
                            >
                              {pNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0B1221] text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                      >
                        Sonraki
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
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
                onClick={() => { setActiveCategory("Tümü"); setInputValue(""); setSearchTerm(""); }}
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
