// Dosya Yolu: app/components/CourseTabs.tsx
"use client";

// SATIŞ ODAKLI + İTİRAZ KIRAN TABS
// - Müfredat: net özet + preview + CTA
// - Eğitmenler: güven veren “kanıt” dili + kartlar
// - Yorumlar: aggregate + featured + CTA
// - SSS: risk azaltma + kısa, net
// - Her tab sonunda "Satın almaya taşıyan" CTA şeridi

import { useMemo, useState } from "react";
import {
  AcademicCapIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon,
  ShieldCheckIcon,
  CloudArrowDownIcon,
  PlayCircleIcon,
  ArrowRightIcon,
  PhoneIcon,
  FireIcon,
  CheckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

type CourseProps = {
  whoFor: string[];
  notFor?: string[];
  features: { label: string; value: string }[];
  bonuses: string[];
  remaining?: number;
};

/* ---------------------------------------------------------------- */
/* 1) DATA (ileride CMS)                                            */
/* ---------------------------------------------------------------- */
const curriculumSections = [
  {
    title: "Bölüm 1: Anayasa Hukuku (40 Saat)",
    content:
      "Temel Hukuk Kavramları, Devlet Şekilleri, Hükümet Sistemleri, 1982 Anayasası, Temel Hak ve Hürriyetler, Yasama, Yürütme, Yargı.",
  },
  {
    title: "Bölüm 2: İdare Hukuku (50 Saat)",
    content:
      "İdarenin Yapısı, İdari İşlemler, İdarenin Sorumluluğu, Kamu Görevlileri, İdari Yargı, Memur Hukuku.",
  },
  {
    title: "Bölüm 3: İktisat (Mikro & Makro) (60 Saat)",
    content:
      "Arz-Talep Analizi, Piyasa Yapıları, Milli Gelir, Enflasyon, Para Politikaları, Dış Ticaret.",
  },
];

const instructors = [
  {
    name: "Prof. Dr. Yüksel Hoca",
    title: "İktisat Uzmanı",
    imageUrl: "https://via.placeholder.com/150",
    bio: "İktisat alanında 20 yıllık deneyim, yayın yazarı ve 5+ kitap. Konuyu “sade + sınav odaklı” anlatımıyla öne çıkar.",
    proof: ["Yayın yazarı", "20+ yıl deneyim", "5+ kitap"],
  },
  {
    name: "Doç. Dr. Ahmet Yılmaz",
    title: "Anayasa Hukuku",
    imageUrl: "https://via.placeholder.com/150",
    bio: "Anayasa alanında güçlü saha deneyimi. Karmaşık konuları sınav mantığıyla kısa sürede oturtmaya odaklanır.",
    proof: ["Alan uzmanı", "Sınav odaklı anlatım", "Düzenli tekrar planı"],
  },
];

const faqs = [
  {
    title: "Dersleri ne kadar süre izleyebilirim?",
    content:
      "Erişim süresi pakete göre değişir. Satın aldığınız paketin erişim süresi, kurs sayfasındaki satın alma kutusunda açıkça yer alır.",
  },
  {
    title: "Canlı dersleri kaçırırsam tekrarı var mı?",
    content:
      "Evet. Canlı dersler kayıt altına alınır ve erişim süreniz boyunca tekrar izlenebilir.",
  },
  {
    title: "PDF ders notları ve kaynaklar dahil mi?",
    content:
      "Evet. Ders notları ve ek dökümanlar ders bazlı olarak sisteme yüklenir. Pakete göre kapsam farklılaşabilir.",
  },
  {
    title: "İptal / iade süreci nasıl işliyor?",
    content:
      "İade şartları paket türüne göre değişebilir. Satın almadan önce “İptal ve İade Şartları” sayfamızı inceleyebilirsiniz.",
  },
];

/* ---------------------------------------------------------------- */
/* Utils                                                            */
/* ---------------------------------------------------------------- */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatCountdown(ms?: number) {
  if (!ms || ms <= 0) return "00:00:00";
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((ms % (1000 * 60)) / 1000);
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function parseHoursFromTitle(title: string) {
  const m = title.match(/\((\d+)\s*Saat\)/i);
  return m ? Number(m[1]) : 0;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "h-5 w-5",
            i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Accordion                                                        */
/* ---------------------------------------------------------------- */
function AccordionItem({
  title,
  content,
  defaultOpen = false,
}: {
  title: string;
  content: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/10">
      <h3>
        <button
          type="button"
          className="flex justify-between items-center w-full py-5 px-6 text-left text-base sm:text-lg font-extrabold text-dark hover:bg-white/40 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="pr-4">{title}</span>
          {isOpen ? (
            <ChevronUpIcon className="h-6 w-6 text-primary flex-shrink-0" />
          ) : (
            <ChevronDownIcon className="h-6 w-6 text-dark/40 flex-shrink-0" />
          )}
        </button>
      </h3>

      {isOpen && (
        <div className="pb-6 px-6 text-base text-dark/70 leading-relaxed bg-transparent">
          {content}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* TAB: GENEL BAKIŞ (OverviewTab)                                   */
/* ---------------------------------------------------------------- */
function OverviewTab({ course }: { course: CourseProps }) {
  return (
    <div className="space-y-8">
      {/* 1) Kimler İçin / Değil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6">
          <div className="text-sm font-bold text-dark/60">Bu paket kimler için?</div>
          <div className="mt-3 space-y-3">
            {course.whoFor.map((x) => (
              <div key={x} className="glass-card p-4 flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-dark/80">{x}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="text-sm font-bold text-dark/60">
            Kimler için uygun değil?
          </div>
          <div className="mt-3 space-y-3">
            {course.notFor?.map((x) => (
              <div
                key={x}
                className="glass-card p-4 flex items-start gap-2 bg-red-50/50 border-red-100"
              >
                <div className="h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-secondary font-extrabold text-sm">×</span>
                </div>
                <div className="text-sm text-dark/80">{x}</div>
              </div>
            ))}
            {!course.notFor?.length && (
              <div className="text-sm text-dark/60">
                Bu paket genel olarak herkese uygundur. Yine de özel durumun varsa
                WhatsApp’tan yaz.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2) Pakete Dahil Olanlar */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-extrabold text-dark mb-4">
          Pakete Dahil Olanlar
        </h3>
        <ul className="space-y-3">
          {course.features.map((f) => (
            <li key={f.label} className="flex items-center gap-3">
              <CheckBadgeIcon className="h-5 w-5 text-primary" />
              <span className="text-dark/80">
                {f.label}: <strong>{f.value}</strong>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3) Bonuslar */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div>
            <div className="text-sm font-bold text-dark/60">Bonus içerikler</div>
            <div className="text-xl font-extrabold text-dark mt-1">
              Paketin içine ekledik (ücretsiz)
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white/50 border border-white/50 px-4 py-2 backdrop-blur-sm">
            <FireIcon className="h-5 w-5 text-secondary" />
            <div className="text-sm font-extrabold text-dark">
              Kampanya: {formatCountdown(course.remaining)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
          {course.bonuses.map((b) => (
            <div key={b} className="glass-card p-4 flex gap-2 bg-white/60">
              <CheckBadgeIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-dark/80">{b}</div>
            </div>
          ))}
        </div>
      </div>

      <TabCtaStrip />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* CTA STRIP (her tab sonunda)                                      */
/* ---------------------------------------------------------------- */
function TabCtaStrip() {
  return (
    <div className="glass-premium rounded-3xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <CheckBadgeIcon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-extrabold text-dark">
              Kararsızsan 2 dakikada netleştirelim
            </div>
            <div className="mt-1 text-sm text-dark/60">
              Danışmanla konuş veya satın alma kutusuna gidip paket kapsamını hızlıca incele.
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#satin-al"
            className="btn-4t rounded-2xl px-6 py-3 text-sm font-extrabold inline-flex items-center justify-center"
          >
            Satın Alma Kutusuna Git
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>
          <a
            href="/iletisim"
            className="rounded-2xl px-6 py-3 text-sm font-extrabold inline-flex items-center justify-center
                       bg-white border border-black/10 hover:bg-light-muted transition"
          >
            <PhoneIcon className="h-5 w-5 mr-2 text-primary" />
            Danışmanla Görüş
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* TAB: Müfredat                                                    */
/* ---------------------------------------------------------------- */
function CurriculumTab() {
  const totalHours = useMemo(
    () =>
      curriculumSections.reduce((s, x) => s + parseHoursFromTitle(x.title), 0),
    []
  );

  const previewCount = 2;
  const preview = curriculumSections.slice(0, previewCount);
  const rest = curriculumSections.slice(previewCount);

  return (
    <div className="space-y-6">
      {/* İkna + netlik */}
      <div className="glass-card p-6 shadow-[0_18px_60px_rgba(11,60,138,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-dark/60">Müfredat Özeti</div>
            <div className="mt-1 text-2xl font-extrabold text-dark">
              {curriculumSections.length} bölüm • {totalHours}+ saat
            </div>
            <div className="mt-2 text-sm text-dark/60">
              İçerik sınav mantığıyla ilerler: konu + soru yaklaşımı + tekrar.
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold text-white btn-4t"
          >
            <CloudArrowDownIcon className="h-5 w-5 mr-2" />
            Örnek PDF
          </a>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-black/10 bg-light p-4">
            <div className="flex items-center gap-2 text-dark">
              <ClockIcon className="h-5 w-5 text-primary" />
              <span className="font-extrabold">Toplam süre</span>
            </div>
            <div className="mt-1 text-dark/70">{totalHours}+ saat</div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-light p-4">
            <div className="flex items-center gap-2 text-dark">
              <PlayCircleIcon className="h-5 w-5 text-secondary" />
              <span className="font-extrabold">Tekrar</span>
            </div>
            <div className="mt-1 text-dark/70">Dilediğin kadar izle</div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-light p-4">
            <div className="flex items-center gap-2 text-dark">
              <ShieldCheckIcon className="h-5 w-5 text-primary" />
              <span className="font-extrabold">Güncelleme</span>
            </div>
            <div className="mt-1 text-dark/70">Müfredata göre yenilenir</div>
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div className="glass-card overflow-hidden">
        {preview.map((item, idx) => (
          <AccordionItem
            key={item.title}
            title={item.title}
            content={item.content}
            defaultOpen={idx === 0}
          />
        ))}

        {rest.length > 0 && (
          <AccordionItem
            title={`+ ${rest.length} bölüm daha`}
            content="Tüm bölüm başlıkları ve detaylı içerik satın alımdan sonra öğrenci panelinde daha geniş görünür."
          />
        )}
      </div>

      <TabCtaStrip />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* TAB: Eğitmenler                                                  */
/* ---------------------------------------------------------------- */
function InstructorsTab() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="text-sm font-bold text-dark/60">Eğitmen kalitesi</div>
        <div className="mt-2 text-dark/70">
          “Yayın yazarı + sınav odaklı anlatım” farkı burada. Konuyu sadece anlatmayız; soru mantığıyla öğretiriz.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {instructors.map((instructor) => (
          <div
            key={instructor.name}
            className="glass-card p-6 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-start gap-5">
              <img
                className="h-20 w-20 rounded-2xl object-cover shadow-lg flex-shrink-0"
                src={instructor.imageUrl}
                alt={instructor.name}
              />
              <div className="min-w-0">
                <h3 className="text-xl font-extrabold text-dark">
                  {instructor.name}
                </h3>
                <p className="text-base font-bold text-primary">
                  {instructor.title}
                </p>
                <p className="mt-2 text-sm text-dark/70 leading-relaxed">
                  {instructor.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {instructor.proof.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold
                                 bg-light border border-black/10 text-dark/70"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TabCtaStrip />
    </div>
  );
}


/* ---------------------------------------------------------------- */
/* TAB: SSS                                                         */
/* ---------------------------------------------------------------- */
function FaqTab() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="text-sm font-bold text-dark/60">Hızlı cevaplar</div>
        <div className="mt-2 text-dark/70">
          Satın almadan önce en sık sorulanları netleştiriyoruz.
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {faqs.map((item, idx) => (
          <AccordionItem
            key={item.title}
            title={item.title}
            content={item.content}
            defaultOpen={idx === 0}
          />
        ))}
      </div>

      {/* risk azaltma mini strip */}
      <div className="glass-card p-6 bg-white/40">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-extrabold text-dark">Güvenli ilerleme</div>
            <div className="mt-1 text-sm text-dark/60">
              Ödeme güvenliği + erişim süreçleri + destek kanalları şeffaf. Takıldığın yerde danışman ekibi yanında.
            </div>
          </div>
        </div>
      </div>

      <TabCtaStrip />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* MAIN TABS                                                        */
/* ---------------------------------------------------------------- */
export default function CourseTabs({ course }: { course: CourseProps }) {
  const [activeTab, setActiveTab] = useState<
    "genel" | "mufredat" | "egitmenler" | "sss"
  >("genel");

  const tabs = [
    { id: "genel", name: "Genel Bakış", icon: InformationCircleIcon },
    { id: "mufredat", name: "Müfredat", icon: AcademicCapIcon },
    { id: "egitmenler", name: "Eğitmenler", icon: UserGroupIcon },
    { id: "sss", name: "S.S.S.", icon: QuestionMarkCircleIcon },
  ] as const;

  return (
    <div className="w-full">
      {/* Tab nav */}
      <div className="border-b border-black/10">
        <nav className="-mb-px flex flex-wrap gap-x-8 gap-y-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group inline-flex items-center py-4 px-1 border-b-4 font-extrabold text-base sm:text-lg transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-dark/60 hover:text-dark hover:border-black/20"
              )}
            >
              <tab.icon
                className={cn(
                  "-ml-0.5 mr-2 h-6 w-6",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-dark/40 group-hover:text-dark/70"
                )}
              />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="py-10">
        {activeTab === "genel" && <OverviewTab course={course} />}
        {activeTab === "mufredat" && <CurriculumTab />}
        {activeTab === "egitmenler" && <InstructorsTab />}
        {activeTab === "sss" && <FaqTab />}
      </div>
    </div>
  );
}
