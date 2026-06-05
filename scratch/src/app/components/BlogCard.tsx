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

export default function BlogCard({ slug, title, category, imageUrl, date }: BlogCardProps) {
  const href = `/blog/${slug}`; // Dinamik link oluştur

  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <a href={href} className="flex-shrink-0">
        <img className="h-56 w-full object-cover" src={imageUrl} alt={title} />
      </a>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-blue-800">
            <a href="#" className="hover:underline"> {/* TODO: Kategori linki eklenebilir */}
              {category}
            </a>
          </p>
          <a href={href} className="block mt-2">
            <p className="text-xl font-bold text-gray-900 h-16 group-hover:text-blue-800">
              {title}
            </p>
          </a>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <time dateTime={date}>{date}</time>
          </div>
          <a href={href} className="text-sm font-semibold text-blue-800 hover:text-blue-900">
            Devamını Oku
          </a>
        </div>
      </div>
    </div>
  );
}