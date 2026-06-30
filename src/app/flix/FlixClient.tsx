// Dosya Yolu: app/flix/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  ShoppingCartIcon,
  EyeIcon,
  BookOpenIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

import MainHeader from "@/app/components/MainHeader";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/app/components/Footer"));

/* ===================================================== */
/* DATA                                                  */
/* ===================================================== */
const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop",
    subtitle: "DİJİTAL VİDEO PLATFORMU",
    title: <>BAŞARIYI <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-red-400">SOLUKSUZ</span> İZLEYİN.</>,
    description: "20.000+ saat video, sınırsız tekrar, istediğin yerden erişim.",
  },
  {
    image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=2000&auto=format&fit=crop",
    subtitle: "EN ÇOK TERCİH EDİLEN",
    title: <>Kaymakamlık <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Video Arşivi</span></>,
    description: "Mülki İdare Amirliği sınavına özel 3.500+ saat ders videosu.",
  },
  {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop",
    subtitle: "YENİ SEZON AÇILDI",
    title: <>KPSS A Grubu <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tam Arşiv</span></>,
    description: "Müfettiş ve Uzman Yardımcılığı kadroları için 4.000+ saat video.",
  },
];

export type FlixProduct = {
  id: string | number;
  slug: string;
  title: string;
  desc: string;
  hours: string;
  questions: string;
  originalPrice: number;
  price: number;
  bookPrice: number;
  badge: string | null;
};

function formatCurrency(n: number) {
  return "₺" + n.toLocaleString("tr-TR");
}

/* ===================================================== */
/* FLIX PRODUCT CARD (with book toggle)                   */
/* ===================================================== */
function FlixProductCard({ product }: { product: FlixProduct }) {
  const [withBook, setWithBook] = useState(false);
  const p = product;
  const totalPrice = withBook ? p.price + p.bookPrice : p.price;

  return (
    <div className="group bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-[#DC2626]/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col h-full">
      {/* Kırmızı üst çizgi */}
      <div className="h-1 bg-[#DC2626] shrink-0" />

      <div className="p-5 flex flex-col flex-grow">
        {/* Badge */}
        {p.badge && (
          <span className="inline-block px-2 py-0.5 bg-[#DC2626] text-[10px] font-bold text-white rounded mb-2 uppercase tracking-wider">
            {p.badge}
          </span>
        )}

        <a href={`/flix/${p.slug}`} className="block hover:opacity-90 transition-opacity">
          <div className="text-white font-bold text-base mb-2 group-hover:text-[#DC2626] [&_*]:inline [&_*]:m-0 whitespace-pre-wrap transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: (p.title || "").replace(/&nbsp;/g, ' ') }} />
          <div className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3 [&_*]:inline [&_*]:m-0 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: (p.desc || "").replace(/&nbsp;/g, ' ') }} />
        </a>

        {/* Yıllık Abonelik Bilgisi */}
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <CalendarDaysIcon className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-[11px] text-blue-300 font-medium">Yıllık Abonelik — 12 ay boyunca açık kalır</span>
        </div>

        {/* Stats */}
        <div className="space-y-1.5 mb-4 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">Toplam Ders Saati</span><span className="text-white font-bold">{p.hours}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Video Çözümlü Soru</span><span className="text-white font-bold">{p.questions}</span></div>
        </div>

        {/* Kitaplı Seçenek Toggle */}
        <div className="mb-4">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Kitaplı Seçenek</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setWithBook(false)}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                !withBook
                  ? "bg-blue-600 border-blue-500 text-white shadow-md"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              <CalendarDaysIcon className="w-3.5 h-3.5" />
              Yıllık Abonelik
            </button>
            <button
              onClick={() => setWithBook(true)}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                withBook
                  ? "bg-[#DC2626] border-red-500 text-white shadow-md"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              <BookOpenIcon className="w-3.5 h-3.5" />
              Kitap Dahil
            </button>
          </div>
          {withBook && (
            <div className="text-[10px] text-green-400 mt-1.5 flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3" />
              Kitap Seti Dahil (+{formatCurrency(p.bookPrice)})
            </div>
          )}
        </div>

        <div className="mt-auto">
          {/* Fiyat Dökümü */}
          <div className="mb-4 space-y-1 text-xs border-t border-white/5 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Ürün toplamı</span>
              <span className="text-gray-400 line-through">{formatCurrency(p.originalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">İndirimli fiyat</span>
              <span className="text-white font-bold">{formatCurrency(p.price)}</span>
            </div>
            {withBook && (
              <div className="flex justify-between">
                <span className="text-gray-500">Kitap seti</span>
                <span className="text-white font-bold">+{formatCurrency(p.bookPrice)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-white/10 mt-1">
              <span className="text-white font-bold">Genel toplam</span>
              <span className="text-lg font-black text-white">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="text-[10px] text-green-400 font-medium text-right">Peşin fiyatına 12 taksit</div>
          </div>

          {/* Sepete Ekle Butonu */}
          <a
            href={`/flix/${p.slug}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#DC2626] text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            Sepete Ekle
          </a>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  "20.000+ Saat Ders Videosu",
  "Profesyonel Stüdyo Çekimi (4K)",
  "Sınırsız Tekrar Hakkı",
  "Hız Ayarı (1x – 2x)",
  "Konu Tarama Testleri",
  "7/24 Kesintisiz Erişim",
  "Kaldığın Yerden Devam",
  "Taahhüt Yok, İstediğin An İptal",
];

const FAQS = [
  { q: "4T FLIX nedir?", a: "4T FLIX, canlı derslerden bağımsız çalışan kayıtlı video (VOD) platformudur. Netflix gibi düşünün — ama sınavlara hazırlık için. Tüm dersler profesyonel stüdyoda çekilmiş, sınav odaklı özel içeriklerdir." },
  { q: "FLIX paketine canlı dersler dahil mi?", a: "Hayır, FLIX sadece video kütüphanesidir. Canlı dersler ayrı paketler halinde sunulmaktadır." },
  { q: "Aboneliği iptal edebilir miyim?", a: "Evet, taahhüt yoktur. İstediğiniz an panelden iptal edebilirsiniz." },
  { q: "Videoları indirebilir miyim?", a: "Telif hakları gereği indirme yok, ancak tüm cihazlardan (telefon, tablet, bilgisayar) online erişim mümkündür." },
];

/* ===================================================== */
/* PAGE COMPONENT                                        */
/* ===================================================== */
export default function FlixPage({ flixProducts }: { flixProducts: FlixProduct[] }) {
  const [current, setCurrent] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));

  const slide = HERO_SLIDES[current];

  return (
    <main className="min-h-screen bg-[#0B1221] font-sans selection:bg-[#DC2626] selection:text-white">
      <MainHeader />

      {/* ============ HERO SLIDER ============ */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden bg-[#0B1221]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={slide.image}
              className="w-full h-full object-cover opacity-40"
              alt=""
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5 }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/70 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221]/90 to-transparent z-[1]" />

        <div className="container mx-auto max-w-7xl px-6 relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[#DC2626] font-black text-3xl tracking-tighter">4T</span>
                <span className="text-white font-light text-3xl tracking-widest border-l pl-2 border-white/30">FLIX</span>
                <span className="ml-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                  {slide.subtitle}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-5">
                {slide.title}
              </h1>

              <p className="text-gray-300 text-lg font-light max-w-md mb-8">{slide.description}</p>

              <a href="#paketler" className="inline-flex items-center gap-3 bg-[#DC2626] hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-red-900/30">
                <PlayCircleIcon className="w-6 h-6" />
                Paketleri Gör
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Nav */}
        <div className="absolute bottom-8 right-6 md:right-12 flex gap-3 z-20">
          <button onClick={prevSlide} className="w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-8 left-6 md:left-1/2 md:-translate-x-1/2 flex gap-2.5 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => setCurrent(idx)} className={`h-1 rounded-full transition-all duration-300 ${current === idx ? "w-7 bg-[#DC2626]" : "w-2 bg-white/30"}`} />
          ))}
        </div>
      </section>

      {/* ============ FLIX NEDİR? (COMPACT) ============ */}
      <section className="bg-[#0B1221] border-t border-white/5 py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-white mb-4">4T FLIX Nedir?</h2>
              <p className="text-gray-400 text-base leading-relaxed mb-6">
                Canlı derslerden bağımsız çalışan <strong className="text-white">kayıtlı video (VOD)</strong> platformudur.
                Netflix gibi düşünün — ama sınavlara hazırlık için. Profesyonel stüdyoda çekilmiş, sınav odaklı özel ders videolarıyla
                kendi hızında çalış. Taahhüt yok, istediğin zaman iptal et.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="text-white font-bold"><span className="text-[#DC2626]">20.000+</span> Saat Video</div>
                <div className="text-white font-bold"><span className="text-[#DC2626]">8</span> Sınav Dalı</div>
                <div className="text-white font-bold"><span className="text-[#DC2626]">50+</span> Eğitmen</div>
                <div className="text-white font-bold"><span className="text-[#DC2626]">4K</span> Kalite</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TÜM FLIX PAKETLERİ (SATIŞ) ============ */}
      <section id="paketler" className="bg-[#0f1929] py-20 border-t border-white/5">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Tüm FLIX Paketleri</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Sınav dalına özel video paketini seç, hemen izlemeye başla. Tüm paketler sınırsız tekrar hakkı içerir.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {flixProducts.length > 0 ? (
              flixProducts.map((p) => (
                <FlixProductCard key={p.id} product={p} />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-10 text-gray-500">
                Henüz gösterilecek bir FLIX paketi bulunmamaktadır.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ SSS (COMPACT) ============ */}
      <section className="bg-[#0B1221] py-16 border-t border-white/5">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Sıkça Sorulan Sorular</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUpIcon className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href="#paketler" className="inline-flex items-center gap-2 bg-[#DC2626] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
              Paketleri İncele <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
