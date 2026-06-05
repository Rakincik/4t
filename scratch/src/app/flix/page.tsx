// Dosya Yolu: app/flix/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PlayCircleIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TvIcon,
  PlusIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  BoltIcon
} from "@heroicons/react/24/solid";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";

/* ===================================================== */
/* HELPERS & DATA                                        */
/* ===================================================== */
const PACKAGES = [
  { id: 1, title: "Kaymakamlık FLIX", desc: "Mülki İdare Amirliği hayaline giden en kısa yol.", image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=600&auto=format&fit=crop", color: "from-blue-600 to-blue-900" },
  { id: 2, title: "Adli Hakimlik FLIX", desc: "Hakim ve Savcı adayları için eksiksiz arşiv.", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop", color: "from-red-600 to-red-900" },
  { id: 3, title: "İdari Hakimlik FLIX", desc: "İdari yargı sınavlarına özel içerik serisi.", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=600&auto=format&fit=crop", color: "from-purple-600 to-purple-900" },
  { id: 4, title: "KPSS A Grubu FLIX", desc: "Müfettiş ve Uzman Yardımcılığı kadroları.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop", color: "from-indigo-600 to-indigo-900" },
  { id: 5, title: "KPSS GY-GK FLIX", desc: "Memurluk yolculuğunda genel kültür & yetenek.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop", color: "from-pink-600 to-pink-900" },
  { id: 6, title: "Sayıştay FLIX", desc: "Sayıştay Denetçi Yardımcılığı özel paketi.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop", color: "from-green-600 to-green-900" },
  { id: 7, title: "İcra Müdürlüğü FLIX", desc: "Adalet Bakanlığı İcra Müdürlüğü sınavı.", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop", color: "from-orange-600 to-orange-900" },
  { id: 8, title: "Kurum Sınavları FLIX", desc: "GUY, MHUY ve Bankacılık sınavlarına odaklanın.", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop", color: "from-teal-600 to-teal-900" },
];

/* ===================================================== */
/* HERO SECTION (CINEMATIC)                              */
/* ===================================================== */
function FlixHero() {
  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#0B1221]">
      {/* Background Video Placeholder (Image for now) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-[#0B1221]/40 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-50"
          alt="Background"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="text-[#DC2626] font-black text-4xl tracking-tighter">4T</span>
            <span className="text-white font-light text-4xl tracking-widest border-l pl-2 border-white/30">FLIX</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8"
          >
            BAŞARIYI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-red-500">SOLUKSUZ</span> <br />
            İZLEYİN.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg md:text-xl font-light max-w-xl mb-10 leading-relaxed"
          >
            Türkiye'nin en kapsamlı dijital sınav arşivi. 20.000+ saat video, sınırsız tekrar, istediğin yerden erişim. Şimdi izlemeye başla.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button className="flex items-center gap-3 bg-[#DC2626] hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-900/50">
              <PlayCircleIcon className="w-8 h-8" />
              <span>Paketleri İncele</span>
            </button>
            <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg font-bold transition-all border border-white/10">
              <PlusIcon className="w-6 h-6" />
              <span>Listeme Ekle</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* CATALOG SECTION (POSTER GRID)                         */
/* ===================================================== */
function PackageCatalog() {
  return (
    <section className="bg-[#0B1221] py-20 relative z-10 -mt-20">
      <div className="container mx-auto px-6">
        <h3 className="text-white font-bold text-2xl mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-[#DC2626] rounded-full"></span>
          Popüler Paketler
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg, i) => (
            <a href={`/flix/package-${pkg.id}`} key={pkg.id}>
              <motion.div
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="group relative aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden cursor-pointer shadow-black/50 shadow-2xl transition-all"
              >
                <img src={pkg.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className={`absolute inset-0 bg-gradient-to-t ${pkg.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="inline-block px-2 py-1 bg-[#DC2626] text-[10px] font-bold text-white rounded mb-2">YENİ SEZON</div>
                  <h4 className="text-white font-black text-2xl leading-none mb-2">{pkg.title}</h4>
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-3 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <BoltIcon className="w-4 h-4" />
                    %98 Eşleşme
                  </div>
                  <p className="text-gray-300 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-75">{pkg.desc}</p>

                  <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-150">
                    <div className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
                      <PlayCircleIcon className="w-6 h-6" />
                    </div>
                    <div className="border border-white/30 text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                      <PlusIcon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* DEVICE SHOWCASE                                       */
/* ===================================================== */
function DeviceShowcase() {
  return (
    <section className="bg-[#0B1221] py-24 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Her Yerde İzle. <br />
              <span className="text-gray-500">İstediğin Zaman İptal Et.</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              Metrobüste telefondan, ofiste bilgisayardan, evde tabletten.
              Kaldığın yerden devam etme özelliği ile asla kopma.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-8">
              <div className="text-center group">
                <ComputerDesktopIcon className="w-16 h-16 text-gray-600 group-hover:text-white transition-colors mx-auto mb-2" />
                <span className="text-gray-500 text-sm font-bold group-hover:text-white">Web</span>
              </div>
              <div className="text-center group">
                <TvIcon className="w-16 h-16 text-gray-600 group-hover:text-white transition-colors mx-auto mb-2" />
                <span className="text-gray-500 text-sm font-bold group-hover:text-white">Tablet</span>
              </div>
              <div className="text-center group">
                <DevicePhoneMobileIcon className="w-16 h-16 text-gray-600 group-hover:text-white transition-colors mx-auto mb-2" />
                <span className="text-gray-500 text-sm font-bold group-hover:text-white">Mobil</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Mockup Placeholder */}
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl shadow-2xl border border-white/10 opacity-80" alt="Devices" />
            <div className="absolute -bottom-10 -left-10 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-white font-bold">Offline İndirme Modu</div>
              </div>
              <div className="text-gray-400 text-xs mt-1">İnternet yokken bile çalışmaya devam et.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* TECH SPECS                                            */
/* ===================================================== */
function TechSpecs() {
  const specs = [
    { title: "Ultra HD Kalite", desc: "4K çekim kalitesiyle en ince tahta detaylarını bile kaçırma." },
    { title: "Akıllı Hız Kontrolü", desc: "1.25x, 1.5x, 2x hız seçenekleri ile zaman kazan." },
    { title: "Dijital Notlar", desc: "Videodaki her not PDF olarak seninle." },
    { title: "Soru Havuzu", desc: "Her video sonunda konu tarama testleri." }
  ];

  return (
    <section className="bg-[#0B1221] py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {specs.map((s, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <CheckCircleIcon className="w-8 h-8 text-[#DC2626] mb-4" />
              <h4 className="text-white font-bold text-lg mb-2">{s.title}</h4>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* FAQ SECTION (DARK MODE)                               */
/* ===================================================== */
function DarkFaq() {
  const faqs = [
    { q: "FLIX paketine canlı dersler dahil mi?", a: "Hayır, FLIX sadece video kütüphanesidir." },
    { q: "Aboneliği iptal edebilir miyim?", a: "Evet, taahhüt yok. İstediğiniz an panelden iptal edebilirsiniz." },
    { q: "Videoları indirebilir miyim?", a: "Telif hakları gereği indirme yok, ancak mobil uygulamamızda offline mod yakında geliyor." }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[#0B1221] py-24 border-t border-white/5">
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Sıkça Sorulan Sorular</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-white font-semibold">{faq.q}</span>
                {openIndex === i ? <ChevronUpIcon className="w-5 h-5 text-gray-400" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
              </button>
              {openIndex === i && (
                <div className="p-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm mb-4">Hazır mısınız?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input type="email" placeholder="E-posta adresiniz" className="bg-transparent border border-white/30 text-white px-6 py-4 rounded-lg w-full sm:w-80 focus:border-[#DC2626] focus:outline-none" />
            <button className="bg-[#DC2626] text-white px-8 py-4 rounded-lg font-bold w-full sm:w-auto hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              Başla <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* PAGE MAIN                                             */
/* ===================================================== */
export default function FlixPage() {
  return (
    <main className="min-h-screen bg-[#0B1221] font-sans selection:bg-[#DC2626] selection:text-white">
      <MainHeader />
      <FlixHero />
      <PackageCatalog />
      <DeviceShowcase />
      <TechSpecs />
      <DarkFaq />
      <Footer />
    </main>
  );
}
