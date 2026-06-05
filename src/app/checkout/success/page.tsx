"use client";

import { useSearchParams } from "next/navigation";
import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useState, Suspense } from "react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [copied, setCopied] = useState(false);

  const iban = "TR00 0000 0000 0000 0000 0000 00"; // İLERİDE DEĞİŞTİRİLECEK
  const accountName = "4T Akademi Yayıncılık Ltd. Şti."; // İLERİDE DEĞİŞTİRİLECEK

  function copyToClipboard(text: string) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-light flex flex-col">
      <MainHeader />

      <section className="container mx-auto max-w-xl px-4 pt-32 pb-20 flex-1">
        <div className="rounded-3xl border border-black/10 bg-white p-8 sm:p-10 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-dark tracking-tight">Siparişiniz Alındı!</h1>
          <p className="mt-3 text-dark/70 leading-relaxed">
            EFT / Havale ödeme yöntemi ile siparişiniz başarıyla oluşturuldu. <br />
            Eğitiminizin aktifleştirilmesi için aşağıda yer alan hesap numarasına gönderim sağlayıp bizimle iletişime geçebilirsiniz.
          </p>

          <div className="mt-8 rounded-2xl bg-light p-6 text-left border border-black/10">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/10">
                <span className="text-sm font-bold text-dark/60">Sipariş Kodunuz:</span>
                <span className="font-mono font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                    {orderId || "Bulunamadı"}
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="text-xs font-bold text-dark/60 mb-1">Alıcı Adı / Ünvanı</div>
                    <div className="font-extrabold text-dark">{accountName}</div>
                </div>
                
                <div>
                    <div className="text-xs font-bold text-dark/60 mb-1">Banka ve IBAN No</div>
                    <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-dark bg-white px-3 py-1.5 rounded-lg border border-black/10">
                            {iban}
                        </code>
                        <button 
                            onClick={() => copyToClipboard(iban)}
                            className="p-2 text-dark/50 hover:text-primary transition hover:bg-light-muted rounded-lg"
                            title="Kopyala"
                        >
                            <DocumentDuplicateIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {copied && <p className="text-xs font-bold text-emerald-600 mt-3">IBAN panoya kopyalandı!</p>}

            <div className="mt-6 w-full text-xs font-bold text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-100">
                Açıklama kısmına sipariş kodunuzu ({orderId || "SPRS-NO"}) yazmayı unutmayınız.
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="/profil/kurslarim" className="w-full sm:flex-1 rounded-2xl px-5 py-3 font-extrabold text-white btn-4t text-center">
                  Panelime Git
              </a>
              <a href="https://wa.me/905000000000" target="_blank" className="w-full sm:flex-1 rounded-2xl px-5 py-3 font-extrabold border border-black/10 bg-white hover:bg-light-muted transition text-center">
                  Dekont Gönder
              </a>
          </div>
          
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-light pt-40 px-4 text-center">Yükleniyor...</main>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
