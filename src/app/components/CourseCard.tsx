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
  learningOutcomes?: string[] | null;
  questions?: string | null;
  color?: string;
  emoji?: string;
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
  learningOutcomes,
  questions,
  color = "#3B82F6",
  emoji = "",
}: CourseCardProps) {
  const href = `/kurs/${slug}`;
  const priceVal = moneyToNumberLike(discountedPrice);
  const origPriceVal = moneyToNumberLike(originalPrice);
  const installmentPrice = priceVal > 0 ? formatTL(priceVal / 12) : "0";
  const { add } = useCart();

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
      qty: 1
    }, { openDrawer: true });
  };

  // Veritabanından gelen Kazanımlar (learningOutcomes) array'ini kullanıyoruz
  const featuresList = Array.isArray(learningOutcomes) && learningOutcomes.length > 0 
    ? learningOutcomes 
    : [];

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">

      <div className="relative h-48 overflow-hidden shrink-0">
        <a href={href} className="block w-full h-full relative">
          <Image
            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </a>

      </div>

      {/* 2. İÇERİK ALANI */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Başlık */}
        <a href={href} className="block group/title mb-3">
          <h3 
            className="text-lg font-bold text-gray-900 leading-snug transition-colors min-h-[44px]"
          >
            <span className="group-hover/title:text-[var(--hover-color)] transition-colors line-clamp-3 [&_*]:inline [&_*]:m-0 whitespace-pre-wrap" style={{ '--hover-color': color } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: (title || "").replace(/&nbsp;/g, ' ') }} />
          </h3>
        </a>

        {/* --- Özellikler Listesi --- */}
        {featuresList.length > 0 && (
          <div className="mb-4">
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

        {/* --- Özellikler (Kompakt Tek Satır) --- */}
        {(duration || questions || studentCount) ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
            {duration && (
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{duration}</span>
              </div>
            )}
            {questions && (
              <div className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                <span>{questions}</span>
              </div>
            )}
            {studentCount && (
              <div className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{studentCount}</span>
              </div>
            )}
          </div>
        ) : null}

        {/* --- Fiyat ve Taksit --- */}
        <div className="mt-auto">
          {/* Büyük Fiyat */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl font-extrabold text-blue-900">
              {discountedPrice}
            </span>
            {originalPrice && originalPrice !== discountedPrice && (
              <span className="text-xs text-gray-400 line-through decoration-red-400 decoration-1">
                {originalPrice}
              </span>
            )}
          </div>

          {/* Taksit Bandı */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-2 text-center mb-4">
            <span className="text-xs font-bold text-green-800">
              Peşin Fiyatına 12 Taksit ( Aylık {installmentPrice} TL )
            </span>
          </div>

          {/* --- Butonlar (Dual) --- */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-300"
              style={{ borderColor: color, color: color, backgroundColor: "transparent" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${color}1A`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Hemen Al
            </button>
            <a
              href={href}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-300 shadow-md shadow-gray-200"
              style={{ backgroundColor: color }}
              onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.9)"}
              onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
            >
              <EyeIcon className="w-4 h-4" />
              Detaya Bak
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
