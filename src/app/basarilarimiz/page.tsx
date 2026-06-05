// Dosya Yolu: app/basarilarimiz/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { TrophyIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';

// TODO: Bu veriler CMS'ten çekilecek.
// Filtreleme için 'category' ve 'year' ekliyoruz.
const allSuccesses = [
  {
    id: 1,
    category: 'kaymakamlik',
    year: 2024,
    name: 'Ahmet Yılmaz',
    title: 'Kaymakam Adayı',
    testimonial: '"4T Akademi\'nin disiplinli programı ve Yüksel Hoca\'nın İktisat dersleri olmasaydı başaramazdım."',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    category: 'sayistay',
    year: 2024,
    name: 'Mehmet Öztürk',
    title: 'Sayıştay Denetçisi',
    testimonial: '"Hukuk derslerindeki detaylı anlatım sayesinde rakiplerimin önüne geçtim. Teşekkürler 4T."',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    category: 'guy',
    year: 2024,
    name: 'Zeynep Demir',
    title: 'Gelir Uzman Yrd.',
    testimonial: '"Soru çözüm kampları, sınavdaki zaman yönetimimi mükemmel hale getirdi. Pratik yapmak şart."',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 4,
    category: 'kaymakamlik',
    year: 2023,
    name: 'Elif Kaya',
    title: 'Kaymakam Adayı',
    testimonial: '"Sıfırdan başladım ve Premium paketle sonuca ulaştım. İmkansız değilmiş."',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 5,
    category: 'sayistay',
    year: 2023,
    name: 'Can Vural',
    title: 'Sayıştay Denetçisi',
    testimonial: '"FLIX kütüphanesi ve canlı derslerin birleşimi mükemmel bir sinerji yarattı."',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 6,
    category: 'kaymakamlik',
    year: 2024,
    name: 'Hasan Çelik',
    title: 'Kaymakam Adayı',
    testimonial: '"Ankara örgün eğitimdeki disiplin ve hocalarla birebir iletişim başarımı getirdi."',
    imageUrl: 'https://via.placeholder.com/150'
  },
];

// Filtre kategorileri (Dinamik de çekilebilir, şimdilik statik)
const filters = [
  { id: 'all', name: 'Tümü' },
  { id: 'kaymakamlik', name: 'Kaymakamlık' },
  { id: 'sayistay', name: 'Sayıştay' },
  { id: 'guy', name: 'GUY / Diğer' },
  { id: '2024', name: '2024 Yılı' },
  { id: '2023', name: '2023 Yılı' },
];

/* ---------------------------------- */
/* 1. Başarı Kartı (Alt-Bileşen)      */
/* ---------------------------------- */
function SuccessCard({ name, title, testimonial, imageUrl }: { name: string, title: string, testimonial: string, imageUrl: string }) {
  return (
    <div
      className="flex flex-col rounded-lg shadow-xl overflow-hidden
                 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="p-8 bg-white text-center">
        <img
          className="h-32 w-32 rounded-full object-cover mx-auto shadow-lg border-4 border-white"
          src={imageUrl}
          alt={name}
        />
        <h3 className="mt-5 text-xl font-bold text-gray-900">{name}</h3>
        <p className="text-base font-semibold text-blue-800 flex items-center justify-center">
          <CheckBadgeIcon className="h-5 w-5 mr-1.5" />
          {title}
        </p>
      </div>
      <blockquote className="p-8 flex-grow flex flex-col justify-center bg-gray-50 border-t border-gray-100">
        <p className="text-base text-gray-700 leading-relaxed italic text-center">
          &ldquo;{testimonial}&rdquo;
        </p>
      </blockquote>
    </div>
  );
}


/* ---------------------------------- */
/* 2. Başarılar Sayfası (ANA YAPI)   */
/* ---------------------------------- */
export default function SuccessPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/page-content?page=basarilarimiz").then(r => r.json()).then(d => setCms(d)).catch(() => {});
  }, []);

  const heroTitle = cms?.hero?.title || "Gurur Tablomuz";
  const heroDesc = cms?.hero?.content || "4T Akademi ailesi olarak, hayallerine ulaşan öğrencilerimizin başarılarını paylaşmaktan gurur duyarız.";
  const cmsStories = cms?.stories?.metadata?.items;
  const finalSuccesses = cmsStories || allSuccesses;

  const filteredSuccesses = finalSuccesses.filter((story: any) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === '2024') return story.year === 2024;
    if (activeFilter === '2023') return story.year === 2023;
    return story.category === activeFilter;
  });

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">

      {/* 1. Parça: Header */}
      <MainHeader />

      {/* 2. Parça: Hero Alanı */}
      <section className="w-full bg-white pt-20 pb-16 border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto" />
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            {heroTitle}
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            {heroDesc}
          </p>
        </div>
      </section>

      {/* 3. Parça: Filtre Butonları ve Galeri */}
      <section className="w-full py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Filtre Butonları */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-6 py-3 rounded-lg text-base font-bold transition-all duration-150
                  ${activeFilter === filter.id
                    ? 'bg-blue-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }
                `}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Başarı Kartları Galerisi */}
          {filteredSuccesses.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuccesses.map((story: any) => (
                <SuccessCard
                  key={story.id}
                  name={story.name}
                  title={story.title}
                  testimonial={story.testimonial}
                  imageUrl={story.imageUrl}
                />
              ))}
            </div>
          ) : (
            // Filtre sonucu bulunamazsa
            <div className="p-10 text-center bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900">Sonuç Bulunamadı</h3>
              <p className="mt-2 text-gray-600">
                Bu filtreye uygun bir başarı hikayesi henüz eklenmemiş.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 4. Parça: Footer */}
      <Footer />
    </main>
  );
}