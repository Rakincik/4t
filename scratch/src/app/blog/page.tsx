// Dosya Yolu: app/blog/page.tsx
import { RssIcon } from '@heroicons/react/24/solid';

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';
import BlogCard from '@/app/components/BlogCard'; // YENİ OLUŞTURDUK

// TODO: Bu veriler CMS'ten çekilecek.
// Ana sayfadakilerle aynı veriyi kullanalım şimdilik.
const allPosts = [
  {
    slug: 'kaymakamlik-calisma-plani',
    title: 'Kaymakamlık Sınavı: 2025 İçin Stratejik Çalışma Planı',
    category: 'Strateji',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop',
    date: '3 Kasım 2025',
  },
  {
    slug: 'iktisat-netleri',
    title: 'İktisat Netlerini Artırmanın 5 Bilimsel Yolu',
    category: 'Akademi',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-16954a187c3d?q=80&w=800&auto=format&fit=crop',
    date: '1 Kasım 2025',
  },
  {
    slug: 'mulakat-teknikleri',
    title: 'Mülakat Teknikleri: Heyecanı Yenmek ve Özgüven',
    category: 'Mülakat',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    date: '28 Ekim 2025',
  },
  {
    slug: 'vmy-nedir-nasil-calisilir',
    title: 'VMY (Vergi Müfettiş Yrd.) Sınavı Nedir, Nasıl Çalışılır?',
    category: 'Kurum Sınavları',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    date: '25 Ekim 2025',
  },
];

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      
      {/* 1. Parça: Header */}
      <MainHeader />
      
      {/* 2. Parça: Hero Alanı */}
      <section className="w-full bg-white pt-20 pb-16 border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <RssIcon className="h-16 w-16 text-blue-800 mx-auto" />
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Akademiden Güncel Yazılar
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Sınav stratejileri, mülakat teknikleri, güncel duyurular ve 
            eğitmenlerimizden altın değerinde ipuçları.
          </p>
        </div>
      </section>

      {/* 3. Parça: Blog Yazıları Galerisi */}
      <section className="w-full py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* TODO: Buraya 'Kategori Filtreleme' butonları eklenebilir */}
          
          <div className="grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
            {allPosts.map((post) => (
              <BlogCard 
                key={post.slug}
                slug={post.slug}
                title={post.title}
                category={post.category}
                imageUrl={post.imageUrl}
                date={post.date}
              />
            ))}
          </div>

          {/* TODO: Buraya 'Daha Fazla Yükle' (Pagination) butonu eklenebilir */}
        </div>
      </section>

      {/* 4. Parça: Footer */}
      <Footer />
    </main>
  );
}