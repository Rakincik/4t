// Dosya Yolu: app/components/BlogSection.tsx
import {
  ArrowRightIcon,
  NewspaperIcon,
  TagIcon,
} from "@heroicons/react/24/solid";

/* ===================================================== */
/* MOCK DATA (ileride CMS)                               */
/* ===================================================== */
const blogPosts = [
  {
    id: 1,
    title: "Kaymakamlık Sınavı: 2025 İçin Stratejik Çalışma Planı",
    category: "Strateji",
    href: "/blog/kaymakamlik-calisma-plani",
    imageUrl:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
    date: "3 Kasım 2025",
    readTime: "6 dk",
    excerpt:
      "Hedefe göre plan, tekrar döngüsü ve deneme analizini bir araya getirerek 8 haftalık net artıran çalışma düzeni.",
  },
  {
    id: 2,
    title: "İktisat Netlerini Artırmanın 5 Bilimsel Yolu",
    category: "Akademi",
    href: "/blog/iktisat-netleri",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-16954a187c3d?q=80&w=1200&auto=format&fit=crop",
    date: "1 Kasım 2025",
    readTime: "5 dk",
    excerpt:
      "Beynin öğrenme mekanizmasına göre tekrar aralıkları, aktif hatırlama ve soru seti stratejileriyle netleri yükselt.",
  },
  {
    id: 3,
    title: "Mülakat Teknikleri: Heyecanı Yenmek ve Özgüven",
    category: "Mülakat",
    href: "/blog/mulakat-teknikleri",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    date: "28 Ekim 2025",
    readTime: "7 dk",
    excerpt:
      "Mülakat günü sakin kalma, kendini doğru ifade etme ve kriz anlarında kontrolü ele alma yöntemleri.",
  },
];

const categories = ["Strateji", "Akademi", "Mülakat", "Duyuru"];

function CategoryPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-extrabold text-dark/70 hover:bg-light-muted transition"
    >
      <TagIcon className="h-4 w-4 text-primary" />
      {label}
    </button>
  );
}

/* ===================================================== */
/* SECTION                                               */
/* ===================================================== */
export default function BlogSection() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <section className="relative overflow-hidden bg-light py-20">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-52 right-[-140px] h-[520px] w-[520px] rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-56 left-[-140px] h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-extrabold text-dark/70 shadow-sm">
            <NewspaperIcon className="h-4 w-4 text-primary" />
            4T Akademi • Güncel rehberler
          </div>

          <h2 className="mt-5 text-3xl font-extrabold text-dark sm:text-4xl">
            Akademiden Güncel Yazılar
          </h2>
          <p className="mt-4 text-lg text-dark/60 max-w-3xl mx-auto">
            Sınav stratejileri, net artıran yöntemler ve mülakat taktikleri.
            4T’nin sistemiyle daha hızlı ilerle.
          </p>

          {/* Category row */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <CategoryPill key={c} label={c} />
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Featured card (2 cols) */}
          <a
            href={featured.href}
            className="lg:col-span-2 group rounded-3xl overflow-hidden border border-black/10 bg-white
                       shadow-[0_18px_60px_rgba(11,60,138,0.10)] hover:shadow-[0_24px_80px_rgba(11,60,138,0.16)]
                       transition"
          >
            <div className="relative h-72 md:h-80">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

              <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold text-dark">
                <TagIcon className="h-4 w-4 text-secondary" />
                {featured.category}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
                  {featured.title}
                </h3>
                <p className="mt-3 text-white/80 text-sm md:text-base max-w-2xl">
                  {featured.excerpt}
                </p>

                <div className="mt-5 flex items-center gap-4 text-xs md:text-sm text-white/80">
                  <span>{featured.date}</span>
                  <span className="opacity-60">•</span>
                  <span>{featured.readTime}</span>
                  <span className="opacity-60">•</span>
                  <span className="inline-flex items-center gap-2 font-extrabold text-white">
                    Devamını Oku
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </a>

          {/* Side cards */}
          <div className="space-y-8">
            {rest.map((post) => (
              <a
                key={post.id}
                href={post.href}
                className="group block rounded-3xl overflow-hidden border border-black/10 bg-white
                           shadow-[0_18px_60px_rgba(11,60,138,0.08)] hover:shadow-[0_24px_80px_rgba(11,60,138,0.14)]
                           transition"
              >
                <div className="relative h-44">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold text-dark">
                    <TagIcon className="h-4 w-4 text-primary" />
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-extrabold text-dark leading-snug group-hover:text-primary transition">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-dark/60 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-dark/60">
                    <span>{post.date}</span>
                    <span className="font-extrabold text-primary inline-flex items-center gap-2">
                      Oku
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/blog"
            className="btn-4t rounded-2xl px-8 py-4 text-base font-extrabold inline-flex items-center justify-center"
          >
            Tüm Blog Yazıları
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>

          <a
            href="/sana-uygun-kurs"
            className="btn-4t-secondary rounded-2xl px-8 py-4 text-base font-extrabold inline-flex items-center justify-center"
          >
            2 Dakikada Kursunu Seç (Test)
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
