// Dosya Yolu: app/kurslar/[slug]/page.tsx
"use client";

import { useState, use } from "react";
import {
  StarIcon,
  PlayCircleIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  ShareIcon,
  HeartIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  TrophyIcon,
  UsersIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  BuildingLibraryIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";

/* ===================================================== */
/* COMPONENT: MEDIA GALLERY (SOL ÜST)                    */
/* ===================================================== */
function CourseMediaGallery({ image, video }: { image: string, video: string }) {
  const [activeMedia, setActiveMedia] = useState<"image" | "video">("video");

  return (
    <div className="space-y-4">
      {/* Main Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-gray-100 group">
        {activeMedia === "video" ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center cursor-pointer transition-transform group-hover:scale-110">
              <PlayCircleIcon className="w-12 h-12 text-white" />
            </div>
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-[#DC2626] text-white text-xs font-bold uppercase rounded hover:bg-red-700 cursor-pointer transition-colors">
              <PlayCircleIcon className="w-4 h-4" />
              Tanıtımı İzle
            </span>
          </div>
        ) : (
          <img src={image} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        <button
          onClick={() => setActiveMedia("video")}
          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeMedia === "video" ? "border-[#DC2626] ring-2 ring-red-100" : "border-transparent opacity-70 hover:opacity-100"}`}
        >
          <img src={image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <PlayCircleIcon className="w-6 h-6 text-white" />
          </div>
        </button>

        {[1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setActiveMedia("image")}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeMedia === "image" ? "border-[#DC2626] ring-2 ring-red-100" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <img src={`https://images.unsplash.com/photo-${i === 1 ? '1434030216411-0b793f4b4173' : i === 2 ? '1513258496099-48168024aec0' : '1552664730-d307ca884978'}?q=80&w=200&auto=format&fit=crop`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===================================================== */
/* COMPONENT: TABS (SCROLL SAVER)                        */
/* ===================================================== */
function CourseTabs({ course }: { course: any }) {
  const [activeTab, setActiveTab] = useState("ozet");

  const tabs = [
    { id: "ozet", label: "Genel Bakış" },
    { id: "mufredat", label: "Müfredat" },
    { id: "egitmen", label: "Eğitmen" },
    { id: "yorumlar", label: `Yorumlar (${course.reviewCount})` },
  ];

  return (
    <div className="mt-8">
      {/* Tab Header */}
      <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto pb-1px hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
              ? "border-[#DC2626] text-[#DC2626]"
              : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8 min-h-[400px]">

        {/* 1. GENEL BAKIŞ */}
        {activeTab === "ozet" && (
          <div className="space-y-8 animate-fade-in">

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-[#0B1221] mb-4">Kurs Hakkında</h3>
              <div className="prose prose-sm md:prose-base text-gray-600 max-w-none" dangerouslySetInnerHTML={{ __html: course.description }} />
            </div>

            {/* Bento Grid Features */}
            <div>
              <h3 className="text-xl font-bold text-[#0B1221] mb-4">Bu Kursta Neler Var?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2 hover:border-[#DC2626]/30 transition-colors">
                  <VideoCameraIcon className="w-8 h-8 text-[#DC2626]" />
                  <span className="font-bold text-[#0B1221]">{course.stats.hours} Saat Video</span>
                  <span className="text-xs text-gray-500">4K kalitesinde çekimler</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2 hover:border-[#DC2626]/30 transition-colors">
                  <DocumentTextIcon className="w-8 h-8 text-[#DC2626]" />
                  <span className="font-bold text-[#0B1221]">{course.stats.resources} İndirilebilir Kaynak</span>
                  <span className="text-xs text-gray-500">PDF notlar ve föyler</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2 hover:border-[#DC2626]/30 transition-colors">
                  <DevicePhoneMobileIcon className="w-8 h-8 text-[#DC2626]" />
                  <span className="font-bold text-[#0B1221]">Mobil Erişim</span>
                  <span className="text-xs text-gray-500">iOS ve Android uyumlu</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2 hover:border-[#DC2626]/30 transition-colors">
                  <AcademicCapIcon className="w-8 h-8 text-[#DC2626]" />
                  <span className="font-bold text-[#0B1221]">Bitirme Sertifikası</span>
                  <span className="text-xs text-gray-500">CV'nize ekleyebilirsiniz</span>
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white">
              <h3 className="text-lg font-bold text-[#0B1221] mb-4">Kazanımlar</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((lo: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckBadgeIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {lo}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 2. MÜFREDAT */}
        {activeTab === "mufredat" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Toplam {course.curriculum.length} Bölüm</span>
              <span>{course.stats.hours} Saat</span>
            </div>
            {course.curriculum.map((section: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 font-bold text-[#0B1221] flex justify-between items-center">
                  <span>{section.title}</span>
                  <span className="text-xs font-normal text-gray-500">{section.duration}</span>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  {[1, 2, 3].map((l) => (
                    <div key={l} className="flex items-center justify-between text-sm text-gray-600 group cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-2 transition-colors">
                      <div className="flex items-center gap-3">
                        {l === 1 ? <PlayCircleIcon className="w-5 h-5 text-[#DC2626]" /> : <LockClosedIcon className="w-4 h-4 text-gray-300" />}
                        <span className={l === 1 ? "text-[#DC2626] font-medium" : ""}>Ders {l}: Konu Anlatımı</span>
                      </div>
                      <span className="text-xs text-gray-400">15:00</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. EĞİTMEN */}
        {activeTab === "egitmen" && (
          <div className="animate-fade-in">
            <div className="flex gap-6 items-start">
              <img src={course.instructor.image} className="w-24 h-24 rounded-full object-cover" />
              <div>
                <h3 className="text-xl font-bold text-[#0B1221]">{course.instructor.name}</h3>
                <p className="text-[#DC2626] font-medium mb-3">{course.instructor.title}</p>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-yellow-500" /> {course.instructor.rating} Puan</div>
                  <div className="flex items-center gap-1"><UsersIcon className="w-4 h-4 text-gray-400" /> {course.instructor.students} Öğrenci</div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{course.instructor.bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. YORUMLAR */}
        {activeTab === "yorumlar" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl font-extrabold text-[#0B1221]">{course.rating}</div>
              <div>
                <div className="flex text-yellow-500 mb-1">
                  {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} className="w-5 h-5" />)}
                </div>
                <div className="text-sm text-gray-500">Genel Kurs Puanı</div>
              </div>
            </div>

            {/* Reviews List */}
            {[1, 2, 3].map(r => (
              <div key={r} className="border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-[#0B1221]">Kullanıcı {r}</div>
                  <div className="text-xs text-gray-400">1 hafta önce</div>
                </div>
                <div className="flex text-yellow-500 w-20 mb-2">
                  {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} className="w-3 h-3" />)}
                </div>
                <p className="text-gray-600 text-sm">Bu kurs sayesinde eksiklerimi çok hızlı kapattım. Özellikle görsel materyaller çok başarılı. Tavsiye ederim.</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================================================== */
/* DATA & PAGE                                           */
/* ===================================================== */

function getCourseData(slug: string) {
  // Demo Data
  return {
    slug,
    title: "KPSS A Premium Online Hazırlık (2026)",
    subtitle: "Türkiye'nin en kapsamlı online hazırlık seti ile evinizden çıkmadan tüm konuları uzmanlarından öğrenin.",
    category: "KPSS A",
    rating: 4.9,
    reviewCount: 2345,
    lastUpdated: "Ocak 2026",
    language: "Türkçe",
    price: 14500, // Kitapsız Price
    priceWithBook: 16500, // Kitaplı Price
    oldPrice: 17000,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    video: "sample.mp4",
    stats: {
      hours: 640,
      resources: 120,
    },
    description: `
      <p>Bu kurs sıfırdan başlayanlar ve bilgilerini tazelemek isteyenler için özel olarak hazırlanmıştır. Klasik ezberci eğitim yerine, mantığı kavratan ve analitik düşünme becerisini geliştiren bir metot izliyoruz.</p>
      <p>Eğitim boyunca sadece videolara değil, zengin döküman arşivine, interaktif soru çözümlerine ve deneme sınavlarına da erişeceksiniz.</p>
    `,
    learningOutcomes: [
      "Ekonomi ve Hukuk derslerinin tüm detaylarına hakimiyet",
      "Hızlı soru çözme teknikleri ve sınav stratejileri",
      "Güncel mevzuat ve kanun değişikliklerinin analizi",
      "Yıl boyu rehberlik ve motivasyon desteği"
    ],
    curriculum: [
      { title: "İktisada Giriş", duration: "40 saat" },
      { title: "Mikro İktisat", duration: "50 saat" },
      { title: "Makro İktisat", duration: "45 saat" },
      { title: "Maliye Politikası", duration: "30 saat" },
      { title: "Vergi Hukuku", duration: "25 saat" },
    ],
    instructor: {
      name: "4T Akademi Kadrosu",
      title: "Uzman Eğitmenler",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
      rating: 4.8,
      students: "25K+",
      bio: "Alanında en az 15 yıl deneyimli, binlerce öğrenciyi kamuya kazandırmış, kitap yazarı eğitmenlerden oluşan dev kadro."
    }
  };
}

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = getCourseData(slug);
  const [withBook, setWithBook] = useState(true);

  const currentPrice = withBook ? course.priceWithBook : course.price;
  const discountRate = (100 - (currentPrice * 100 / course.oldPrice)).toFixed(0);

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <MainHeader />

      {/* Breadcrumb Area */}
      <div className="bg-[#0B1221] text-white py-8">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <span>Anasayfa</span> / <span>Kurslar</span> / <span className="text-white font-medium">{course.category}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold max-w-3xl leading-tight mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <StarIcon className="w-5 h-5" />
              <span className="font-bold text-white ml-1">{course.rating}</span>
              <span className="text-gray-400 underline">({course.reviewCount} değerlendirme)</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <GlobeAltIcon className="w-5 h-5 text-gray-400" />
              <span>{course.language}</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <span>Son Güncelleme: {course.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT COLUMN (Content) - %66 */}
          <div className="lg:col-span-8">
            {/* Media Gallery */}
            <CourseMediaGallery image={course.image} video={course.video} />

            {/* Tabs & Content */}
            <CourseTabs course={course} />
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) - %33 */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">

              {/* Purchase Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">

                {/* Options Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                  <button
                    onClick={() => setWithBook(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${withBook ? 'bg-white text-[#DC2626] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <BuildingLibraryIcon className="w-4 h-4" />
                    Kitaplı Paket
                  </button>
                  <button
                    onClick={() => setWithBook(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${!withBook ? 'bg-white text-[#DC2626] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <DevicePhoneMobileIcon className="w-4 h-4" />
                    Dijital Paket
                  </button>
                </div>

                <div className="flex items-end gap-3 mb-6">
                  <div className="text-4xl font-extrabold text-[#0B1221]">₺{currentPrice.toLocaleString()}</div>
                  <div className="text-gray-400 line-through mb-1 text-lg">₺{course.oldPrice.toLocaleString()}</div>
                  <div className="ml-auto text-sm font-bold text-[#DC2626] bg-red-50 px-2 py-1 rounded">
                    %{discountRate} İndirim
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <button className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all hover:-translate-y-1">
                    {withBook ? 'Kitaplı Paketi Satın Al' : 'Hemen Satın Al'}
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 text-[#0B1221] border border-[#0B1221]/20 font-bold py-4 rounded-xl transition-colors">
                    Sepete Ekle
                  </button>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100 text-sm text-gray-600">
                  <div className="font-bold text-[#0B1221] mb-2">Bu Eğitime Dahil Olanlar:</div>
                  <div className="flex items-center gap-3">
                    <VideoCameraIcon className="w-5 h-5 text-gray-400" />
                    <span>{course.stats.hours} Saat Video İçerik</span>
                  </div>

                  {/* Dynamic Book Item */}
                  {withBook && (
                    <div className="flex items-center gap-3 animate-fade-in">
                      <BuildingLibraryIcon className="w-5 h-5 text-[#DC2626]" />
                      <span className="font-bold text-[#DC2626]">Adresinize Basılı Kitap Seti</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    <span>{course.stats.resources} İndirilebilir Kaynak</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                    <span>Mobil ve TV Erişimi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrophyIcon className="w-5 h-5 text-gray-400" />
                    <span>Bitirme Sertifikası</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                    <span>Ömür Boyu Erişim</span>
                  </div>
                </div>
              </div>

              {/* Business Actions (Share/Wishlist) */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:text-[#0B1221] hover:border-gray-300 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                  <span className="text-sm">Paylaş</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:text-[#0B1221] hover:border-gray-300 transition-colors">
                  <HeartIcon className="w-5 h-5" />
                  <span className="text-sm">Kaydet</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
