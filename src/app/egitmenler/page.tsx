// Dosya Yolu: app/egitmenler/page.tsx
import { AcademicCapIcon } from '@heroicons/react/24/solid';

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';
import Image from "next/image";

// TODO: Bu veriler CMS'ten çekilecek
const hukukKadro = [
  { name: 'Doç. Dr. Ahmet Yılmaz', title: 'Anayasa Hukuku', imageUrl: 'https://via.placeholder.com/200', bio: 'Anayasa Mahkemesi raportörlüğü yapmış, alanında duayen bir isim.' },
  { name: 'Av. Mehmet Öztürk', title: 'İdare Hukuku', imageUrl: 'https://via.placeholder.com/200', bio: 'Danıştay tecrübesi ile İdare Hukuku\'nun inceliklerini öğreten uzman.' },
  { name: 'Prof. Dr. Elif Sancak', title: 'Medeni Hukuk', imageUrl: 'https://via.placeholder.com/200', bio: 'Medeni Hukuk kürsüsünde 25 yıllık akademik kariyere sahip.' },
];
const iktisatKadro = [
  { name: 'Prof. Dr. Yüksel Hoca', title: 'İktisat Bölüm Bşk.', imageUrl: 'https://via.placeholder.com/200', bio: 'İktisat alanında 20 yıllık deneyim, 5+ yayınlanmış kitap.' },
  { name: 'Dr. Zeynep Kaya', title: 'Maliye Politikası', imageUrl: 'https://via.placeholder.com/200', bio: 'Hazine ve Maliye Bakanlığı\'nda üst düzey görevler almış, uzman.' },
  { name: 'Doç. Dr. Caner Polat', title: 'Makro İktisat', imageUrl: 'https://via.placeholder.com/200', bio: 'Merkez Bankası\'nda çalışmış, para politikaları üzerine uzman.' },
];

/* ---------------------------------- */
/* 1. Eğitmenler Hero Alanı           */
/* ---------------------------------- */
function InstructorsHero() {
  return (
    <div className="w-full bg-gray-50 py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <AcademicCapIcon className="h-16 w-16 text-blue-800 mx-auto" />
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Uzman Eğitmen Kadromuz
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Başarınız, her biri alanında "Yayın Yazarı" olan, teori ve pratiği
          birleştiren duayen hocalarımıza emanet.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* 2. Eğitmen Kartı (Alt-Bileşen)      */
/* ---------------------------------- */
function InstructorCard({ name, title, bio, imageUrl }: { name: string, title: string, bio: string, imageUrl: string }) {
  return (
    <div className="flex flex-col rounded-lg shadow-xl overflow-hidden
                       border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div className="relative h-64 w-full flex-shrink-0">
        <Image fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" src={imageUrl} alt={name} />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-base font-bold text-blue-800">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{name}</h3>
          <p className="mt-3 text-base text-gray-600">{bio}</p>
        </div>
        <div className="mt-6">
          {/* Opsiyonel: Hocanın sosyal medya veya blog linkleri */}
          <a href="#" className="text-sm font-semibold text-blue-800 hover:text-blue-900">
            Profilini İncele &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}


/* ---------------------------------- */
/* 3. Eğitmenler Sayfası (ANA YAPI)   */
/* ---------------------------------- */
export default function InstructorsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      
      {/* 1. Parça: Header */}
      <MainHeader />
      
      {/* 2. Parça: Hero */}
      <InstructorsHero />

      {/* 3. Parça: Hukuk Bölümü */}
      <section className="bg-white py-20 w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 border-l-8 border-blue-800 pl-4">
            Hukuk Bölümü
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {hukukKadro.map((hoca) => (
              <InstructorCard key={hoca.name} {...hoca} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Parça: İktisat & Maliye Bölümü */}
      <section className="bg-gray-50 py-20 w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 border-l-8 border-blue-800 pl-4">
            İktisat & Maliye Bölümü
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {iktisatKadro.map((hoca) => (
              <InstructorCard key={hoca.name} {...hoca} />
            ))}
          </div>
        </div>
      </section>

      {/* TODO: Diğer bölümler (Muhasebe vb.) buraya eklenebilir */}
      
      {/* 5. Parça: Footer */}
      <Footer />
    </main>
  );
}