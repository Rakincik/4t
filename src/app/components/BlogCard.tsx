// Dosya Yolu: app/components/BlogCard.tsx
// Bu, hem ana sayfada hem de /blog sayfasında kullanılacak
// yeniden kullanılabilir blog kartı bileşenidir.

// Blog kartının alacağı bilgilerin tipini tanımlayalım
type BlogCardProps = {
  slug: string; // Örn: 'kaymakamlik-calisma-plani'
  title: string;
  category: string;
  imageUrl: string;
  date: string;
};

import Image from "next/image";

export default function BlogCard({ slug, title, category, imageUrl, date }: BlogCardProps) {
  const href = `/blog/${slug}`; // Dinamik link oluştur

  return (
    <div className="flex flex-row md:flex-col bg-white rounded-2xl border border-black/5 md:shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl md:hover:-translate-y-1 p-3 md:p-0 gap-4 md:gap-0">
      <a href={href} className="flex-shrink-0">
        <div className="relative w-28 h-20 md:w-full md:h-56 rounded-xl md:rounded-none overflow-hidden shrink-0">
          <Image fill sizes="(max-width: 768px) 112px, 33vw" className="object-cover" src={imageUrl} alt={title} />
        </div>
      </a>
      <div className="flex-1 flex flex-col justify-between md:p-6 min-w-0">
        <div className="flex-1">
          <p className="text-xs md:text-sm font-bold text-blue-800">
            <span className="hover:underline">
              {category}
            </span>
          </p>
          <a href={href} className="block mt-1 md:mt-2">
            <p className="text-sm md:text-xl font-bold text-gray-900 line-clamp-2 md:h-16 hover:text-blue-800 leading-snug md:leading-normal">
              {title}
            </p>
          </a>
        </div>
        <div className="mt-3 md:mt-6 flex items-center justify-between">
          <div className="text-[10px] md:text-sm text-gray-600">
            <time dateTime={date}>{date}</time>
          </div>
          <a href={href} className="text-xs md:text-sm font-semibold text-blue-800 hover:text-blue-900">
            Devamını Oku
          </a>
        </div>
      </div>
    </div>
  );
}