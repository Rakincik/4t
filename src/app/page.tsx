// Dosya Yolu: app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AcademicCapIcon,
  PlayCircleIcon,
  ArrowRightIcon,
  UserGroupIcon,
  TrophyIcon,
  BuildingLibraryIcon,
  ScaleIcon,
  BanknotesIcon,
  BriefcaseIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

import MainHeader from "@/app/components/MainHeader";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/app/components/Footer"));
import HeroSlider from "@/app/components/HeroSlider";

/* ===================================================== */
/* COMPONENT: TRUST STRIP (AUTHORITY BAR)                */
/* ===================================================== */
function TrustStrip({ stats }: { stats: { label: string; value: string }[] }) {

  return (
    <div className="relative z-20 -mt-10 mb-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 grid grid-cols-2 gap-6 md:flex md:flex-wrap md:justify-between items-center">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#DC2626] to-red-400 rounded-full group-hover:scale-y-110 transition-transform"></div>
              <div>
                <div className="text-2xl font-extrabold text-[#0B1221] leading-none mb-1 group-hover:text-[#DC2626] transition-colors">{s.value}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================================================== */
/* COMPONENT: CATEGORY CARD                              */
/* ===================================================== */
function CategoryCard({ title, icon: Icon, href, desc }: { title: string, icon: any, href: string, desc: string }) {
  return (
    <Link href={href} className="group relative bg-white border border-gray-100 p-8 rounded-3xl hover:border-red-100/50 transition-all duration-300 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden block h-full">
      {/* Decor Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-8 -mt-8 transition-colors group-hover:bg-red-50"></div>

      <div className="relative z-10">
        <div className="w-14 h-14 bg-white border border-gray-100 shadow-sm text-[#0B1221] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#DC2626] group-hover:text-white group-hover:rotate-3 transition-all duration-300">
          <Icon className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-[#0B1221] mb-3 group-hover:text-[#DC2626] transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{desc}</p>

        <div className="flex items-center text-sm font-bold text-[#DC2626] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Programı İncele <ArrowRightIcon className="w-4 h-4 ml-2" />
        </div>
      </div>
    </Link>
  );
}

/* ===================================================== */
/* PAGE                                                  */
/* ===================================================== */
export default function Home() {
  const [cms, setCms] = useState<any>(null);
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/page-content?page=home").then(r => r.json()).then(d => setCms(d)).catch(() => {});
    fetch("/api/blog/latest").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setLatestBlogs(d);
    }).catch(() => {});
  }, []);

  const stats = cms?.stats?.metadata?.items || [
    { label: "Yıllık Tecrübe", value: "20+" },
    { label: "Mezun Sayısı", value: "25.000+" },
    { label: "Eğitmen Kadrosu", value: "50+" },
    { label: "Türkiye Derecesi", value: "100+" },
  ];
  const catTitle = cms?.categories?.title || "Hedefine Odaklan.";
  const catDesc = cms?.categories?.content || "4T Akademi'nin 20 yıllık tecrübesiyle hazırlanan, sınav formatına %100 uyumlu eğitim programları.";
  const flixTitle = cms?.flix?.title || "4T FLIX ile Özgürce Öğren.";
  const flixDesc = cms?.flix?.content || "Mesaiden sonra, yolda veya evde. 10.000 saati aşkın video ders arşivine 7/24 kesintisiz erişim. Tek üyelik, sınırsız bilgi.";
  
  const flixBtnBg = cms?.flix?.metadata?.btnBg || "#FFFFFF";
  const flixBtnColor = cms?.flix?.metadata?.btnColor || "#0B1221";
  const flixBtnPosition = cms?.flix?.metadata?.btnPosition || "left";
  const flixBg = cms?.flix?.metadata?.bgImage || "https://images.unsplash.com/photo-1531297461136-82lw33a4c8f0f?q=80&w=1600&auto=format&fit=crop";
  const flixDevice = cms?.flix?.metadata?.deviceImage || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop";

  const blogTitle = cms?.blog?.title || "Güncel Rehberlik Yazıları";
  const blogSubtitle = cms?.blog?.content || "Akademi Güncesi";

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-red-100 selection:text-red-900">
      <MainHeader />

      {/* 1. HERO SLIDER */}
      <HeroSlider
        slides={cms?.heroSlides?.metadata?.items?.length > 0 ? cms.heroSlides.metadata.items : [
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop",
            subtitle: "2026 ERKEN KAYIT DÖNEMİ",
            title: "Geleceğin Bürokratları Burada Yetişiyor.",
            description: "Kaymakamlık, Sayıştay ve KPSS A grubu sınavlarına, Türkiye'nin en köklü kurumuyla hazırlanın.",
            cta: "Eğitimleri İncele",
            href: "#kurslar"
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2670&auto=format&fit=crop",
            subtitle: "DİSİPLİN VE BAŞARI",
            title: "Yüz Yüze Eğitimde Şampiyonlar Ligi.",
            description: "Ankara Kızılay kampüsümüzde, alanında uzman kadromuzla birebir ilgi ve sınırsız etüt imkanı.",
            cta: "Kampüsü Keşfet",
            href: "/orgun-egitim"
          },
          {
            id: 3,
            image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2670&auto=format&fit=crop",
            subtitle: "4T YAYINEVİ",
            title: "Sınav Kazandıran Kaynaklar.",
            description: "Özgün sorular, konu anlatımlı kitaplar ve denemelerle kütüphanenizi tamamlayın.",
            cta: "Kitapları İncele",
            href: "https://4tyayinevi.com"
          }
        ]}
      />

      {/* 2. TRUST STRIP */}
      <TrustStrip stats={stats} />

      {/* 3. MAIN CATEGORIES (Refined Grid) */}
      <section id="kurslar" className="pb-24 pt-12">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold text-[#0B1221] mb-4">{catTitle}</h2>
              <div className="text-gray-500 text-lg [&_p]:inline [&_font]:inline [&_span]:inline" dangerouslySetInnerHTML={{ __html: catDesc }} />
            </div>
            <a href="/kurslar" className="text-[#DC2626] font-bold hover:text-red-800 flex items-center gap-2 group transition-colors">
              Tüm Programlar <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard
              title="Kaymakamlık"
              desc="Mülki İdare Amirliği sınavına özel, stratejik ve kapsamlı hazırlık seti."
              icon={BuildingLibraryIcon}
              href="/kurs-kategori/kaymakamlik"
            />
            <CategoryCard
              title="KPSS A Grubu"
              desc="Uzman, Müfettiş ve Denetçi kadroları için eksiksiz konu anlatımları."
              icon={BriefcaseIcon}
              href="/kurs-kategori/kpss-a"
            />
            <CategoryCard
              title="Sayıştay"
              desc="Denetçi Yardımcılığı sınavının zorlu müfredatına tam hakimiyet."
              icon={BanknotesIcon}
              href="/kurs-kategori/sayistay"
            />
            <CategoryCard
              title="Adli & İdari Yargı"
              desc="Hakimlik ve Savcılık sınavlarına yönelik derinlemesine hukuk eğitimi."
              icon={ScaleIcon}
              href="/kurs-kategori/hakimlik"
            />
          </div>
        </div>
      </section>

      {/* 4. FLIX PROMO (Cinematic) */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative bg-[#0B1221] rounded-[2.5rem] overflow-hidden shadow-2xl group">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <Image fill sizes="100vw" quality={60} src={flixBg} alt="Flix Promo" className="object-cover opacity-20 grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-[#0B1221]/90 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 items-center relative z-10 p-6 md:p-10 lg:p-20 gap-8 lg:gap-12">
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  <SparklesIcon className="w-4 h-4" />
                  Sınırsız Video Kütüphanesi
                </div>

                <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  {flixTitle.includes(" ") ? <>{flixTitle.split(" ").slice(0,-1).join(" ")} <br /><span className="text-blue-400">{flixTitle.split(" ").pop()}</span></> : flixTitle}
                </h2>

                <div className="text-gray-400 text-lg leading-relaxed [&_p]:inline [&_font]:inline [&_span]:inline" dangerouslySetInnerHTML={{ __html: flixDesc }} />

                <div className={`flex flex-col sm:flex-row gap-4 ${flixBtnPosition === "center" ? "justify-center" : flixBtnPosition === "right" ? "justify-end" : "justify-start"}`}>
                  <a href="/flix" style={{ backgroundColor: flixBtnBg, color: flixBtnColor }} className="px-6 py-3 md:px-8 md:py-4 text-center font-bold rounded-xl hover:brightness-110 transition-colors shadow-lg shadow-white/10">
                    Hemen Başla
                  </a>
                  <a href="/flix" className="px-6 py-3 md:px-8 md:py-4 text-center bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                    Detaylı Bilgi
                  </a>
                </div>
              </div>

              <div className="hidden lg:flex justify-end relative">
                {/* Mock Device / Card */}
                <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-2 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="relative overflow-hidden rounded-xl">
                    <Image width={600} height={400} src={flixDevice} alt="Flix Device" className="w-full h-auto object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircleIcon className="w-16 h-16 text-white drop-shadow-xl opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MINIMAL BLOG (Clean Layout) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#DC2626] font-bold uppercase tracking-widest text-sm">{blogSubtitle}</span>
            <h2 className="text-3xl font-extrabold text-[#0B1221] mt-2">{blogTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {(latestBlogs.length > 0 ? latestBlogs : [
              {
                slug: "yazi-1",
                category: "Rehberlik",
                createdAt: new Date(),
                title: "2026 KPSS A Sınav Takvimi ve Stratejileri",
                excerpt: "Sınav sürecinde motivasyonunuzu korumak ve doğru kaynaklarla çalışmak başarının anahtarıdır. İşte uzmanlarımızdan altın değerinde tavsiyeler...",
                imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop"
              },
              {
                slug: "yazi-2",
                category: "Rehberlik",
                createdAt: new Date(),
                title: "Kaymakamlık Mülakatlarında Dikkat Edilmesi Gerekenler",
                excerpt: "Sınav sürecinde motivasyonunuzu korumak ve doğru kaynaklarla çalışmak başarının anahtarıdır. İşte uzmanlarımızdan altın değerinde tavsiyeler...",
                imageUrl: "https://images.unsplash.com/photo-1506784381384-e36da0344b1c?q=80&w=600&auto=format&fit=crop"
              },
              {
                slug: "yazi-3",
                category: "Rehberlik",
                createdAt: new Date(),
                title: "Verimli Ders Çalışma ve Hafıza Teknikleri",
                excerpt: "Sınav sürecinde motivasyonunuzu korumak ve doğru kaynaklarla çalışmak başarının anahtarıdır. İşte uzmanlarımızdan altın değerinde tavsiyeler...",
                imageUrl: "https://images.unsplash.com/photo-1506784983877-45594fa4c58d?q=80&w=600&auto=format&fit=crop"
              }
            ]).slice(0,3).map((post, index) => (
              <a key={post.slug || index} href={`/blog/${post.slug}`} className="group cursor-pointer">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-gray-100 relative">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
                  <Image fill sizes="(max-width: 768px) 100vw, 33vw" src={post.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600"} className="object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider bg-red-50 px-2 py-1 rounded">{post.category || "Genel"}</span>
                  <span className="text-xs text-gray-400">
                    {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(post.createdAt))}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0B1221] leading-tight group-hover:text-[#DC2626] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 mt-3 line-clamp-2 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
