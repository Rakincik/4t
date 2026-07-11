// Dosya Yolu: app/blog/page.tsx
import { RssIcon } from '@heroicons/react/24/solid';

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';
import BlogCard from '@/app/components/BlogCard'; // YENİ OLUŞTURDUK

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const allPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });
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
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-8 md:grid-cols-2 lg:grid-cols-3 md:gap-y-12">
            {allPosts.map((post) => (
              <BlogCard 
                key={post.slug}
                slug={post.slug}
                title={post.title}
                category={post.category || "Genel"}
                imageUrl={post.imageUrl || "https://images.unsplash.com/photo-1554224155-16954a187c3d?q=80"}
                date={new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(post.createdAt)}
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