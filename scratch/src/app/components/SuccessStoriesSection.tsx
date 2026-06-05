// Dosya Yolu: app/components/SuccessStoriesSection.tsx
import {
  TrophyIcon,
  StarIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  UserGroupIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";

/* ===================================================== */
/* MOCK DATA (ileride CMS)                               */
/* ===================================================== */
const successStories = [
  {
    name: "Ahmet Yılmaz",
    title: "Kaymakam Adayı",
    exam: "Kaymakamlık",
    period: "115. Dönem",
    rating: 5,
    testimonial:
      "4T’nin disiplinli programı ve net artıran tekrar sistemi olmasaydı başaramazdım. Özellikle İktisat dersleri oyunu değiştirdi.",
    imageUrl: "https://via.placeholder.com/120",
    highlight: "Net artışı: +18",
  },
  {
    name: "Zeynep Demir",
    title: "Gelir Uzman Yrd.",
    exam: "GUY",
    period: "2025",
    rating: 5,
    testimonial:
      "Soru çözüm kamplarıyla zaman yönetimim oturdu. Konuyu bilmek yetmiyor; doğru pratik ve analiz şart. 4T’de sistem var.",
    imageUrl: "https://via.placeholder.com/120",
    highlight: "Deneme performansı: +%35",
  },
  {
    name: "Mehmet Öztürk",
    title: "Sayıştay Denetçisi",
    exam: "Sayıştay",
    period: "2025",
    rating: 5,
    testimonial:
      "Hukuk derslerindeki detaylı anlatım ve nokta atışı tekrar paketleri sayesinde rakiplerimin önüne geçtim. Güvenle öneririm.",
    imageUrl: "https://via.placeholder.com/120",
    highlight: "Sıralama: İlk 100",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
        />
      ))}
    </div>
  );
}

/* ===================================================== */
/* SECTION                                               */
/* ===================================================== */
export default function SuccessStoriesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-[-140px] h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-56 right-[-140px] h-[520px] w-[520px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-extrabold text-dark/70 shadow-sm">
            <TrophyIcon className="h-4 w-4 text-yellow-500" />
            Gerçek sonuçlar • Gerçek mezunlar
          </div>

          <h2 className="mt-5 text-3xl font-extrabold text-dark sm:text-4xl">
            Mezunlarımızdan Başarı Hikayeleri
          </h2>

          <p className="mt-4 text-lg text-dark/60 max-w-3xl mx-auto">
            4T’de hedef net: <span className="font-extrabold text-dark">net artırmak</span> ve
            sınav gününe <span className="font-extrabold text-dark">hazır</span> girmek.
          </p>

          {/* Proof strip */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-black/10 bg-light p-5">
              <div className="flex items-center justify-center gap-2 text-primary">
                <UserGroupIcon className="h-5 w-5" />
                <span className="text-2xl font-extrabold text-dark">25.000+</span>
              </div>
              <div className="mt-1 text-sm font-bold text-dark/60">Toplam kursiyer</div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-light p-5">
              <div className="flex items-center justify-center gap-2 text-secondary">
                <PlayCircleIcon className="h-5 w-5" />
                <span className="text-2xl font-extrabold text-dark">10.000+</span>
              </div>
              <div className="mt-1 text-sm font-bold text-dark/60">FLIX video saati</div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-light p-5">
              <div className="flex items-center justify-center gap-2">
                <Stars rating={5} />
                <span className="text-2xl font-extrabold text-dark">4.9</span>
              </div>
              <div className="mt-1 text-sm font-bold text-dark/60">Memnuniyet ort.</div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {successStories.map((story) => (
            <div
              key={story.name}
              className="rounded-3xl border border-black/10 bg-white overflow-hidden
                         shadow-[0_18px_60px_rgba(11,60,138,0.10)] hover:shadow-[0_24px_80px_rgba(11,60,138,0.16)]
                         transition"
            >
              {/* Top banner */}
              <div className="p-6 bg-light">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3 py-1 text-xs font-extrabold text-dark/70">
                    <CheckBadgeIcon className="h-4 w-4 text-primary" />
                    {story.exam} • {story.period}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary text-white px-3 py-1 text-xs font-extrabold">
                    {story.highlight}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <img
                    className="h-16 w-16 rounded-2xl object-cover shadow-lg border border-black/10"
                    src={story.imageUrl}
                    alt={story.name}
                  />
                  <div>
                    <div className="text-lg font-extrabold text-dark">{story.name}</div>
                    <div className="text-sm font-bold text-primary">{story.title}</div>
                    <div className="mt-1">
                      <Stars rating={story.rating} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="p-6">
                <p className="text-base text-dark/70 leading-relaxed italic">
                  &ldquo;{story.testimonial}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/kurslar"
            className="btn-4t rounded-2xl px-8 py-4 text-base font-extrabold inline-flex items-center justify-center"
          >
            Programları İncele
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>

        </div>
      </div>
    </section>
  );
}
