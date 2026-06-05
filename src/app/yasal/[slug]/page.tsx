// Dosya Yolu: app/yasal/[slug]/page.tsx
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';

import prisma from "@/lib/prisma";

// Bu tip, Next.js'in URL'den 'slug' parametresini almasını sağlar
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return [
    { slug: "kvkk" },
    { slug: "iade-sartlari" },
    { slug: "gizlilik-politikasi" },
    { slug: "mesafeli-satis" },
  ];
}
const TITLES: Record<string, string> = {
  "kvkk": "KVKK Aydınlatma Metni",
  "gizlilik-politikasi": "Gizlilik Politikası",
  "iade-sartlari": "İptal ve İade Şartları",
  "mesafeli-satis": "Mesafeli Satış Sözleşmesi",
};

export default async function LegalPageTemplate({ params }: PageProps) {
  const { slug } = await params;
  
  // CMS'ten içerik çek
  const contentRecord = await prisma.pageContent.findUnique({
    where: { 
      pageSlug_sectionKey: { 
        pageSlug: "sozlesmeler",
        sectionKey: slug 
      } 
    }
  });

  const content = contentRecord?.content || `
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Metin Bulunamadı</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      Bu sayfaya ait içerik henüz yüklenmemiş. Lütfen daha sonra tekrar deneyin.
    </p>
  `;
  const title = TITLES[slug] || "Yasal Metin";

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      
      {/* 1. Parça: Header */}
      <MainHeader />
      
      {/* 2. Parça: Hero Alanı (Dinamik Başlıklı) */}
      <section className="w-full bg-white pt-20 pb-16 border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheckIcon className="h-16 w-16 text-blue-800 mx-auto" />
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            {title}
          </h1>
        </div>
      </section>

      {/* 3. Parça: Yasal Metin İçeriği */}
      <section className="w-full py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 md:p-16 rounded-lg shadow-xl border border-gray-200">
            {/* Blog sayfasında kurduğumuz @tailwindcss/typography eklentisi
              sayesinde 'prose' sınıfı bu HTML'i otomatik olarak güzelleştirecek.
            */}
            <div 
              className="prose prose-lg prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </section>

      {/* 4. Parça: Footer */}
      <Footer />
    </main>
  );
}