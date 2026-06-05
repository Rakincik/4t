// Dosya Yolu: app/components/CourseCard.tsx
// GÜNCELLENMİŞ TASARIM: Detaylı Liste Görünümü
// - Temiz görsel
// - Özellikler listesi (Yeşil tikli)
// - Müfredat bilgisi
// - Taksit seçeneği ve İkili buton

import {
  ClockIcon,
  UserGroupIcon,
  PlayCircleIcon,
  CheckIcon,
  ShoppingCartIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";

import {
  CheckCircleIcon
} from "@heroicons/react/24/outline";

type CourseCardProps = {
  slug: string;
  title: string;
  category: string;
  type?: string;
  imageUrl: string;
  originalPrice: string;
  discountedPrice: string;
  duration: string;
  studentCount: string;
  isNew?: boolean;
  seatsLeft?: number;
};

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function moneyToNumberLike(str: string) {
  const cleaned = (str || "")
    .replaceAll("₺", "")
    .replaceAll(".", "")
    .replaceAll(" ", "")
    .replaceAll(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatTL(n: number) {
  const s = Math.round(n).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function CourseCard({
  slug,
  title,
  category,
  imageUrl,
  originalPrice,
  discountedPrice,
  duration,
  studentCount,
}: CourseCardProps) {
  const href = `/kurs/${slug}`;
  const priceVal = moneyToNumberLike(discountedPrice);
  const installmentPrice = priceVal > 0 ? formatTL(priceVal / 12) : "0";

  // MOCK FEATURES (Gerçek veride prop olarak gelmeli)
  // Kullanıcının görselindeki özellikleri temsili olarak ekliyoruz.
  const features = [
    "Bire Bir Randevulu Koçluk Görüşmeleri",
    "Bire Bir Anlık Özel Dersler",
    "Anlık Soru Sorma & Çözdürme Hakkı",
    "Deneme Sınavları & Soru Bankası",
    "Velilere Özel Bilgilendirme Sistemi",
    "Hızlı Okuma Egzersizleri"
  ];

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">

      {/* 1. GÖRSEL ALANI (Temiz, overlaysiz) */}
      <div className="relative h-56 overflow-hidden shrink-0">
        <a href={href} className="block w-full h-full">
          <img
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            src={imageUrl}
            alt={title}
          />
        </a>
        {/* Kategori Etiketi (Sol üst) */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-blue-100">
            {category}
          </span>
        </div>
      </div>

      {/* 2. İÇERİK ALANI */}
      <div className="p-6 flex flex-col flex-grow">

        {/* Başlık */}
        <a href={href} className="block">
          <h3 className="text-xl font-bold text-gray-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </a>

        {/* --- Özellikler Listesi --- */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-green-600 mb-3">Özellikler</h4>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckIcon className="w-5 h-5 text-green-500 shrink-0" />
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Müfredat Bilgisi --- */}
        <div className="mb-6 pt-4 border-t border-dashed border-gray-200">
          <h4 className="text-sm font-semibold text-green-600 mb-3">Müfredat</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
              <span>{duration || "600"} Saat Ders Videosu</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
              <span>36.724 Video Çözümlü Soru</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserGroupIcon className="w-5 h-5 text-blue-400 shrink-0" />
              <span>{studentCount} Başarılı Öğrenci</span>
            </div>
          </div>
        </div>

        {/* --- Fiyat ve Taksit --- */}
        <div className="mt-auto">
          {/* Büyük Fiyat */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-extrabold text-blue-900">
              {discountedPrice}
            </span>
            {originalPrice && originalPrice !== discountedPrice && (
              <span className="text-sm text-gray-400 line-through decoration-red-400 decoration-1">
                {originalPrice}
              </span>
            )}
          </div>

          {/* Taksit Bandı */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-2.5 text-center mb-6">
            <span className="text-sm font-bold text-green-800">
              Peşin Fiyatına 12 Taksit ( Aylık {installmentPrice} TL )
            </span>
          </div>

          {/* --- Butonlar (Dual) --- */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300">
              <ShoppingCartIcon className="w-5 h-5" />
              Hemen Al
            </button>
            <a
              href={href}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-200"
            >
              <EyeIcon className="w-5 h-5" />
              Detaya Bak
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
