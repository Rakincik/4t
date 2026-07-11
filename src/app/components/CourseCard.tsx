"use client";
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
import { useCart } from "@/app/components/cart/cartStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CourseCardProps = {
  id?: string;
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
  learningOutcomes?: string[] | null;
  questions?: string | null;
  color?: string;
  emoji?: string;
  isInstallmentApplicable?: boolean;
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
  id,
  slug,
  title,
  category,
  imageUrl,
  originalPrice,
  discountedPrice,
  duration,
  studentCount,
  learningOutcomes,
  questions,
  color = "#3B82F6",
  emoji = "",
  isInstallmentApplicable = true,
}: CourseCardProps) {
  const href = `/kurs/${slug}`;
  const priceVal = moneyToNumberLike(discountedPrice);
  const origPriceVal = moneyToNumberLike(originalPrice);
  const installmentPrice = priceVal > 0 ? formatTL(priceVal / 6) : "0";
  const { add } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    add({
      id: slug,
      slug,
      title,
      category,
      imageUrl,
      price: priceVal,
      originalPrice: origPriceVal,
      qty: 1,
      isInstallmentApplicable: isInstallmentApplicable !== false,
    }, { openDrawer: false });

    // Log cart add event asynchronously
    if (id) {
      fetch("/api/admin/analytics/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id, event: "cart_add" })
      }).catch(console.error);
    }

    router.push("/sepet");
  };

  // Veritabanından gelen Kazanımlar (learningOutcomes) array'ini kullanıyoruz
  const featuresList = Array.isArray(learningOutcomes) && learningOutcomes.length > 0 
    ? learningOutcomes 
    : [];

  return (
    <div className="group relative flex flex-row sm:flex-col h-auto sm:h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">

      {/* Görsel Alanı (Mobilde kare sol taraf, Masaüstünde üst taraf) */}
      <div className="relative w-28 h-28 xs:w-32 xs:h-32 sm:w-full sm:h-48 shrink-0 overflow-hidden">
        <a href={href} className="block w-full h-full relative">
          <Image
            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 130px, (max-width: 1200px) 50vw, 33vw"
          />
        </a>
      </div>

      {/* 2. İÇERİK ALANI */}
      <div className="p-3 xs:p-4 sm:p-5 flex flex-col flex-grow min-w-0 pr-12 xs:pr-14 sm:pr-5">

        {/* Başlık */}
        <a href={href} className="block group/title mb-1 sm:mb-2">
          <h3 
            className="text-xs sm:text-base md:text-lg font-bold text-gray-900 leading-snug transition-colors min-h-0 sm:min-h-[44px]"
          >
            <span className="group-hover/title:text-[var(--hover-color)] transition-colors line-clamp-2 sm:line-clamp-3 [&_*]:inline [&_*]:m-0 whitespace-pre-wrap" style={{ '--hover-color': color } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: (title || "").replace(/&nbsp;/g, ' ') }} />
          </h3>
        </a>

        {/* --- Özellikler Listesi (Masaüstü: Tam Liste) --- */}
        {featuresList.length > 0 && (
          <div className="mb-4 hidden sm:block">
            <h4 className="text-xs font-semibold text-green-600 mb-2">Kazanımlar</h4>
            <ul className="space-y-1.5">
              {featuresList.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <CheckIcon className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- Özellikler Listesi (Mobil: 2x2 Grid Halinde İlk 4 Tik) --- */}
        {featuresList.length > 0 && (
          <div className="mb-2 block sm:hidden">
            <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {featuresList.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-1 text-[10px] text-gray-600 min-w-0">
                  <CheckIcon className="w-3 h-3 text-green-500 shrink-0" />
                  <span className="truncate leading-none">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- Özellikler (Kompakt Tek Satır - Sadece Masaüstü) --- */}
        {(duration || questions || studentCount) ? (
          <div className="hidden sm:flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 mb-3 pt-2 border-t border-gray-100">
            {duration && (
              <div className="flex items-center gap-0.5">
                <ClockIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{duration}</span>
              </div>
            )}
            {questions && (
              <div className="flex items-center gap-0.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span>{questions}</span>
              </div>
            )}
            {studentCount && (
              <div className="flex items-center gap-0.5">
                <UserGroupIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{studentCount}</span>
              </div>
            )}
          </div>
        ) : null}

        {/* --- Fiyat ve Taksit --- */}
        <div className="mt-auto">
          {/* Fiyatlar */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1">
            <span className="text-sm sm:text-2xl font-extrabold text-blue-900 leading-none">
              {discountedPrice}
            </span>
            {originalPrice && originalPrice !== discountedPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through decoration-red-400 decoration-1 leading-none">
                {originalPrice}
              </span>
            )}
          </div>

          {/* Taksit Bilgisi (Responsive: Mobilde düz metin, Desktopta kutulu kart) */}
          {isInstallmentApplicable !== false && (
            <div className="block sm:bg-green-50 sm:border sm:border-green-100 sm:rounded-lg sm:p-1.5 sm:text-center text-[9px] sm:text-xs font-semibold sm:font-bold text-green-700 sm:text-green-800 mb-1 sm:mb-4">
              Peşin Fiyatına 6 Taksit ( Aylık {installmentPrice} TL )
            </div>
          )}

          {/* Masaüstünde Klasik İkili Butonlar */}
          <div className="hidden sm:grid grid-cols-2 gap-3">
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all duration-300"
              style={{ borderColor: color, color: color, backgroundColor: "transparent" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${color}1A`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Hemen Al
            </button>
            <a
              href={href}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold transition-all duration-300 shadow-md shadow-gray-200"
              style={{ backgroundColor: color }}
              onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.9)"}
              onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
            >
              <EyeIcon className="w-4 h-4" />
              Detaylar
            </a>
          </div>

        </div>

      </div>

      {/* Mobilde Sağ Alt Köşede Duran Hızlı Satın Al Butonu */}
      <button
        onClick={handleAddToCart}
        className="flex sm:hidden items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-300 shadow-sm active:scale-95 absolute bottom-3 right-3"
        style={{ backgroundColor: color }}
      >
        <ShoppingCartIcon className="w-4 h-4" />
      </button>

    </div>
  );
}
