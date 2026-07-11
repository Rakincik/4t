"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  { value: "default", label: "Önerilen Sıralama (Varsayılan)" },
  { value: "newest", label: "En Yeniler" },
  { value: "priceAsc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "priceDesc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "nameAsc", label: "İsim: A'dan Z'ye" }
];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function normalizeTR(s: string) {
  return s.trim().toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c");
}

export default function KurslarClient({ 
  initialCourses, 
  activeCategories = [], 
  initialCms = null 
}: { 
  initialCourses: any[], 
  activeCategories?: { name: string; slug: string }[],
  initialCms?: any
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("kategori") || "Tümü";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "Tümü") {
      params.delete("kategori");
    } else {
      params.set("kategori", cat);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("default");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [cms, setCms] = useState<any>(initialCms);

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
      else {
        const cCatArr = cCatNorm.split(',').map(s => s.trim());
        // ActiveCategory DB'den gelen bir kategori ismiyse
        const matchedCategory = activeCategories.find(ac => normalizeTR(ac.name) === catNorm);
        if (matchedCategory) {
           const matchSlug = normalizeTR(matchedCategory.slug);
           const matchName = normalizeTR(matchedCategory.name);
           matchCat = cCatArr.some(cat => cat === matchName || cat === matchSlug) || normalizeTR(c.slug).includes(matchSlug) || titleNorm.includes(matchSlug);
        } else {
           // Fallback (Kamp, Flix vb.)
           if (catNorm === normalizeTR("FLIX")) matchCat = (c.type === "FLIX" || cCatArr.includes("4t-flix") || cCatArr.includes("flix"));
           else if (catNorm === normalizeTR("Kamp")) matchCat = (c.type === "KAMP" || cCatArr.includes("kamp") || titleNorm.includes("kamp"));
           else matchCat = cCatArr.includes(catNorm); 
        }
      }

      const matchSearch = titleNorm.includes(normSearch);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchTerm, initialCourses, activeCategories]);

  const sortedCourses = useMemo(() => {
    let sorted = [...filteredCourses];
    if (sortOption === "priceAsc") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "priceDesc") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "newest") {
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortOption === "nameAsc") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || "", "tr-TR"));
    }
    return sorted;
  }, [filteredCourses, sortOption]);

  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCourses, currentPage, itemsPerPage]);

  const activeCategoriesList = useMemo(() => {
    const list = ["Tümü"];
    
    // DB'den gelen kategorileri direkt ekle
    activeCategories.forEach(cat => {
       list.push(cat.name);
    });
    
    // Kamp vs. manuel ekleyebiliriz DB'de yoksa
    if (!list.some(l => normalizeTR(l) === "kamp")) list.push("Kamp");
    if (!list.some(l => normalizeTR(l) === "flix")) list.push("FLIX");

    return list;
  }, [activeCategories]);

  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* --- FAZ 1: MODERN HERO VE İSTATİSTİK BANDI --- */}
      <section className="relative pt-4 sm:pt-12 pb-4 sm:pb-6 overflow-hidden">
        {/* Soyut Arka Plan Deseni (Kurumsal Gri) */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 mb-3 sm:mb-6 border border-red-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                {cms?.hero?.metadata?.badge || "2026 Erken Kayıt Dönemi"}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#0B1221] tracking-tight leading-[1.1] mb-3 sm:mb-6 whitespace-pre-wrap">
                {cms?.hero?.metadata?.title || "Geleceğinizi Şansa Bırakmayın."}
              </h1>

              <div className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-xl" dangerouslySetInnerHTML={{ __html: cms?.hero?.metadata?.desc || "Türkiye'nin en seçkin eğitmen kadrosu ve yapay zeka destekli öğrenme sistemiyle, hedefinize en kısa ve sağlam yoldan ulaşın." }} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* İstatistik Bandı (Slim Strip) */}
      <div className="border-y border-gray-100 bg-gray-50/50">
        <div className="container mx-auto max-w-7xl px-4 py-3 sm:py-4">
          <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-8 md:gap-12 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span><strong className="text-gray-900">{cms?.stats?.metadata?.s1Value || "25K+"}</strong> {cms?.stats?.metadata?.s1Label || "Öğrenci"}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span><strong className="text-gray-900">{cms?.stats?.metadata?.s2Value || "10K+"}</strong> {cms?.stats?.metadata?.s2Label || "Video Saati"}</span>
            </div>
            <div className="flex items-center gap-2">
              <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span><strong className="text-gray-900">{cms?.stats?.metadata?.s3Value || "%95"}</strong> {cms?.stats?.metadata?.s3Label || "Başarı Oranı"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FAZ 2: KATEGORİ ALANI VE FİLTRE BAR --- */}
      <section className="bg-white border-b border-gray-100 transition-all">
        {/* Kategori Başlığı ve Açıklaması */}
        {(cms?.categorySection?.metadata?.title || cms?.categorySection?.metadata?.desc) && (
          <div className="container mx-auto max-w-7xl px-4 pt-8 pb-4">
            {cms?.categorySection?.metadata?.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-[#0B1221] mb-2">{cms.categorySection.metadata.title}</h2>
            )}
            {cms?.categorySection?.metadata?.desc && (
              <div className="text-gray-500 text-sm md:text-base max-w-2xl" dangerouslySetInnerHTML={{ __html: cms.categorySection.metadata.desc }} />
            )}
          </div>
        )}
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Arama ve Sıralama (Mobilde En Üstte) */}
            <div className="flex items-center gap-3 w-full md:w-auto order-first md:order-last">
              <div className="relative w-full md:w-64 group">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#DC2626] transition-colors" />
                <input
                  type="text"
                  placeholder="Kurs ara..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:bg-white transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Kategori Hapları */}
            <div className="relative w-full md:flex-1">
              <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-3 -mx-4 px-4 md:flex-wrap md:overflow-x-visible md:pb-0 md:-mx-0 md:px-0 scrollbar-none">
                {activeCategoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border shrink-0",
                      activeCategory === cat
                        ? "bg-[#0B1221] text-white border-[#0B1221] shadow-md transform scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {cat.toLocaleUpperCase("tr-TR")}
                  </button>
                ))}
              </div>
              {/* Gradient Fade Overlay on Mobile */}
              <div className="absolute right-[-16px] top-0 bottom-3 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden" />
            </div>

          </div>
        </div>
      </section>

      {/* --- FAZ 3: KART GRID --- */}
      <section className="py-12 bg-gray-50 min-h-[600px]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">

          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeCategory === "Tümü" ? "Tüm Eğitim Programları" : `${activeCategory} Eğitimleri`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {sortedCourses.length} kurs listeleniyor
              </p>
            </div>

            {/* Yeni ve Belirgin Sıralama Menüsü */}
            <div className="relative flex-shrink-0 z-20">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500 hidden sm:inline">Sıralama:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#0B1221] focus:border-[#0B1221] cursor-pointer shadow-sm hover:border-gray-300 transition-colors appearance-none pr-8 relative"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {sortedCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {paginatedCourses.map((course) => (
                  <div key={course.id}>
                    <CourseCard {...course} />
                  </div>
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
                onClick={() => { handleCategoryClick("Tümü"); setInputValue(""); setSearchTerm(""); }}
                className="mt-6 px-6 py-2 rounded-xl bg-[#0B1221] text-white text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- FAZ 4: ALT YÖNLENDİRME (CTA) BÖLÜMÜ --- */}
      {(cms?.ctaSection?.metadata?.title || cms?.ctaSection?.metadata?.desc) && (
        <section className="bg-[#0B1221] py-16 relative overflow-hidden">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
            {cms?.ctaSection?.metadata?.title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {cms.ctaSection.metadata.title}
              </h2>
            )}
            {cms?.ctaSection?.metadata?.desc && (
              <div className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: cms.ctaSection.metadata.desc }} />
            )}
            {cms?.ctaSection?.metadata?.btnText && cms?.ctaSection?.metadata?.btnUrl && (
              <a
                href={cms.ctaSection.metadata.btnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
              >
                {cms.ctaSection.metadata.btnText}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
