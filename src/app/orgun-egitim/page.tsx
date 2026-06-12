// Dosya Yolu: app/orgun-egitim/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
function CampusMarquee({ images, title }: { images?: string[], title?: string }) {
  const defaultImages = [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"
  ];
  const list = (images && images.length > 0) ? images : defaultImages;

  return (
    <div className="w-full overflow-hidden bg-[#0B1221] py-12 border-y border-white/10">
      <div className="text-center mb-8">
        <span className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">{title || "Kampüs Yaşamı"}</span>
      </div>
      <div className="flex gap-6 animate-marquee w-max hover:pause">
        {[...list, ...list].map((src, i) => (
          <div key={i} className="w-80 h-52 rounded-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
            <Image fill sizes="320px" src={src} className="object-cover transform group-hover:scale-110 transition-transform duration-700" alt="Campus" />
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
import HeroSlider from "@/app/components/HeroSlider";

function CampusHero({ slides }: { slides?: any[] }) {
  const defaultSlides = [
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
      cta: "İletişime Geç",
      href: "/iletisim"
    }
  ];

  const list = (slides && slides.length > 0) ? slides : defaultSlides;
  return <HeroSlider slides={list} />;
}

/* ===================================================== */
/* COMPONENT: STYLIZED MAP (LOCATION) - INTERACTIVE      */
/* ===================================================== */
function LocationSection({ title, desc, address, hours, subTitle, hoursLabel, mapUrl }: { title?: string; desc?: string; address?: string; hours?: string; subTitle?: string; hoursLabel?: string; mapUrl?: string }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-[#DC2626] font-bold uppercase tracking-widest text-sm">{subTitle || "Lokasyon"}</span>
            <h2 className="text-4xl font-extrabold text-[#0B1221]">{title || <>Ankara'nın Kalbinde,<br />Ulaşımın Merkezinde.</>}</h2>
            <div className="text-lg text-gray-500 leading-relaxed [&_p]:inline [&_font]:inline [&_span]:inline" dangerouslySetInnerHTML={{ __html: desc || "Kızılay Metro istasyonuna 2 dakika yürüme mesafesinde. Bakanlıklar, Yargıtay ve Danıştay'ın yanı başında, motivasyonun merkezindesiniz." }} />

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <MapPinIcon className="w-8 h-8 text-[#DC2626]" />
                <div>
                  <div className="font-bold text-[#0B1221]">{address ? address.split(",")[0] : "Karanfil Sokak"}</div>
                  <div className="text-xs text-gray-500">{address ? address.split(",").slice(1).join(",") || "Kızılay" : "No: 44, Kızılay"}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <ClockIcon className="w-8 h-8 text-[#DC2626]" />
                <div>
                  <div className="font-bold text-[#0B1221]">{hours || "09:00 - 23:00"}</div>
                  <div className="text-xs text-gray-500">{hoursLabel || "Çalışma Saatleri"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] rounded-3xl overflow-hidden relative shadow-2xl border-4 border-white/50">
            <iframe 
              src={mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12239.529241517457!2d32.84444983088915!3d39.92131926615965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34faa85d58ad9%3A0x6b8d96bba622a5a5!2sKaranfil%20Sk.%20No%3A44%2C%20K%C4%B1z%C4%B1lay%2C%2006420%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1713454238531!5m2!1str!2str"}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* COMPONENT: PROGRAM DETAILS (Accordion / Cards)        */
/* ===================================================== */
function ProgramDetails({ title, items, subTitle }: { title?: string; items?: any[]; subTitle?: string }) {
  const defaultDetails = [
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

  const icons = [AcademicCapIcon, UserGroupIcon, BuildingLibraryIcon, CheckBadgeIcon];
  const list = (items && items.length > 0) ? items.map((item, index) => ({
    title: item.title,
    desc: item.desc,
    icon: icons[index % icons.length]
  })) : defaultDetails;

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#DC2626] font-bold uppercase tracking-widest text-sm">{subTitle || "Eğitim Modeli"}</span>
          <h2 className="text-4xl font-extrabold text-[#0B1221] mt-2">{title || "Neden 4T Örgün Eğitim?"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {list.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-[#DC2626] transition-colors group">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#DC2626] transition-colors">
                <item.icon className="w-8 h-8 text-[#DC2626] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1221] mb-3">{item.title}</h3>
              <div className="text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* COMPONENT: RICH CONTENT (CURRICULUM / TABLES)         */
/* ===================================================== */
function RichContentSection({ title, content, isActive }: { title?: string, content?: string, isActive?: boolean }) {
  if (!isActive || !content) return null;

  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto max-w-5xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#DC2626] font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <SparklesIcon className="w-4 h-4" /> Eğitim Müfredatı
          </span>
          {title && <h2 className="text-3xl font-extrabold text-[#0B1221] mt-2">{title}</h2>}
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 overflow-hidden">
          <div className="prose prose-slate max-w-none 
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-headings:text-[#0B1221] prose-headings:font-bold
            prose-a:text-[#DC2626] prose-a:font-semibold hover:prose-a:text-red-700
            prose-strong:text-[#0B1221] prose-strong:font-bold
            prose-ul:list-disc prose-ul:pl-5
            prose-ol:list-decimal prose-ol:pl-5
            prose-li:text-gray-600
            prose-tables:w-full prose-tables:border-collapse prose-tables:text-sm prose-tables:overflow-hidden prose-tables:rounded-xl
            prose-th:bg-gray-50 prose-th:text-gray-900 prose-th:font-extrabold prose-th:p-4 prose-th:text-left prose-th:border-b-2 prose-th:border-gray-200
            prose-td:p-4 prose-td:border-b prose-td:border-gray-100 prose-td:text-gray-600 prose-tr:transition-colors hover:prose-tr:bg-gray-50/50
            prose-img:rounded-2xl prose-img:shadow-md
            " dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* COMPONENT: FACULTY SHOWCASE (SPEAKERS STYLE)          */
/* ===================================================== */
function FacultyShowcase({ title, desc, items }: { title?: string; desc?: string; items?: any[] }) {
  const defaultTeachers = [
    { name: "Prof. Dr. Yüksel Bilgili", title: "İktisat Duayeni", imgUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
    { name: "Ahmet Albayrak", title: "Anayasa Hukuku", imgUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" },
    { name: "Zeynep Yılmaz", title: "Muhasebe Uzmanı", imgUrl: "https://images.unsplash.com/photo-1573496359-136d475583dc?q=80&w=400&auto=format&fit=crop" },
    { name: "Mehmet Öztürk", title: "Tarih Bölüm Başkanı", imgUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
  ];
  const list = (items && items.length > 0) ? items : defaultTeachers;

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#0B1221] mb-4">{title || "Şampiyonlar Ligi."}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {desc || "Sınav kazandıran kadro, sadece Ankara kampüsünde sizlerle. Birebir soru çözümü ve mentörlük desteği."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group relative cursor-pointer"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative mb-4 shadow-lg group-hover:shadow-2xl transition-all">
                <Image fill sizes="(max-width: 768px) 100vw, 25vw" src={t.imgUrl || t.img || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop"} alt={t.name} className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
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
function SuccessTimeline({ title, steps, imageUrl, badgeTitle, badgeValue }: { title?: string; steps?: any[]; imageUrl?: string; badgeTitle?: string; badgeValue?: string }) {
  const defaultSteps = [
    { title: "Seviye Belirleme", desc: "İlk gün yapılan deneme ile size en uygun sınıfı ve çalışma programını belirliyoruz." },
    { title: "Kamp Programı", desc: "Eksiklerinizi kapatmak için yoğunlaştırılmış konu anlatım kampları." },
    { title: "Soru Çözüm Etütleri", desc: "Haftalık düzenli denemeler ve birebir soru çözüm saatleri." },
    { title: "Zirveye Yolculuk", desc: "Sınav provası niteliğinde Türkiye geneli denemeler ve son taktikler." },
  ];
  const list = (steps && steps.length > 0) ? steps : defaultSteps;
  const imageSrc = imageUrl || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop";

  return (
    <section id="detaylar" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-[#0B1221] mb-8">{title || "Kazanma Garantili Sistem."}</h2>
            <div className="space-y-12">
              {list.map((step, i) => (
                <div key={i} className="flex gap-6 relative group">
                  {i !== list.length - 1 && <div className="absolute left-[19px] top-10 w-0.5 h-full bg-gray-200 group-hover:bg-red-200 transition-colors"></div>}
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#DC2626] flex items-center justify-center shrink-0 z-10 font-bold text-[#DC2626] group-hover:bg-[#DC2626] group-hover:text-white transition-colors shadow-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1221] mb-2">{step.title}</h3>
                    <div className="text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.desc }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#DC2626] rounded-3xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform"></div>
            <div className="relative w-full aspect-video md:aspect-[4/3]"><Image fill sizes="(max-width: 1024px) 100vw, 50vw" src={imageSrc} className="rounded-3xl shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500 object-cover" alt="Sınıf Ortamı" /></div>

            {/* Floating Badge */}
            <div className="absolute top-8 -right-8 bg-white p-4 rounded-xl shadow-xl animate-bounce-slow hidden lg:block">
              <div className="flex items-center gap-3">
                <CheckBadgeIcon className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-xs font-bold text-gray-400">{badgeTitle || "Başarı Oranı"}</div>
                  <div className="text-xl font-extrabold text-[#0B1221]">{badgeValue || "%85"}</div>
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
/* PAGE MAIN                                             */
/* ===================================================== */
export default function FormalEducationPage() {
  const [cms, setCms] = useState<any>(null);
  useEffect(() => {
    fetch("/api/admin/page-content?page=orgun-egitim").then(r => r.json()).then(d => setCms(d)).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans">
      <MainHeader />
      <CampusHero slides={cms?.heroSlides?.metadata?.items} />
      <CampusMarquee images={cms?.gallery?.metadata?.items} title={cms?.gallery?.title} />
      <LocationSection
        title={cms?.location?.title}
        desc={cms?.location?.content}
        address={cms?.location?.metadata?.address}
        hours={cms?.location?.metadata?.hours}
        subTitle={cms?.location?.metadata?.subTitle}
        hoursLabel={cms?.location?.metadata?.hoursLabel}
        mapUrl={cms?.location?.metadata?.mapUrl}
      />
      <ProgramDetails title={cms?.programs?.title} items={cms?.programs?.metadata?.items} subTitle={cms?.programs?.metadata?.subTitle} />

      <RichContentSection 
        isActive={cms?.richContent?.metadata?.isActive ?? true} 
        title={cms?.richContent?.title} 
        content={cms?.richContent?.content} 
      />

      <FacultyShowcase
        title={cms?.faculty?.title}
        desc={cms?.faculty?.content}
        items={cms?.faculty?.metadata?.items}
      />
      <SuccessTimeline
        title={cms?.timeline?.title}
        steps={cms?.timeline?.metadata?.items}
        imageUrl={cms?.timeline?.metadata?.imageUrl}
        badgeTitle={cms?.timeline?.metadata?.badgeTitle}
        badgeValue={cms?.timeline?.metadata?.badgeValue}
      />
      <Footer />
    </main>
  );
}
