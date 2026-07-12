"use client";

import { useSearchParams } from "next/navigation";
import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { CheckCircleIcon, DocumentDuplicateIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { useState, Suspense, useEffect } from "react";
import { useCart } from "@/app/components/cart/cartStore";
import { logPurchase } from "@/lib/gtag";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");
  
  const cart = useCart();

  // Google Ads / GTM E-commerce & Enhanced Conversions dataLayer trigger
  useEffect(() => {
    if (!orderId) return;

    // Deduplication check to prevent repeat triggers on refresh
    const key = `fired_purchase_${orderId}`;
    if (sessionStorage.getItem(key)) return;

    fetch(`/api/checkout/order-summary?orderId=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) return;

        const dataLayer = (window as any).dataLayer || [];
        dataLayer.push({
          event: "purchase",
          ecommerce: {
            transaction_id: data.transactionId,
            value: data.value,
            currency: "TRY",
            items: data.items.map((item: any) => ({
              item_id: item.id,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          },
          // Secure Google Ads Enhanced Conversions fields
          user_data: {
            sha256_email_address: data.hashedEmail || undefined,
            sha256_phone_number: data.hashedPhone || undefined,
            sha256_first_name: data.hashedFirstName || undefined,
            sha256_last_name: data.hashedLastName || undefined
          }
        });
        (window as any).dataLayer = dataLayer;

        // Direct GA4 Purchase tracking
        logPurchase(
          data.transactionId,
          data.items.map((item: any) => ({
            id: item.id,
            title: item.name,
            price: item.price,
            qty: item.quantity
          })),
          data.value
        );

        sessionStorage.setItem(key, "true");
      })
      .catch(err => console.error("Error pushing e-commerce dataLayer:", err));
  }, [orderId]);

  // Ödeme başarılı olduğunda sepeti temizle
  useEffect(() => {
    if (cart && typeof (cart as any).clear === "function") {
      (cart as any).clear();
    }
  }, [cart]);

  const [copiedType, setCopiedType] = useState<"iban" | "account" | null>(null);

  const iban = "TR14 0001 5001 5800 7306 1098 21";
  const accountName = "DORT TEMEL EGITIM-OGRETIM YAYINCILIK HIZMETLERI LIMITED SIRKETI";
  const bankDetails = "Vakıfbank, Türkiş Şubesi (Şube Kodu: 906, Hesap No: 00158007306109821)";

  function copyToClipboard(text: string, type: "iban" | "account") {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
  }

  const isCC = method === "cc";

  return (
    <main className="min-h-screen bg-light flex flex-col">
      <MainHeader />

      <section className="container mx-auto max-w-xl px-4 pt-32 pb-20 flex-1">
        <div className="rounded-3xl border border-black/10 bg-white p-8 sm:p-10 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-dark tracking-tight">
            {isCC ? "Ödemeniz Başarılı!" : "Siparişiniz Alındı!"}
          </h1>
          
          <p className="mt-3 text-dark/70 leading-relaxed">
            {isCC ? (
              <>
                Kredi kartı ödemeniz başarıyla tahsil edildi. <br />
                Eğitimleriniz otomatik olarak hesabınıza tanımlanmıştır. Hemen izlemeye başlayabilirsiniz!
              </>
            ) : (
              <>
                EFT / Havale ödeme yöntemi ile siparişiniz başarıyla oluşturuldu. <br />
                Eğitiminizin aktifleştirilmesi için aşağıda yer alan hesap numarasına gönderim sağlayıp bizimle iletişime geçebilirsiniz.
              </>
            )}
          </p>

          {isCC ? (
            <div className="mt-8 rounded-2xl bg-light p-6 text-left border border-black/10">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/10">
                  <span className="text-sm font-bold text-dark/60">Sipariş Kodunuz:</span>
                  <span className="font-mono font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                      {orderId || "Bulunamadı"}
                  </span>
              </div>

              <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                      <AcademicCapIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                          <div className="text-xs font-bold text-emerald-800">Eğitimlerin Durumu</div>
                          <div className="text-sm text-emerald-700 font-semibold mt-1">Aktif (Kullanıma Hazır)</div>
                      </div>
                  </div>
              </div>
            </div>
          ) : (
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
                      <div className="flex items-center gap-2">
                          <span className="font-extrabold text-dark text-xs sm:text-sm bg-white px-3 py-2.5 rounded-lg border border-black/10 flex-1 truncate max-w-[340px]">
                              {accountName}
                          </span>
                          <button 
                              onClick={() => copyToClipboard(accountName, "account")}
                              className="p-2 text-dark/50 hover:text-primary transition hover:bg-light-muted rounded-lg shrink-0"
                              title="Kopyala"
                          >
                              <DocumentDuplicateIcon className="w-5 h-5" />
                          </button>
                      </div>
                      {copiedType === "account" && <p className="text-xs font-bold text-emerald-600 mt-1">Alıcı adı panoya kopyalandı!</p>}
                  </div>

                  <div>
                      <div className="text-xs font-bold text-dark/60 mb-1">Banka ve Şube Bilgisi</div>
                      <div className="font-extrabold text-dark text-xs bg-white px-3 py-2.5 rounded-lg border border-black/10">{bankDetails}</div>
                  </div>
                  
                  <div>
                      <div className="text-xs font-bold text-dark/60 mb-1">IBAN No</div>
                      <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-dark bg-white px-3 py-1.5 rounded-lg border border-black/10 text-xs flex-1 truncate">
                              {iban}
                          </code>
                          <button 
                              onClick={() => copyToClipboard(iban, "iban")}
                              className="p-2 text-dark/50 hover:text-primary transition hover:bg-light-muted rounded-lg shrink-0"
                              title="Kopyala"
                          >
                              <DocumentDuplicateIcon className="w-5 h-5" />
                          </button>
                      </div>
                      {copiedType === "iban" && <p className="text-xs font-bold text-emerald-600 mt-1">IBAN panoya kopyalandı!</p>}
                  </div>
              </div>

              <div className="mt-6 w-full text-xs font-bold text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-1.5">
                  <div>Lütfen açıklama kısmına adınızı ve sipariş kodunuzu ({orderId || "SPRS-NO"}) yazmayı unutmayınız.</div>
                  <div className="text-[11px] font-semibold text-amber-600">Ödeme yaptıktan sonra dershaneyi bilgilendirebilirsiniz. Sağlıklı günler dileriz.</div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="/profil/kurslarim" className="w-full sm:flex-1 rounded-2xl px-5 py-3 font-extrabold text-white btn-4t text-center">
                  {isCC ? "Eğitimlerime Git" : "Panelime Git"}
              </a>
              {isCC ? (
                <a href="/" className="w-full sm:flex-1 rounded-2xl px-5 py-3 font-extrabold border border-black/10 bg-white hover:bg-light-muted transition text-center">
                    Ana Sayfa
                </a>
              ) : (
                <a 
                  href={`https://wa.me/905531724044?text=${encodeURIComponent(`Merhaba, ${orderId || ""} nolu siparişimin EFT/Havale ödemesini tamamladım. Kontrol edilerek onaylanmasını rica ederim.`)}`}
                  target="_blank" 
                  className="w-full sm:flex-1 rounded-2xl px-5 py-3 font-extrabold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 shrink-0 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 2c-5.524 0-10.002 4.478-10.002 10.002 0 1.763.456 3.42 1.252 4.878l-1.328 4.853 4.966-1.303c1.411.769 3.007 1.205 4.704 1.205 5.524 0 10.002-4.478 10.002-10.002 0-5.524-4.478-10.002-10.002-10.002zm6.368 14.263c-.276.779-1.364 1.488-2.222 1.621-.629.098-1.455.176-4.223-.974-3.541-1.47-5.819-5.074-5.996-5.309-.176-.234-1.426-1.9-1.426-3.621 0-1.721.898-2.568 1.22-2.91.322-.342.703-.429.937-.429.234 0 .469.002.674.012.213.01.5.031.78.694.283.674.967 2.353 1.05 2.519.083.166.138.359.028.58-.11.22-.165.35-.331.543-.166.193-.348.384-.497.58-.166.216-.341.452-.147.785.193.332.859 1.416 1.84 2.293.816.73 1.503 1.05 1.84 1.189.337.138.536.117.737-.11.201-.227.859-.997 1.088-1.342.229-.345.459-.29.775-.173.317.117 2.012.993 2.356 1.163.344.17.574.252.657.393.084.141.084.819-.192 1.598z"/>
                  </svg>
                  Dekont Gönder (WhatsApp)
                </a>
              )}
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

