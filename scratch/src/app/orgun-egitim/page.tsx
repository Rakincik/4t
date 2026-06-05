// Dosya Yolu: app/orgun-egitim/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  AcademicCapIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  PlayCircleIcon
} from "@heroicons/react/24/solid";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";

/* ===================================================== */
/* COMPONENT: INFINITE MARQUEE (CAMPUS LIFE)             */
/* ===================================================== */
function CampusMarquee() {
  const images = [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"
  ];

  return (
    <div className="w-full overflow-hidden bg-[#0B1221] py-12 border-y border-white/10">
      <div className="text-center mb-8">
        <span className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">Kampüs Yaşamı</span>
      </div>
      <div className="flex gap-6 animate-marquee w-max hover:pause">
        {[...images, ...images].map((src, i) => (
          <div key={i} className="w-80 h-52 rounded-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
            <img src={src} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt="Campus" />
          </div>
        ))}
      </div>
      <style jsx>{`
            @keyframes marquee {
               0% { transform: translateX(0); }
               100% { transform: translateX(-50%); }
            }
            .animate-marquee {
               animation: marquee 40s linear infinite;
            }
            .hover\\:pause:hover {
               animation-play-state: paused;
            }
         `}</style>
    </div>
  );
}

/* ===================================================== */
/* COMPONENT: HERO WITH MOTION                           */
/* ===================================================== */
/* ===================================================== */
/* COMPONENT: HERO WITH MOTION                           */
/* ===================================================== */
/* ===================================================== */
/* COMPONENT: HERO WITH MOTION                           */
/* ===================================================== */
import HeroSlider from "@/app/components/HeroSlider";

function CampusHero() {
  const ankaraSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop",
      subtitle: "ANKARA MERKEZ KAMPÜSÜ",
      title: "Başarıyı Yerin'de Yaşa.",
      description: "Sadece ders dinlemeye değil, bir kültür kazanmaya geliyorsunuz. Kızılay'ın kalbinde, şampiyonlar ligi kadrosuyla buluşun.",
      cta: "Kampüsü Ziyaret Et",
      href: "#basvuru"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop",
      subtitle: "MODERN SINIFLAR",
      title: "Ferah ve Donanımlı Eğitim Ortamı.",
      description: "Öğrenci odaklı tasarlanmış 15 kişilik VIP sınıflarımızda derslere tam konsantre olun.",
      cta: "Sınıfları İncele",
      href: "#detaylar"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop",
      subtitle: "7/24 KÜTÜPHANE",
      title: "Sessiz, Nezih ve Verimli.",
      description: "Kendi masanızda, dikkatiniz dağılmadan saatlerce çalışabileceğiniz çalışma alanlarınız hazır.",
      cta: "Kütüphaneyi Gör",
      href: "#detaylar"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
      subtitle: "BİREBİR İLGİ",
      title: "Her Öğrenci Bizim İçin Özeldir.",
      description: "Rehberlik servisimiz ve etüt programlarımızla başarı yolculuğunuzda yalnız değilsiniz.",
      cta: "Randevu Al",
      href: "#basvuru"
    }
  ];

  return <HeroSlider slides={ankaraSlides} />;
}

/* ===================================================== */
/* COMPONENT: STYLIZED MAP (LOCATION) - INTERACTIVE      */
/* ===================================================== */
function LocationSection() {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-[#DC2626] font-bold uppercase tracking-widest text-sm">Lokasyon</span>
            <h2 className="text-4xl font-extrabold text-[#0B1221]">Ankara'nın Kalbinde,<br />Ulaşımın Merkezinde.</h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Kızılay Metro istasyonuna 2 dakika yürüme mesafesinde. Bakanlıklar, Yargıtay ve Danıştay'ın yanı başında, motivasyonun merkezindesiniz.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <MapPinIcon className="w-8 h-8 text-[#DC2626]" />
                <div>
                  <div className="font-bold text-[#0B1221]">Karanfil Sokak</div>
                  <div className="text-xs text-gray-500">No: 44, Kızılay</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <ClockIcon className="w-8 h-8 text-[#DC2626]" />
                <div>
                  <div className="font-bold text-[#0B1221]">09:00 - 23:00</div>
                  <div className="text-xs text-gray-500">Çalışma Saatleri</div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="h-[400px] rounded-3xl overflow-hidden relative shadow-2xl group cursor-pointer border-4 border-white/50"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {/* Interactive Map Visual */}
            <div className="absolute inset-0 overflow-hidden bg-gray-900">
              <motion.img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop"
                className="w-full h-full object-cover opacity-60"
                animate={{
                  scale: isZoomed ? 4.5 : 1, // Increased scale
                  x: isZoomed ? "20%" : "0%", // Pan right to fake location
                  y: isZoomed ? "15%" : "0%" // Pan down to fake location
                }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Overlay Interaction Prompt */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ opacity: isZoomed ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="w-24 h-24 bg-red-500/20 rounded-full animate-ping absolute inset-0"></div>
                <div className="w-24 h-24 bg-red-500/30 rounded-full flex items-center justify-center relative backdrop-blur-sm border border-red-500/50">
                  <MapPinIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Haritayı Yakınlaştır
                </div>
              </div>
            </motion.div>

            {/* Pin (Appears only when zoomed) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: isZoomed ? 1 : 0, scale: isZoomed ? 1 : 0.5, y: isZoomed ? 0 : -20 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <MapPinIcon className="w-20 h-20 text-[#DC2626] drop-shadow-2xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]" />
              <div className="bg-white/95 backdrop-blur px-6 py-4 rounded-2xl shadow-2xl mt-2 text-center border border-gray-100 min-w-[180px]">
                <div className="font-extrabold text-xl text-[#0B1221]">4T Akademi</div>
                <div className="text-xs text-[#DC2626] font-bold uppercase tracking-wide">Karanfil No:44</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* COMPONENT: PROGRAM DETAILS (Accordion / Cards)        */
/* ===================================================== */
function ProgramDetails() {
  const details = [
    {
      title: "Tam Kapsamlı Konu Anlatımı",
      desc: "Alanında uzman hocalarımızla tüm dersleri en ince ayrıntısına kadar işliyoruz. Sadece sınav odaklı değil, mesleki hayatta da kullanacağınız bilgilerle donatılıyorsunuz.",
      icon: AcademicCapIcon
    },
    {
      title: "Birebir Soru Çözüm & Etüt",
      desc: "Anlamadığınız konu veya çözemediğiniz soru kalmayacak. Randevulu sistemle hocalarımızla birebir görüşme imkanı.",
      icon: UserGroupIcon
    },
    {
      title: "Sınırsız Kaynak Desteği",
      desc: "4T Yayınevi'nin tüm kaynaklarına (soru bankaları, konu anlatımları, denemeler) ücretsiz erişim.",
      icon: BuildingLibraryIcon
    },
    {
      title: "Türkiye Geneli Denemeler",
      desc: "Gerçek sınav provası niteliğinde, binlerce kişinin katıldığı denemelerle yerinizi görün.",
      icon: CheckBadgeIcon
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#DC2626] font-bold uppercase tracking-widest text-sm">Eğitim Modeli</span>
          <h2 className="text-4xl font-extrabold text-[#0B1221] mt-2">Neden 4T Örgün Eğitim?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {details.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-[#DC2626] transition-colors group">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#DC2626] transition-colors">
                <item.icon className="w-8 h-8 text-[#DC2626] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1221] mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* COMPONENT: FACULTY SHOWCASE (SPEAKERS STYLE)          */
/* ===================================================== */
function FacultyShowcase() {
  const teachers = [
    { name: "Prof. Dr. Yüksel Bilgili", title: "İktisat Duayeni", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
    { name: "Ahmet Albayrak", title: "Anayasa Hukuku", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" },
    { name: "Zeynep Yılmaz", title: "Muhasebe Uzmanı", img: "https://images.unsplash.com/photo-1573496359-136d475583dc?q=80&w=400&auto=format&fit=crop" },
    { name: "Mehmet Öztürk", title: "Tarih Bölüm Başkanı", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#0B1221] mb-4">Şampiyonlar Ligi.</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Sınav kazandıran kadro, sadece Ankara kampüsünde sizlerle. Birebir soru çözümü ve mentörlük desteği.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group relative cursor-pointer"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative mb-4 shadow-lg group-hover:shadow-2xl transition-all">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="font-bold text-xl mb-1">{t.name}</div>
                  <div className="text-xs text-[#DC2626] font-bold uppercase tracking-widest">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* COMPONENT: SUCCESS TIMELINE                           */
/* ===================================================== */
function SuccessTimeline() {
  const steps = [
    { title: "Seviye Belirleme", desc: "İlk gün yapılan deneme ile size en uygun sınıfı ve çalışma programını belirliyoruz." },
    { title: "Kamp Programı", desc: "Eksiklerinizi kapatmak için yoğunlaştırılmış konu anlatım kampları." },
    { title: "Soru Çözüm Etütleri", desc: "Haftalık düzenli denemeler ve birebir soru çözüm saatleri." },
    { title: "Zirveye Yolculuk", desc: "Sınav provası niteliğinde Türkiye geneli denemeler ve son taktikler." },
  ];

  return (
    <section id="detaylar" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-[#0B1221] mb-8">Kazanma Garantili Sistem.</h2>
            <div className="space-y-12">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 relative group">
                  {i !== steps.length - 1 && <div className="absolute left-[19px] top-10 w-0.5 h-full bg-gray-200 group-hover:bg-red-200 transition-colors"></div>}
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#DC2626] flex items-center justify-center shrink-0 z-10 font-bold text-[#DC2626] group-hover:bg-[#DC2626] group-hover:text-white transition-colors shadow-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1221] mb-2">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#DC2626] rounded-3xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform"></div>
            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop" className="relative rounded-3xl shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500" alt="Sınıf Ortamı" />

            {/* Floating Badge */}
            <div className="absolute top-8 -right-8 bg-white p-4 rounded-xl shadow-xl animate-bounce-slow hidden lg:block">
              <div className="flex items-center gap-3">
                <CheckBadgeIcon className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-xs font-bold text-gray-400">Başarı Oranı</div>
                  <div className="text-xl font-extrabold text-[#0B1221]">%85</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* COMPONENT: APPLICATION FORM (LEAD CAPTURE)            */
/* ===================================================== */
function ApplicationForm() {
  return (
    <section id="basvuru" className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-[#0B1221] h-2/3"></div>
      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-14 border border-gray-100 text-center">
          <div className="mb-10">
            <span className="text-[#DC2626] font-bold uppercase tracking-widest text-sm bg-red-50 px-4 py-1 rounded-full">Sınırlı Kontenjan</span>
            <h2 className="text-4xl font-extrabold text-[#0B1221] mt-6">Tanışmak İçin Sabırsızlanıyoruz.</h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Ankara kampüsümüzü ziyaret etmek, sınıfları görmek ve eğitim danışmanlarımızla kahve eşliğinde hedeflerinizi konuşmak için randevu alın.
            </p>
          </div>

          <form className="max-w-2xl mx-auto space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Ad Soyad</label>
                <input type="text" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] outline-none transition-all" placeholder="Adınız Soyadınız" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Telefon</label>
                <input type="tel" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] outline-none transition-all" placeholder="0555 555 55 55" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">İlgilendiğiniz Alan</label>
              <select className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] outline-none transition-all appearance-none">
                <option>Kaymakamlık</option>
                <option>KPSS A Grubu</option>
                <option>Sayıştay</option>
                <option>İdari Hakimlik</option>
              </select>
            </div>

            <div className="pt-4">
              <button className="w-full bg-[#0B1221] hover:bg-gray-900 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-1 hover:shadow-2xl text-lg flex items-center justify-center gap-3">
                Randevu Talebi Oluştur <ArrowRightIcon className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-400 text-center mt-4">
                * Danışmanlarımız 24 saat içinde dönüş yapacaktır.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* PAGE MAIN                                             */
/* ===================================================== */
export default function FormalEducationPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <MainHeader />
      <CampusHero />
      <CampusMarquee />
      <LocationSection />
      <ProgramDetails />
      <FacultyShowcase />
      <SuccessTimeline />
      <ApplicationForm />
      <Footer />
    </main>
  );
}
