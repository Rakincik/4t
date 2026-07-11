"use client";

import React, { useMemo } from "react";
import { useCart } from "./cartStore";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function FloatingCartButton() {
  const pathname = usePathname();
  const { state, isOpen, open } = useCart();

  // Hide on admin panel and checkout/success flows
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) {
    return null;
  }

  const itemsCount = useMemo(() => {
    return state?.items?.reduce((acc, item) => acc + item.qty, 0) || 0;
  }, [state?.items]);

  if (itemsCount === 0 || isOpen) {
    return null;
  }
  return (
    <button
      onClick={open}
      className="fixed bottom-[140px] sm:bottom-24 right-6 z-[9998] lg:hidden w-12 h-12 sm:w-[60px] sm:h-[60px] bg-[#DC2626] hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all hover:scale-110 active:scale-95"
      aria-label="Sepeti Görüntüle"
    >
      <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      <span className="absolute -top-1 -right-1 bg-white text-[#DC2626] font-extrabold text-[9px] sm:text-[11px] w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-[#DC2626] shadow-sm">
        {itemsCount}
      </span>
    </button>
  );
}
