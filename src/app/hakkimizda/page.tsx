import prisma from "@/lib/prisma";
import {
  BuildingLibraryIcon,
  AcademicCapIcon,
  SparklesIcon,
  LightBulbIcon,
  EyeIcon,
  ArrowRightIcon,
  UsersIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid';

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import DynamicFaqBlock from "@/app/components/DynamicFaqBlock";
import Image from "next/image";

export const revalidate = 60; // ISR: Her 60 saniyede bir yeniden oluştur

// =========== DB'den sayfa içeriklerini çek ===========
async function getPageContent() {
  const contents = await prisma.pageContent.findMany({
    where: { pageSlug: "hakkimizda" },
  });
  const map: Record<string, any> = {};
  for (const c of contents) {
    map[c.sectionKey] = {
      title: c.title,
      content: c.content,
      ...(c.metadata as any || {}),
    };
  }
  return map;
}

// =========== DEFAULTS (fallback) ===========
const DEFAULTS = {
  hero: {
    title1: "Geleceğinizi",
    title2: "Şansa Bırakmayın",
    description: "Türkiye'nin en köklü ve prestijli kamu sınavlarına hazırlık platformu. On binlerce başarı hikayesinin arkasındaki güç.",
    stats: [
      { value: "25K+", label: "Atanan Öğrenci" },
      { value: "150+", label: "Uzman Eğitmen" },
      { value: "%98", label: "Memnuniyet" },
    ],
  },
  mission: {
    title: "Misyonumuz",
    content: "Her bir öğrencinin potansiyelini en üst düzeye çıkarmak için kişiselleştirilmiş eğitim modelini benimsiyoruz. Sadece bilgi yüklemek değil, bilgiyi kullanma becerisi kazandırarak kariyer yolculuklarında onlara rehberlik ediyoruz.",
  },
  vision: {
    title: "Vizyonumuz",
    content: "Eğitim teknolojilerindeki son gelişmeleri geleneksel öğretim metotlarıyla harmanlayarak, global standartlarda bir eğitim platformu oluşturmak. Türkiye'nin her köşesine fırsat eşitliği ilkesiyle kaliteli eğitimi ulaştırmak.",
  },
  values: {
    sectionTitle: "Değerlerimiz",
    sectionDesc: "Bizi biz yapan ve her gün daha iyisi için çalışmamızı sağlayan temel prensiplerimiz.",
    items: [
      { name: 'Uzmanlık', description: 'Alanında otorite kabul edilen eğitmen kadrosu.' },
      { name: 'Kalite', description: '4K video çekimleri ve zengin içerik arşivi.' },
      { name: 'Disiplin', description: 'Kişiye özel takip sistemi ve çalışma programları.' },
      { name: 'Güven', description: 'Şeffaf süreç ve %98 öğrenci memnuniyeti.' },
    ],
  },
  team: {
    title1: "Türkiye'nin En İyi",
    title2: "Eğitmen Kadrosu",
    description: "Sadece ders anlatan değil, sınav kazandıran bir kadro. Deneyim, bilgi ve rehberlik bir arada.",
    images: [
      { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
    ],
    statValue: "150+",
    statLabel: "Uzman Eğitmen",
  },
};

const VALUE_ICONS = [
  { icon: AcademicCapIcon, color: "text-blue-600", bg: "bg-blue-50" },
  { icon: SparklesIcon, color: "text-purple-600", bg: "bg-purple-50" },
  { icon: BuildingLibraryIcon, color: "text-red-600", bg: "bg-red-50" },
  { icon: CheckBadgeIcon, color: "text-green-600", bg: "bg-green-50" },
  { icon: LightBulbIcon, color: "text-amber-600", bg: "bg-amber-50" },
  { icon: EyeIcon, color: "text-cyan-600", bg: "bg-cyan-50" },
];

/* ---------------------------------- */
/* PAGE                              */
/* ---------------------------------- */
export default async function AboutPage() {
  const cms = await getPageContent();

  // Merge CMS data with defaults
  const hero = {
    title1: cms.hero?.title1 || DEFAULTS.hero.title1,
    title2: cms.hero?.title2 || DEFAULTS.hero.title2,
    description: cms.hero?.content || DEFAULTS.hero.description,
    stats: cms.hero?.stats || DEFAULTS.hero.stats,
  };

  const mission = {
    title: cms.mission?.title || DEFAULTS.mission.title,
    content: cms.mission?.content || DEFAULTS.mission.content,
  };

  const vision = {
    title: cms.vision?.title || DEFAULTS.vision.title,
    content: cms.vision?.content || DEFAULTS.vision.content,
  };

  const valuesData = {
    sectionTitle: cms.values?.title || DEFAULTS.values.sectionTitle,
    sectionDesc: cms.values?.content || DEFAULTS.values.sectionDesc,
    items: cms.values?.items || DEFAULTS.values.items,
  };

  const team = {
    title1: cms.team?.title1 || DEFAULTS.team.title1,
    title2: cms.team?.title2 || DEFAULTS.team.title2,
    description: cms.team?.content || DEFAULTS.team.description,
    images: cms.team?.images?.length > 0 ? cms.team.images : DEFAULTS.team.images,
    statValue: cms.team?.statValue || DEFAULTS.team.statValue,
    statLabel: cms.team?.statLabel || DEFAULTS.team.statLabel,
  };

  const faqItems = cms.faq?.items || [];

  return (
    <main className="flex min-h-screen flex-col bg-white font-sans">
      <MainHeader />

      {/* ============ HERO ============ */}
      <div className="relative w-full bg-[#0B1221] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#DC2626]/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-[20%] left-[20%] w-[200px] h-[200px] bg-white/5 rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <SparklesIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-bold text-white tracking-wide">4T AKADEMİ FARKI</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              {hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-orange-500">
                {hero.title2}
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {hero.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80">
              {hero.stats.map((stat: any, i: number) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                    <span className="text-xs uppercase tracking-wider">{stat.label}</span>
                  </div>
                  {i < hero.stats.length - 1 && <div className="w-px h-12 bg-white/20"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ MİSYON & VİZYON ============ */}
      <section className="bg-gray-50 py-24 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1221]">Rotamız ve Hedefimiz</h2>
            <p className="mt-4 text-gray-600">Başarıya giden yolda pusulamız belli.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MİSYON */}
            <div className="group relative bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><LightBulbIcon className="w-64 h-64 text-[#DC2626]" /></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform">
                  <LightBulbIcon className="w-8 h-8 text-[#DC2626]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1221] mb-4">{mission.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{mission.content}</p>
              </div>
            </div>
            {/* VİZYON */}
            <div className="group relative bg-[#0B1221] p-10 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><EyeIcon className="w-64 h-64 text-white" /></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:-rotate-6 transition-transform">
                  <EyeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{vision.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{vision.content}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DEĞERLER ============ */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1221]">{valuesData.sectionTitle}</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{valuesData.sectionDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuesData.items.map((item: any, i: number) => {
              const vi = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <div key={i} className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group bg-white">
                  <div className={`w-16 h-16 ${vi.bg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <vi.icon className={`h-8 w-8 ${vi.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1221] mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ EKİP ============ */}
      <section className="relative py-24 bg-[#0B1221] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#DC2626]/20 to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                {team.title1} <br />
                <span className="text-[#DC2626]">{team.title2}</span>
              </h2>
              <p className="text-lg text-gray-400">{team.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-white text-sm font-medium">Aktif Canlı Dersler</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-white text-sm font-medium">Soru Çözüm Kampları</span>
                </div>
              </div>
              <button className="flex items-center gap-3 bg-[#DC2626] text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/40">
                <span>Eğitmenlerimizi Tanıyın</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="lg:w-5/12 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  {team.images[0] && <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500"><Image fill sizes="(max-width: 768px) 50vw, 33vw" src={team.images[0].url} className="object-cover" alt="" /></div>}
                  {team.images[1] && <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500"><Image fill sizes="(max-width: 768px) 50vw, 33vw" src={team.images[1].url} className="object-cover" alt="" /></div>}
                </div>
                <div className="space-y-4">
                  {team.images[2] && <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500"><Image fill sizes="(max-width: 768px) 50vw, 33vw" src={team.images[2].url} className="object-cover" alt="" /></div>}
                  {team.images[3] && <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500"><Image fill sizes="(max-width: 768px) 50vw, 33vw" src={team.images[3].url} className="object-cover" alt="" /></div>}
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl"><UsersIcon className="w-6 h-6 text-green-600" /></div>
                <div>
                  <div className="text-2xl font-bold text-[#0B1221]">{team.statValue}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase">{team.statLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ (Optinal) ============ */}
      {faqItems && faqItems.length > 0 && (
          <DynamicFaqBlock items={faqItems} title="Hakkımızda Sıkça Sorulanlar" description="Kurumumuzla ilgili merak edilenler" />
      )}

      <Footer />
    </main>
  );
}