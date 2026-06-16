// Dosya Yolu: app/blog/[slug]/page.tsx
import { CalendarIcon, UserCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';
import BlogCard from '@/app/components/BlogCard'; // "İlgili Yazılar" için
import Image from "next/image";

// Bu tip, Next.js'in URL'den 'slug' parametresini almasını sağlar
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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


export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug }
  });

  if (!post) {
      notFound();
  }

  const relatedDbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true, NOT: { slug } },
      take: 2,
      orderBy: { createdAt: "desc" }
  });

  const formattedDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(post.createdAt);

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
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 mr-1.5" />
                    <span>4T Akademi Ekibi</span>
                  </div>
                </div>
              </div>

              {/* Kapak Görseli */}
              <div className="relative w-full aspect-video mb-10 rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  src={post.imageUrl || "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80"} 
                  alt={post.title} 
                  className="object-cover"
                />
              </div>

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
                  {relatedDbPosts.map((relatedPost) => (
                    <BlogCard 
                      key={relatedPost.slug} 
                      slug={relatedPost.slug}
                      title={relatedPost.title}
                      category={relatedPost.category || "Genel"}
                      imageUrl={relatedPost.imageUrl || "https://images.unsplash.com/photo-1554224155-16954a187c3d?q=80"}
                      date={new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(relatedPost.createdAt)}
                    />
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