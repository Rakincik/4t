// Dosya Yolu: app/kurslar/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { logViewItem, logAddToCart } from "@/lib/gtag";
import Image from "next/image";
import {
  StarIcon,
  PlayCircleIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  ShareIcon,
  HeartIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  TrophyIcon,
  UsersIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  BuildingLibraryIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/components/cart/cartStore";
import { useRouter } from "next/navigation";

const IconMap: Record<string, any> = {
  VideoCameraIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  TrophyIcon,
  UsersIcon,
  ClockIcon,
  BuildingLibraryIcon,
};
/* ===================================================== */
/* COMPONENT: MEDIA GALLERY (SOL ÜST)                    */
/* ===================================================== */
function CourseMediaGallery({ image, video, gallery = [] }: { image: string, video: string, gallery?: string[] }) {
  const hasVideo = Boolean(video);
  const [activeMedia, setActiveMedia] = useState<string>(hasVideo ? "video" : "image");

  const displayUrl = activeMedia === "video" ? video : (activeMedia === "image" ? image : activeMedia);

  return (
    <div className="space-y-4">
      {/* Main Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-gray-100 group">
        {activeMedia === "video" && hasVideo ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video 
              src={video} 
              controls 
              className="w-full h-full object-contain" 
              poster={image} 
              onPlay={(e) => {
                 // Geri izleme vb. play event
              }}
            />
          </div>
        ) : (
          <Image fill sizes="(max-width: 1024px) 100vw, 50vw" src={displayUrl} className="object-cover" alt="Media" />
        )}
      </div>

      {/* Thumbnails (Only show if there's video or extra gallery images) */}
      {(hasVideo || gallery.length > 0) && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {hasVideo && (
            <button
              onClick={() => setActiveMedia("video")}
              className={`relative w-24 md:w-32 flex-shrink-0 aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeMedia === "video" ? "border-[#DC2626] ring-2 ring-red-100" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image fill sizes="128px" src={image} className="object-cover" alt="Thumbnail" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PlayCircleIcon className="w-6 h-6 text-white" />
              </div>
            </button>
          )}

          <button
            onClick={() => setActiveMedia("image")}
            className={`relative w-24 md:w-32 flex-shrink-0 aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeMedia === "image" ? "border-[#DC2626] ring-2 ring-red-100" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <Image fill sizes="128px" src={image} className="object-cover" alt="Thumbnail" />
          </button>
          
          {gallery.map((gImg, idx) => (
             <button
                key={idx}
                onClick={() => setActiveMedia(gImg)}
                className={`relative w-24 md:w-32 flex-shrink-0 aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeMedia === gImg ? "border-[#DC2626] ring-2 ring-red-100" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image fill sizes="128px" src={gImg} className="object-cover" alt="Gallery Thumbnail" />
             </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================================================== */
/* COMPONENT: TABS (SCROLL SAVER)                        */
/* ===================================================== */
function CourseTabs({ course }: { course: any }) {
  const [activeTab, setActiveTab] = useState("ozet");

  const tabs = [
    { id: "ozet", label: "Genel Bakış" },
    { id: "mufredat", label: "Müfredat" },
    { id: "egitmen", label: "Eğitmen" },
  ];

  return (
    <div className="mt-8">
      {/* Tab Header */}
      <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto pb-1px hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
              ? "border-[#DC2626] text-[#DC2626]"
              : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8 min-h-[400px]">

        {/* 1. GENEL BAKIŞ */}
        {activeTab === "ozet" && (
          <div className="space-y-8 animate-fade-in">

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-[#0B1221] mb-4">Kurs Hakkında</h3>
              <div className="prose prose-sm md:prose-base text-gray-600 max-w-none break-normal [word-break:normal] text-pretty whitespace-normal" dangerouslySetInnerHTML={{ __html: (course.description || "").replace(/&nbsp;|\u00A0/g, " ") }} />
            </div>

            {/* Bento Grid Features */}
            {(() => {
              const bentoList = (course.bentoFeatures && Array.isArray(course.bentoFeatures))
                ? course.bentoFeatures
                : (course.bentoFeatures === null || course.bentoFeatures === undefined)
                  ? [
                      { icon: "VideoCameraIcon", title: `${course.stats?.hours || "1600+"} Saat Video`, subtitle: "4K kalitesinde çekimler" },
                      { icon: "DocumentTextIcon", title: `${course.stats?.resources || "0"} İndirilebilir Kaynak`, subtitle: "PDF notlar ve föyler" },
                      { icon: "DevicePhoneMobileIcon", title: "Mobil Erişim", subtitle: "iOS ve Android uyumlu" },
                    ]
                  : [];

              if (!bentoList || bentoList.length === 0) return null;

              return (
                <div>
                  <h3 className="text-xl font-bold text-[#0B1221] mb-4">Bu Kursta Neler Var?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {bentoList.map((item: any, idx: number) => {
                      const IconComponent = IconMap[item.icon] || VideoCameraIcon;
                      return (
                        <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2 hover:border-[#DC2626]/30 transition-colors">
                          <IconComponent className="w-8 h-8 text-[#DC2626]" />
                          <span className="font-bold text-[#0B1221]">{item.title}</span>
                          {item.subtitle && <span className="text-xs text-gray-500">{item.subtitle}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Learning Outcomes */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white">
              <h3 className="text-lg font-bold text-[#0B1221] mb-4">Kazanımlar</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((lo: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckBadgeIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {lo}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 2. MÜFREDAT */}
        {activeTab === "mufredat" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Toplam {course.curriculum.length} Bölüm</span>
              <span>{course.stats.hours} Saat</span>
            </div>
            {course.curriculum.map((section: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 font-bold text-[#0B1221] flex justify-between items-center">
                  <span>{section.title}</span>
                  <span className="text-xs font-normal text-gray-500">{section.duration}</span>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  {section.lessons && section.lessons.length > 0 ? (
                    section.lessons.map((les: any, lIndex: number) => {
                      const isPreview = les.isPreview;
                      return (
                        <a 
                          key={lIndex} 
                          href={isPreview && les.previewUrl ? les.previewUrl : undefined} 
                          target={isPreview ? "_blank" : undefined}
                          className={`flex items-center justify-between text-sm text-gray-600 group -mx-4 px-4 py-3 md:py-2 transition-colors ${isPreview ? "cursor-pointer hover:bg-gray-50" : "cursor-default opacity-80"}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isPreview ? <PlayCircleIcon className="w-5 h-5 text-[#DC2626]" /> : <LockClosedIcon className="w-4 h-4 text-gray-300" />}
                            <span className={isPreview ? "text-[#DC2626] font-medium" : ""}>{les.title || `Ders ${lIndex + 1}`}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                             {isPreview && <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider">Tanıtım</span>}
                             <span>{les.duration}</span>
                          </div>
                        </a>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-500 italic py-2 px-4 text-center">Bu bölüme henüz ders eklenmemiş.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. EĞİTMEN */}
        {activeTab === "egitmen" && (
          <div className="animate-fade-in space-y-8">
            {course.instructorList ? (
              <div 
                className="prose prose-sm md:prose-base text-gray-600 max-w-none break-normal [word-break:normal] text-pretty whitespace-normal" 
                dangerouslySetInnerHTML={{ __html: (course.instructorList || "").replace(/&nbsp;|\u00A0/g, " ") }} 
              />
            ) : (
              course.instructors && course.instructors.map((instructor: any, i: number) => (
                <div key={i} className="flex gap-6 items-start pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                    {instructor.image ? (
                      <Image fill sizes="96px" src={instructor.image} className="object-cover" alt={instructor.name} />
                    ) : (
                      <UsersIcon className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1221]">{instructor.name}</h3>
                    <p className="text-[#DC2626] font-medium mb-3">{instructor.title}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-yellow-500" /> {instructor.rating} Puan</div>
                      <div className="flex items-center gap-1"><UsersIcon className="w-4 h-4 text-gray-400" /> {instructor.students} Öğrenci</div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">{instructor.bio}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function KursDetailClient({ course }: { course: any }) {
  let upsell = { text: "", icon: "👑", bgColor: "#4c1d95", textColor: "#ffffff", animation: "animate-pulse" };
  if (course.flixUpsellText) {
    try {
      if (course.flixUpsellText.startsWith("{")) {
         upsell = { ...upsell, ...JSON.parse(course.flixUpsellText) };
      } else {
         upsell.text = course.flixUpsellText;
      }
    } catch {
      upsell.text = course.flixUpsellText;
    }
  }

  // Müşterinin Akış Kurgusu (Online/Offline Varyasyonları & Addon'lar)
  const [selectedVariantId, setSelectedVariantId] = useState(course.variants[0]?.id);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const handleAddonToggle = (id: string) => {
    setSelectedAddonIds(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };
  const clearAddons = () => setSelectedAddonIds([]); // Ek Seçenek İstemiyorum

  const selectedVariant = course.variants.find((v: any) => v.id === selectedVariantId) || course.variants[0];
  const addonsTotal = course.addons.filter((a: any) => selectedAddonIds.includes(a.id)).reduce((acc: number, curr: any) => acc + curr.price, 0);
  
  const currentPrice = selectedVariant.price + addonsTotal;
  const oldPrice = selectedVariant.oldPrice ? selectedVariant.oldPrice + addonsTotal : null;
  const discountRate = oldPrice && currentPrice ? (100 - (currentPrice * 100 / oldPrice)).toFixed(0) : "0";

  const { add } = useCart();
  const router = useRouter();

  useEffect(() => {
    logViewItem({
      id: course.id,
      title: course.title,
      price: course.price,
      category: course.type || "KURS"
    });
  }, [course]);

  const handleAddToCart = () => {
    const itemTitle = course.title + (selectedVariant.title ? ` (${selectedVariant.title})` : "");
    logAddToCart({
      id: course.id,
      title: itemTitle,
      price: currentPrice,
      category: course.type || "KURS"
    });
    add({
      id: course.id,
      slug: course.slug,
      title: itemTitle,
      price: currentPrice,
      imageUrl: course.imageUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      qty: 1,
      variantId: selectedVariant.id,
      selectedAddonIds: selectedAddonIds,
      isCouponApplicable: course.isCouponApplicable ?? true,
      isInstallmentApplicable: course.isInstallmentApplicable ?? true,
    }, { openDrawer: true });
  };

  const handleBuyNow = () => {
    const itemTitle = course.title + (selectedVariant.title ? ` (${selectedVariant.title})` : "");
    logAddToCart({
      id: course.id,
      title: itemTitle,
      price: currentPrice,
      category: course.type || "KURS"
    });
    add({
      id: course.id,
      slug: course.slug,
      title: itemTitle,
      price: currentPrice,
      imageUrl: course.imageUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      qty: 1,
      variantId: selectedVariant.id,
      selectedAddonIds: selectedAddonIds,
      isCouponApplicable: course.isCouponApplicable ?? true,
      isInstallmentApplicable: course.isInstallmentApplicable ?? true,
    }, { openDrawer: false });
    router.push("/sepet"); // Check out sayfasına da gidebilir
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <MainHeader />

      {/* FLIX Upsell Smart Bar */}
      {upsell.text && (
        <a 
          href={course.flixUpsellLink || "#"} 
          className="block text-center py-3 px-4 shadow-md sticky top-0 z-[60] text-sm md:text-base font-extrabold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition group"
          style={{ backgroundColor: upsell.bgColor, color: upsell.textColor }}
        >
          <div className={`flex items-center gap-2 ${upsell.animation !== "animate-none" ? upsell.animation : ""}`}>
             <span className="text-xl">{upsell.icon}</span>
             <span>{upsell.text}</span>
             <span className="ml-2 group-hover:translate-x-1 transition-transform" style={{ color: upsell.textColor }}>→</span>
          </div>
        </a>
      )}

      {/* Breadcrumb Area */}
      <div className="bg-[#0B1221] text-white py-8">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <span>Anasayfa</span> / <span>Kurslar</span> / <span className="text-white font-medium">{course.category}</span>
          </div>
          <h1 
            className="text-3xl lg:text-4xl font-extrabold max-w-3xl leading-tight mb-4 transition-colors [&>p]:inline break-normal [word-break:normal] text-pretty whitespace-normal"
            style={{ color: course.color || "white" }}
            dangerouslySetInnerHTML={{ __html: (course.title || "").replace(/&nbsp;|\u00A0/g, " ") }}
          />
          <div 
            className="text-lg text-gray-300 max-w-3xl mb-6 break-normal [word-break:normal] text-pretty whitespace-normal"
            dangerouslySetInnerHTML={{ __html: (course.subtitle || "").replace(/&nbsp;|\u00A0/g, " ") }}
          />

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <StarIcon className="w-5 h-5" />
              <span className="font-bold text-white ml-1">{course.rating}</span>
              <span className="text-gray-400 underline">({course.reviewCount} değerlendirme)</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <GlobeAltIcon className="w-5 h-5 text-gray-400" />
              <span>{course.language}</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <span>Son Güncelleme: {course.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT COLUMN (Content) - %66 */}
          <div className="lg:col-span-8 order-last lg:order-first">
            {/* Media Gallery */}
            <CourseMediaGallery image={course.image} video={course.video} gallery={course.gallery} />

            {/* MOBILE ONLY: Inline Variant & Addon Selector */}
            <div className="block lg:hidden mt-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              {/* Variant selection */}
              {course.variants.length > 1 && (
                <div className="mb-5">
                  <h4 className="text-sm font-extrabold text-gray-900 mb-2.5">Eğitim Modeli Seçin:</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {course.variants.map((variant: any) => {
                      const isSelected = selectedVariantId === variant.id;
                      const isOnline = variant.title.toLowerCase().includes("online");
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all relative group overflow-hidden ${
                            isSelected 
                              ? 'border-[#DC2626] bg-red-50/40 text-[#DC2626] shadow-md shadow-red-500/5' 
                              : 'border-gray-200 text-gray-500 hover:border-[#DC2626]/50 hover:bg-red-50/10'
                          }`}
                        >
                          <div className={`mb-1.5 rounded-lg p-1.5 transition-all ${isSelected ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'bg-gray-50 text-gray-400 group-hover:text-[#DC2626] group-hover:bg-[#DC2626]/5'}`}>
                            {isOnline ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <span className="font-extrabold text-xs">{variant.title}</span>
                          {isSelected && (
                            <div className="absolute top-0 right-0 bg-[#DC2626] text-white p-0.5 rounded-bl-md">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Addon selection */}
              {course.addons.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-sm font-extrabold text-gray-900 mb-2.5">Paketinize Ekleyin (İsteğe Bağlı):</h4>
                  <div className="space-y-2">
                    {course.addons.map((addon: any) => {
                      const isSelected = selectedAddonIds.includes(addon.id);
                      const isBook = addon.title.toLowerCase().includes("kitap") || addon.title.toLowerCase().includes("seti");
                      return (
                        <label 
                          key={addon.id} 
                          className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all relative group ${
                            isSelected 
                              ? 'border-[#DC2626] bg-red-50/40 shadow-md shadow-red-500/5' 
                              : 'border-gray-200 hover:border-[#DC2626]/50 hover:bg-red-50/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-4.5 h-4.5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-sm' : 'border-gray-300 bg-white group-hover:border-[#DC2626]'}`}>
                              {isSelected && (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            
                            <div className={`rounded-lg p-1 transition-all ${isSelected ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'bg-gray-50 text-gray-400 group-hover:text-[#DC2626] group-hover:bg-[#DC2626]/5'}`}>
                              {isBook ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479L12 14zm0 0L5.84 10.578a12.084 12.084 0 00-.665 6.479L12 14z" />
                                </svg>
                              )}
                            </div>

                            <span className={`font-bold text-xs truncate ${isSelected ? 'text-[#DC2626]' : 'text-gray-700'}`}>
                              {addon.title}
                            </span>
                          </div>
                          <span className={`text-xs font-black shrink-0 ${isSelected ? 'text-[#DC2626]' : 'text-gray-500'}`}>
                            +₺{addon.price.toLocaleString()}
                          </span>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleAddonToggle(addon.id)} 
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs & Content */}
            <CourseTabs course={course} />
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) - %33 */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">

              {/* Purchase Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">

                {/* Müşteri Akışı: Eğitim Modeli (Varyasyonlar) */}
                {course.variants.length > 1 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">1. Eğitim Modeli Seçin:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {course.variants.map((variant: any) => {
                        const isSelected = selectedVariantId === variant.id;
                        const isOnline = variant.title.toLowerCase().includes("online");
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariantId(variant.id)}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all relative group overflow-hidden ${
                              isSelected 
                                ? 'border-[#DC2626] bg-red-50/40 text-[#DC2626] shadow-md shadow-red-500/5' 
                                : 'border-gray-200 text-gray-500 hover:border-[#DC2626]/50 hover:bg-red-50/10'
                            }`}
                          >
                            <div className={`mb-1.5 rounded-lg p-1.5 transition-all ${isSelected ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'bg-gray-50 text-gray-400 group-hover:text-[#DC2626] group-hover:bg-[#DC2626]/5'}`}>
                              {isOnline ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                            <span className="font-extrabold text-sm">{variant.title}</span>
                            {isSelected && (
                              <div className="absolute top-0 right-0 bg-[#DC2626] text-white p-0.5 rounded-bl-md">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Müşteri Akışı: Ek Seçenekler (Addons) */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">2. Paketinize Ekleyin (İsteğe Bağlı):</h4>
                  <div className="space-y-2">
                    {course.addons.map((addon: any) => {
                      const isSelected = selectedAddonIds.includes(addon.id);
                      const isBook = addon.title.toLowerCase().includes("kitap") || addon.title.toLowerCase().includes("seti");
                      return (
                        <label 
                          key={addon.id} 
                          className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all relative group ${
                            isSelected 
                              ? 'border-[#DC2626] bg-red-50/40 shadow-md shadow-red-500/5' 
                              : 'border-gray-200 hover:border-[#DC2626]/50 hover:bg-red-50/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-sm' : 'border-gray-300 bg-white group-hover:border-[#DC2626]'}`}>
                              {isSelected && (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            
                            <div className={`rounded-lg p-1.5 transition-all ${isSelected ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'bg-gray-50 text-gray-400 group-hover:text-[#DC2626] group-hover:bg-[#DC2626]/5'}`}>
                              {isBook ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479L12 14zm0 0L5.84 10.578a12.084 12.084 0 00-.665 6.479L12 14z" />
                                </svg>
                              )}
                            </div>

                            <span className={`font-bold text-sm truncate ${isSelected ? 'text-[#DC2626]' : 'text-gray-700'}`}>
                              {addon.title}
                            </span>
                          </div>
                          <span className={`text-sm font-black shrink-0 ${isSelected ? 'text-[#DC2626]' : 'text-gray-500'}`}>
                            +₺{addon.price.toLocaleString()}
                          </span>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleAddonToggle(addon.id)} 
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                      
                      {/* "Ek Bir Seçenek İstemiyorum" Button */}
                      <button 
                        onClick={clearAddons}
                        className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all text-xs sm:text-sm font-bold flex items-center justify-between group cursor-pointer ${
                          selectedAddonIds.length === 0 
                            ? 'border-[#0B1221] bg-gray-50 text-[#0B1221] shadow-sm' 
                            : 'border-dashed border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedAddonIds.length === 0 ? 'border-[#0B1221] bg-white' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                            {selectedAddonIds.length === 0 && <div className="w-2.5 h-2.5 rounded-full bg-[#0B1221]"></div>}
                          </div>
                          <span>Ek Bir Seçenek İstemiyorum</span>
                        </div>
                      </button>
                    </div>
                  </div>

                <div className="flex items-end gap-3 mb-6 pt-4 border-t border-gray-100">
                  <div className="text-4xl font-extrabold text-[#0B1221]">₺{currentPrice.toLocaleString()}</div>
                  {oldPrice && (
                    <>
                      <div className="text-gray-400 line-through mb-1 text-lg">₺{oldPrice.toLocaleString()}</div>
                      <div className="ml-auto text-sm font-bold text-[#DC2626] bg-red-50 px-2 py-1 rounded">
                        %{discountRate} İndirim
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <button 
                    onClick={handleBuyNow} 
                    className="w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:-translate-y-1"
                    style={{ backgroundColor: course.color || "#DC2626", boxShadow: `0 10px 15px -3px ${course.color || "#DC2626"}4D` }}
                  >
                    Hemen Satın Al
                  </button>
                  <button 
                    onClick={handleAddToCart} 
                    className="w-full bg-white font-bold py-4 rounded-xl border-2 transition-colors"
                    style={{ color: course.color || "#0B1221", borderColor: course.color || "#e5e7eb" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${course.color || "#0B1221"}1A`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    Sepete Ekle
                  </button>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100 text-sm text-gray-600">
                  <div className="font-bold text-[#0B1221] mb-2">Bu Eğitime Dahil Olanlar:</div>
                  
                  {course.stats.hours && (
                    <div className="flex items-center gap-3">
                      <VideoCameraIcon className="w-5 h-5 text-gray-400" />
                      <span>{course.stats.hours} Saat Video İçerik</span>
                    </div>
                  )}

                  {/* Dinamik Seçenek Özeti */}
                  {selectedAddonIds.length > 0 && selectedAddonIds.map(id => {
                    const matched = course.addons.find((a: any) => a.id === id);
                    if (!matched) return null;
                    return (
                      <div key={id} className="flex items-center gap-3 animate-fade-in">
                        <CheckBadgeIcon className="w-5 h-5 text-[#DC2626]" />
                        <span className="font-bold text-[#DC2626]">{matched.title}</span>
                      </div>
                    );
                  })}

                  {course.stats.resources && (
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <span>{course.stats.resources} İndirilebilir Kaynak</span>
                    </div>
                  )}

                  {course.features && course.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckBadgeIcon className="w-5 h-5 text-gray-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Actions (Share/Wishlist) */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:text-[#0B1221] hover:border-gray-300 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                  <span className="text-sm">Paylaş</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:text-[#0B1221] hover:border-gray-300 transition-colors">
                  <HeartIcon className="w-5 h-5" />
                  <span className="text-sm">Kaydet</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR (Native App Feel) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between gap-4 animate-slide-up">
        <div>
          <div className="text-xs text-gray-500 line-through">{oldPrice && `₺${oldPrice.toLocaleString()}`}</div>
          <div className="text-2xl font-extrabold text-[#0B1221]">₺{currentPrice.toLocaleString()}</div>
        </div>
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-[#DC2626] font-bold text-white py-3.5 rounded-xl shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
          style={{ backgroundColor: course.color || "#DC2626" }}
        >
          Satın Al
        </button>
      </div>

      <Footer />
    </main>
  );
}
