// Dosya Yolu: app/sss/page.tsx
"use client"; // Arama ve filtreleme (state) için bu şart
import { useState } from 'react';
import { 
  QuestionMarkCircleIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/solid';

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';

// TODO: Bu veriler CMS'ten çekilecek.
// Profesyonel bir yapı için 'category' anahtarı ekliyoruz.
const allFaqs = [
  { 
    id: 1, 
    category: 'genel',
    q: 'Canlı dersleri kaçırırsam tekrarı var mı?', 
    a: 'Evet, tüm canlı dersler kayıt altına alınır ve 24 saat içinde öğrenci panelinize (Okinar) "offline" video olarak yüklenir.' 
  },
  { 
    id: 2, 
    category: 'odeme',
    q: 'Taksit imkanları nelerdir?', 
    a: 'Tüm kurslarımızda, bankanızın sunduğu "Vade Farksız" taksit imkanlarından yararlanabilirsiniz. Ödeme sayfasında seçenekleri görebilirsiniz.' 
  },
  { 
    id: 3, 
    category: 'teknik',
    q: 'Videoları telefondan izleyebilir miyim?', 
    a: 'Evet, öğrenci panelimiz (Okinar) %100 mobil uyumludur. Dilerseniz iOS ve Android uygulamalarımızı indirerek de izleyebilirsiniz.' 
  },
  { 
    id: 4, 
    category: 'flix',
    q: '4T FLIX aboneliği ile canlı derslere girebilir miyim?', 
    a: 'Hayır, 4T FLIX bir "video kütüphanesi" (VOD) hizmetidir. Canlı dersleri, soru çözüm kamplarını ve rehberliği kapsamaz. Onlar için "Eğitim Paketi" almanız gerekir.' 
  },
  { 
    id: 5, 
    category: 'genel',
    q: 'PDF ders notları veriliyor mu?', 
    a: 'Evet, her dersin ve eğitmenin özel olarak hazırladığı PDF formatındaki ders notları, öğrenci paneliniz üzerinden indirilebilir.' 
  },
  { 
    id: 6, 
    category: 'odeme',
    q: 'İptal ve iade şartları nelerdir?', 
    a: 'Satın alınan dijital içerik ve hizmetlerin iadesi, Mesafeli Satış Sözleşmesi\'nde belirtilen şartlara tabidir. Detaylı bilgi için "İptal ve İade Şartları" sayfamızı okuyabilirsiniz.' 
  },
];

// Kategorileri dinamik olarak veriden çekelim (ve tekrar etmesinler)
const categories = [
  { id: 'all', name: 'Tümü' },
  { id: 'genel', name: 'Genel Sorular' },
  { id: 'odeme', name: 'Ödeme & İptal' },
  { id: 'teknik', name: 'Teknik Destek' },
  { id: 'flix', name: '4T FLIX' },
];

/* ---------------------------------- */
/* 1. Akordiyon (Alt-Bileşen)         */
/* ---------------------------------- */
function AccordionItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <h3>
        <button
          type="button"
          className="flex justify-between items-center w-full py-6 px-6 text-left text-lg font-bold text-gray-800 hover:bg-gray-50 transition-colors duration-150"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{q}</span>
          {isOpen ? (
            <ChevronUpIcon className="h-6 w-6 text-blue-800 flex-shrink-0" />
          ) : (
            <ChevronDownIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
          )}
        </button>
      </h3>
      {isOpen && (
        <div className="pb-6 px-6 text-base text-gray-700 leading-relaxed bg-white animate-fadeIn">
          {a}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- */
/* 2. S.S.S. Sayfası (ANA YAPI)       */
/* ---------------------------------- */
export default function SssPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtreleme Mantığı
  const filteredFaqs = allFaqs
    // 1. Kategoriye göre filtrele
    .filter(faq => 
      activeCategory === 'all' || faq.category === activeCategory
    )
    // 2. Arama terimine göre filtrele (soruda VEYA cevapta ara)
    .filter(faq => 
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      
      {/* 1. Parça: Header */}
      <MainHeader />
      
      {/* 2. Parça: Hero & Akıllı Arama Barı */}
      <section className="w-full bg-white pt-20 pb-16 border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <QuestionMarkCircleIcon className="h-16 w-16 text-blue-800 mx-auto" />
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Sıkça Sorulan Sorular
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Aklınıza takılan bir soru mu var? Muhtemelen cevabı buradadır.
          </p>
          
          {/* Akıllı Arama Barı */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Sorunuzu buraya yazın (örn: iade, şifre...)"
                className="w-full p-5 pr-16 rounded-lg border border-gray-300 shadow-sm text-lg focus:ring-blue-800 focus:border-blue-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Parça: Kategori Filtreleri ve Sonuçlar */}
      <section className="w-full py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Kategori Butonları */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearchTerm(''); // Kategori değiştirince aramayı sıfırla
                }}
                className={`
                  px-6 py-3 rounded-lg text-base font-bold transition-all duration-150
                  ${activeCategory === category.id 
                    ? 'bg-blue-800 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* S.S.S. Akordiyon Listesi */}
          <div className="max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden border border-gray-200 bg-white">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
                <AccordionItem key={faq.id} q={faq.q} a={faq.a} />
              ))
            ) : (
              // Arama sonucu bulunamazsa
              <div className="p-10 text-center">
                <h3 className="text-xl font-bold text-gray-900">Sonuç Bulunamadı</h3>
                <p className="mt-2 text-gray-600">
                  Aradığınız kritere uygun bir soru bulamadık. 
                  Lütfen farklı bir kelime deneyin veya bizimle <a href="/iletisim" className="text-blue-800 font-semibold underline">iletişime</a> geçin.
                </p>
              </div>
            )}
          </div>
          
        </div>
      </section>

      {/* 4. Parça: Footer */}
      <Footer />
    </main>
  );
}