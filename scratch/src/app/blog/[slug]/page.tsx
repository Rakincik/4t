// Dosya Yolu: app/blog/[slug]/page.tsx
import { CalendarIcon, UserCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';
import BlogCard from '@/app/components/BlogCard'; // "İlgili Yazılar" için

// Bu tip, Next.js'in URL'den 'slug' parametresini almasını sağlar
type PageProps = {
  params: {
    slug: string; // 'kaymakamlik-calisma-plani' vb.
  };
};

// TODO: Bu veriler CMS'ten 'slug'a göre çekilecek.
// Şimdilik statik test verisi kullanıyoruz.
const getPostData = (slug: string) => {
  return {
    slug: 'kaymakamlik-calisma-plani',
    title: 'Kaymakamlık Sınavı: 2025 İçin Stratejik Çalışma Planı',
    category: 'Strateji',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop',
    date: '3 Kasım 2025',
    author: '4T Akademi Ekibi',
    // Gerçek içerik CMS'ten HTML olarak gelecek (Prose eklentisi ile)
    content: `
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Kaymakamlık sınavı, Türkiye'nin en prestijli kariyer hedeflerinden biridir. 
        Ancak bu hedefe ulaşmak, yoğun ve stratejik bir çalışma planı gerektirir. 
        İşte 2025 sınavına hazırlanan adaylar için 4T Akademi uzmanlarının hazırladığı 
        stratejik çalışma planı.
      </p>
      <h2 class="text-3xl font-bold text-gray-900 mt-10 mb-4">1. Aşama: Temel Konu Hakimiyeti (İlk 3 Ay)</h2>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Her şeyden önce, sınavın ana omurgasını oluşturan <b>Anayasa Hukuku</b>, 
        <b>İdare Hukuku</b> ve <b>İktisat</b> derslerine odaklanmalısınız. Bu dönemde 
        konuları ezberlemek yerine, mantığını anlamaya çalışın.
      </p>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed space-y-2 mb-6 pl-4">
        <li>Mutlaka kaliteli bir konu anlatım kitabından ilerleyin.</li>
        <li>4T FLIX gibi video kütüphanelerinden anlamadığınız konuları tekrar edin.</li>
        <li>Her konunun ardından en az 100 çözümlü soru görün.</li>
      </ul>
      <h2 class="text-3xl font-bold text-gray-900 mt-10 mb-4">2. Aşama: Soru Çözümü ve Pratik (Son 2 Ay)</h2>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Konular bittikten sonra başarıyı getirecek olan şey pratiktir. Bu dönemde 
        deneme sınavları ve soru çözüm kampları en büyük yardımcınız olacaktır.
      </p>
      <blockquote class="border-l-4 border-blue-800 pl-6 py-4 my-8 bg-gray-50 text-xl font-medium text-gray-800 italic">
        "Konuyu bilmek sizi %50'ye getirir, kalanı ise ne kadar çok farklı soru 
        tipi gördüğünüzle ilgilidir." - Yüksel Hoca
      </blockquote>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Unutmayın, bu bir maraton. 4T Akademi olarak bu maratonda yanınızdayız.
      </p>
    `
  };
};

// "İlgili Yazılar" için demo veri
const relatedPosts = [
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
];


export default function BlogPostPage({ params }: PageProps) {
  const { slug } = params;
  const post = getPostData(slug); // 'slug'a göre veriyi çek

  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      
      {/* 1. Parça: Header */}
      <MainHeader />
      
      {/* 2. Parça: Yazı İçeriği */}
      <section className="w-full py-20 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Geri Dön Linki */}
          <div className="mb-8">
            <a 
              href="/blog" 
              className="inline-flex items-center text-base font-semibold text-blue-800 hover:text-blue-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Tüm Yazılara Geri Dön
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Ana İçerik (Okuma Alanı) */}
            <article className="lg:col-span-2">
              {/* Başlık ve Meta */}
              <div className="border-b border-gray-200 pb-6 mb-8">
                <p className="text-base font-bold text-blue-800 uppercase">
                  {post.category}
                </p>
                <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-gray-900">
                  {post.title}
                </h1>
                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-1.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 mr-1.5" />
                    <span>{post.author}</span>
                  </div>
                </div>
              </div>

              {/* Kapak Görseli */}
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto rounded-lg shadow-2xl object-cover aspect-video mb-10"
              />

              {/* Yazı İçeriği (CMS'ten gelen HTML) */}
              {/* 'prose' eklentisi ile bu alan otomatik olarak güzel görünecek */}
              {/* Şimdilik 'dangerouslySetInnerHTML' kullanıyoruz, CMS'ten gelince bu normal olacak */}
              <div 
                className="prose prose-lg prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Kenar Çubuğu (İlgili Yazılar) */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-32 h-fit">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-800 pl-3">
                  İlgili Diğer Yazılar
                </h3>
                <div className="space-y-8">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.slug} {...relatedPost} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 3. Parça: Footer */}
      <Footer />
    </main>
  );
}