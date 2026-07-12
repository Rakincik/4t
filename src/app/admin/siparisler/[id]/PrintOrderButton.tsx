"use client";

import { PrinterIcon } from "@heroicons/react/24/outline";

export default function PrintOrderButton() {
    return (
        <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D47A1] hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-900/10 hover:shadow-blue-900/20 transition-all scale-100 active:scale-[0.98] cursor-pointer print:hidden"
        >
            <PrinterIcon className="w-4 h-4 shrink-0" />
            <span>Siparişi Yazdır / PDF İndir</span>
        </button>
    );
}
