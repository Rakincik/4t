
// Dosya Yolu: app/kurs-kategori/[slug]/page.tsx
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  PlayCircleIcon,
  SparklesIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import ComparisonTable from "@/app/components/ComparisonTable";
import CourseCard from "@/app/components/CourseCard";
import LeadForm from "@/app/components/LeadForm";

/* ------------------------------------------------------------------ */
/* TYPES                                                              */
/* ------------------------------------------------------------------ */
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return [
    { slug: "kaymakamlik" },
    { slug: "kpss-a" },
    { slug: "sayistay" },
    { slug: "guy" },
  ];
}

type CategoryMeta = {
  title: string;
  description: string;
  heroTag: string;
  showComparison?: boolean;
  examPreset?: "Kaymakamlık" | "KPSS A" | "Sayıştay" | "GUY" | "Kararsızım";
};

/* ------------------------------------------------------------------ */
/* CATEGORY CONFIG (ileride CMS’e taşınır)                             */
/* ------------------------------------------------------------------ */
const CATEGORY_META: Record<string, CategoryMeta> = {
  kaymakamlik: {
    title: "Kaymakamlık Hazırlık Programları",
    description:
      "Kaymakamlık sınavını kazandıran sistem: canlı dersler, 4T FLIX video arşivi ve danışmanlıkla hedefe tam odak.",
    heroTag: "En çok tercih edilen program",
    showComparison: true,
    examPreset: "Kaymakamlık",
  },
  "kpss-a": {
    title: "KPSS A Grubu Kursları",
    description:
      "KPSS A Grubu sınavları için sıfırdan ileri seviyeye; güncel müfredat, güçlü kadro ve 4T FLIX desteği.",
    heroTag: "KPSS A uzmanlık alanları",
    examPreset: "KPSS A",
  },
  sayistay: {
    title: "Sayıştay Denetçiliği Kursları",
    description:
      "Sayıştay için konu anlatımı + soru çözüm kampları + tekrar sistemi: eksik bırakmadan hazırlan.",
    heroTag: "Alan odaklı hazırlık",
    examPreset: "Sayıştay",
  },
  guy: {
    title: "Gelir Uzman Yardımcılığı (GUY)",
    description:
      "GUY sınavı için müfredata birebir, yoğunlaştırılmış ve güncel hazırlık paketleri.",
    heroTag: "Kurum sınavlarına özel",
    examPreset: "GUY",
  },
};

/* ------------------------------------------------------------------ */
/* DEMO DATA (CMS gelene kadar)                                       */
/* slug’a göre filtreleniyor                                          */
/* ------------------------------------------------------------------ */
const ALL_PROGRAMS = [
  {
    id: 1,
    slug: "115-donem-kaymakamlik",
    title: "115. Dönem Kaymakamlık Eğitim Kursu",
    category: "Kaymakamlık",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop",
    originalPrice: "₺19.500",
    discountedPrice: "₺15.500",
    duration: "500+ Saat",
    studentCount: "250 Öğrenci",
  },
  {
    id: 2,
    slug: "kaymakamlik-soru-kampi",
    title: "Kaymakamlık Soru Çözüm Kampı",
    category: "Kaymakamlık",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    originalPrice: "₺5.000",
    discountedPrice: "₺3.500",
    duration: "120 Saat",
    studentCount: "320 Öğrenci",
  },
  {
    id: 3,
    slug: "kpss-a-premium",
    title: "KPSS A Premium Online Kursu (2026)",
    category: "KPSS A",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
    originalPrice: "₺17.000",
    discountedPrice: "₺14.500",
    duration: "600+ Saat",
    studentCount: "410 Öğrenci",
  },
  {
    id: 4,
    slug: "kpss-a-iktisat-kampi",
    title: "KPSS A İktisat Soru Kampı",
    category: "KPSS A",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-16954a187c3d?q=80&w=1000&auto=format&fit=crop",
    originalPrice: "₺4.000",
    discountedPrice: "₺2.750",
    duration: "90 Saat",
    studentCount: "500+ Öğrenci",
  },
  {
    id: 5,
    slug: "sayistay-soru-kampi",
    title: "Sayıştay Denetçiliği Soru Çözüm Kampı",
    category: "Sayıştay",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1000&auto=format&fit=crop",
    originalPrice: "₺5.000",
    discountedPrice: "₺3.500",
    duration: "100 Saat",
    studentCount: "180 Öğrenci",
  },
  {
    id: 6,
    slug: "guy-hazirlik",
    title: "Gelir Uzman Yrd. (GUY) Hazırlık Paketi",
    category: "GUY",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1000&auto=format&fit=crop",
    originalPrice: "₺8.000",
    discountedPrice: "₺6.500",
    duration: "250 Saat",
    studentCount: "300 Öğrenci",
  },
];

function mapSlugToCategory(slug: string) {
  if (slug === "kaymakamlik") return "Kaymakamlık";
  if (slug === "kpss-a") return "KPSS A";
  if (slug === "sayistay") return "Sayıştay";
  if (slug === "guy") return "GUY";
  return null;
}

/* ------------------------------------------------------------------ */
/* LEAD (backend yokken console + localStorage)                        */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* PAGE                                                               */
/* ------------------------------------------------------------------ */
export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];

  if (!meta) {
    return (
      <main className="min-h-screen bg-white">
        <MainHeader />
        <div className="container mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-3xl font-extrabold text-dark">Kategori Bulunamadı</h1>
          <p className="mt-4 text-dark/60">Aradığınız kategori mevcut değil.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const category = mapSlugToCategory(slug);
  const programs = category
    ? ALL_PROGRAMS.filter((p) => p.category === category)
    : [];

  return (
    <main className="flex min-h-screen flex-col bg-light">
      <MainHeader />

      {/* ===================================================== */}
      {/* MINI LEAD BAR (kategori landing dönüşüm)              */}
      {/* ===================================================== */}
      <div className="bg-white/90 border-b border-black/10 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-dark/70">
            <SparklesIcon className="h-5 w-5 text-secondary" />
            Ücretsiz danışmanlık • 1 dk’da aran • {meta.examPreset ?? "Kararsızım"}
          </div>

          <a
            href="#danismanlik"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold btn-4t-secondary"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            Hemen Başla
          </a>
        </div>
      </div>

      {/* ===================================================== */}
      {/* HERO                                                  */}
      {/* ===================================================== */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -top-52 right-[-120px] h-[520px] w-[520px] rounded-full bg-secondary/8 blur-3xl" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-dark/70">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              {meta.heroTag}
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-dark">
              {meta.title}
            </h1>

            <p className="mt-6 text-lg text-dark/70">{meta.description}</p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="#programlar"
                className="btn-4t rounded-2xl px-8 py-3 text-base font-extrabold inline-flex items-center justify-center"
              >
                Programları İncele
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </a>

              <a
                href="/flix"
                className="btn-4t-secondary rounded-2xl px-8 py-3 text-base font-extrabold inline-flex items-center justify-center"
              >
                4T FLIX Video Arşivi
                <PlayCircleIcon className="ml-2 h-5 w-5" />
              </a>
            </div>

            <div className="mt-6 text-sm text-dark/50">
              Kararsızsan: <a className="font-extrabold text-primary hover:underline" href="#danismanlik">danışmanlık al</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* NEDEN 4T?                                             */}
      {/* ===================================================== */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "Yayın Yazarı uzman eğitmen kadrosu",
              "4T FLIX ile sınırsız tekrar + hızlandırma (2x)",
              "Her sınav sonrası güncellenen müfredat",
            ].map((item) => (
              <div key={item} className="card-4t glow-4t rounded-3xl p-6 flex items-center gap-3">
                <CheckBadgeIcon className="h-6 w-6 text-primary" />
                <span className="font-semibold text-dark">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* KARŞILAŞTIRMA TABLOSU (VARSA)                         */}
      {/* ===================================================== */}
      {meta.showComparison && (
        <section className="bg-light-muted py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ComparisonTable />
          </div>
        </section>
      )}

      {/* ===================================================== */}
      {/* PROGRAMLAR                                             */}
      {/* ===================================================== */}
      <section id="programlar" className="bg-light py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-dark">{meta.title}</h2>
            <p className="mt-4 text-lg text-dark/60">
              Aktif eğitim programlarımız ve paketlerimiz
            </p>
          </div>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
              {programs.map((p) => (
                <CourseCard
                  key={p.id}
                  slug={p.slug}
                  title={p.title}
                  category={p.category}
                  imageUrl={p.imageUrl}
                  originalPrice={p.originalPrice}
                  discountedPrice={p.discountedPrice}
                  duration={p.duration}
                  studentCount={p.studentCount}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center bg-white border border-black/10 rounded-3xl p-10">
              <h3 className="text-xl font-extrabold text-dark">Programlar yakında</h3>
              <p className="mt-2 text-dark/60">
                Bu kategori için içerikler güncelleniyor. Danışmanlık alırsan sana en uygun yolu hemen önerelim.
              </p>
              <a href="#danismanlik" className="mt-6 btn-4t rounded-2xl px-10 py-3 font-extrabold inline-flex items-center justify-center">
                Danışmanlık Al
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* LEAD FORM (dönüşüm)                                   */}
      {/* ===================================================== */}
      <section id="danismanlik" className="bg-white py-20 border-t border-black/10 scroll-mt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-light-muted px-3 py-1 text-xs font-extrabold text-dark/70">
                <PhoneIcon className="h-4 w-4 text-primary" />
                Ücretsiz danışmanlık
              </div>

              <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold text-dark">
                1 Dakikada Arayalım
              </h3>
              <p className="mt-4 text-lg text-dark/60">
                Hedefin <span className="font-extrabold text-dark">{meta.examPreset ?? "Kararsızım"}</span> ise,
                sana en doğru programı önerelim.
              </p>

              <div className="mt-6 space-y-3 text-sm text-dark/70">
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="h-5 w-5 text-primary" />
                  Program seçimi + çalışma planı önerisi
                </div>
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="h-5 w-5 text-primary" />
                  FLIX / canlı ders / kamp karşılaştırması
                </div>
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="h-5 w-5 text-primary" />
                  Kontenjan ve başlangıç tarihleri
                </div>
              </div>
            </div>

            <LeadForm presetExam={meta.examPreset ?? "Kararsızım"} source={`kategori:${slug}`} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


