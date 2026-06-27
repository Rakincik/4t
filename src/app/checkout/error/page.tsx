"use client";

import { useSearchParams } from "next/navigation";
import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Suspense } from "react";

function CheckoutErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Ödeme işlemi gerçekleştirilemedi.";
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-light flex flex-col">
      <MainHeader />

      <section className="container mx-auto max-w-xl px-4 pt-32 pb-20 flex-1">
        <div className="rounded-3xl border border-black/10 bg-white p-8 sm:p-10 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-dark tracking-tight">Ödeme Başarısız!</h1>
          <p className="mt-3 text-dark/70 leading-relaxed">
            Moka POS sistemi veya bankanız tarafından ödeme işlemi reddedildi.
          </p>

          <div className="mt-8 rounded-2xl bg-red-50/50 p-6 text-left border border-red-100">
            <div className="text-sm font-bold text-red-800 mb-2">Başarısızlık Nedeni:</div>
            <div className="text-sm text-red-700 font-semibold bg-white border border-red-100 rounded-xl p-4">
              {error}
            </div>

            {orderId && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-red-100/50">
                <span className="text-xs font-bold text-red-800/60">Sipariş Numarası:</span>
                <span className="font-mono text-xs font-bold text-red-700">
                  {orderId}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="/checkout" className="w-full sm:flex-1 rounded-2xl px-5 py-3 font-extrabold text-white btn-4t text-center">
                  Ödemeyi Tekrar Dene
              </a>
              <a href="/" className="w-full sm:flex-1 rounded-2xl px-5 py-3 font-extrabold border border-black/10 bg-white hover:bg-light-muted transition text-center">
                  Ana Sayfaya Dön
              </a>
          </div>
          
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-light pt-40 px-4 text-center">Yükleniyor...</main>}>
      <CheckoutErrorContent />
    </Suspense>
  );
}
