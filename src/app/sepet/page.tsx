"use client";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/components/cart/cartStore";
import { useState, useEffect } from "react";
import { validateCouponAction, getRecommendedCoursesAction } from "./actions";
import { recoverAbandonedCartAction } from "@/app/admin/sepet-takip/actions";
import Image from "next/image";
import { logViewCart, logRemoveFromCart } from "@/lib/gtag";

function formatTRY(n: number) {
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
  } catch {
    return `₺${n.toFixed(0)}`;
  }
}

export default function SepetPage() {
  const { state, subtotal, discount, total, remove, setQty, clear, applyCoupon, removeCoupon, add } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const recoverId = urlParams.get("recover");
    if (!recoverId) return;

    const restoreCart = async () => {
      const res = await recoverAbandonedCartAction(recoverId);
      if (res.success && res.courses && res.courses.length > 0) {
        clear();
        res.courses.forEach((c: any) => {
          add({
            id: c.id,
            slug: c.slug,
            title: c.title,
            price: c.price,
            originalPrice: c.originalPrice || c.price,
            imageUrl: c.imageUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
            category: c.category,
            qty: 1,
            variantId: undefined,
            selectedAddonIds: [],
            isCouponApplicable: c.isCouponApplicable ?? true,
            isInstallmentApplicable: c.isInstallmentApplicable ?? true,
          });
        });
        
        // Remove recover from URL search query
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    };
    restoreCart();
  }, [clear, add]);

  const [recs, setRecs] = useState<any[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);

  useEffect(() => {
    const fetchRecs = async () => {
      setRecsLoading(true);
      const cartIds = state.items.map(i => i.id);
      const res = await getRecommendedCoursesAction(cartIds);
      if (res.success && res.courses) {
        setRecs(res.courses);
      }
      setRecsLoading(false);
    };
    fetchRecs();
  }, [state.items]);

  const [hasLoggedViewCart, setHasLoggedViewCart] = useState(false);
  useEffect(() => {
    if (state.items.length > 0 && !hasLoggedViewCart) {
      logViewCart(state.items, total);
      setHasLoggedViewCart(true);
    }
  }, [state.items, total, hasLoggedViewCart]);

  const handleRemove = (item: any) => {
    logRemoveFromCart(item);
    remove(item.id);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMsg({ type: "", text: "" });

    const itemsForValidation = state.items.map(i => ({ id: i.id, price: i.price, qty: i.qty }));
    const res = await validateCouponAction(couponInput, itemsForValidation);
    
    if (res.error) {
        setCouponMsg({ type: "error", text: res.error });
        removeCoupon();
    } else if (res.success && res.coupon) {
        setCouponMsg({ type: "success", text: "Kupon başarıyla uygulandı!" });
        applyCoupon(res.coupon);
        setCouponInput("");
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
      removeCoupon();
      setCouponMsg({ type: "", text: "" });
  };

  return (
    <main className="min-h-screen bg-light">
      <MainHeader />

      <section className="container mx-auto max-w-7xl px-4 pt-12 pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-dark/60">Sepet</div>
            <h1 className="text-3xl font-extrabold text-dark">Seçtiğin eğitimler</h1>
          </div>
          {state.items.length > 0 ? (
            <button
              onClick={clear}
              className="rounded-2xl px-4 py-2 font-extrabold text-dark border border-black/10 bg-white hover:bg-light-muted transition"
            >
              Sepeti Temizle
            </button>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {state.items.length === 0 ? (
              <div className="rounded-3xl border border-black/10 bg-white p-8">
                <div className="text-xl font-extrabold text-dark">Sepet boş</div>
                <div className="mt-2 text-sm text-dark/60">Hemen bir eğitim ekleyelim.</div>
                <a href="/kurslar" className="mt-6 inline-flex rounded-2xl px-5 py-3 font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition">
                  Kurslara Git
                </a>
              </div>
            ) : (
              state.items.map((it) => (
                <div key={it.id} className="rounded-3xl border border-black/10 bg-white p-5">
                  <div className="flex gap-4">
                    <div className="h-20 w-28 rounded-2xl overflow-hidden bg-light border border-black/10 flex-shrink-0">
                      {it.imageUrl ? (
                        <div className="relative w-full h-full"><Image fill sizes="112px" src={it.imageUrl} alt={it.title} className="object-cover" /></div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-lg font-extrabold text-dark truncate">
                        {it.title?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")}
                      </div>
                      <div className="text-sm text-dark/50">{it.category || "Eğitim Paketi"}</div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-lg font-extrabold text-primary">
                          {formatTRY(it.price)}
                        </div>

                        <button
                          onClick={() => handleRemove(it)}
                          className="rounded-2xl px-4 py-2 font-extrabold text-dark border border-black/10 bg-white hover:bg-light-muted transition"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Bunu Alanlar Bunları da Aldı (Öneriler) */}
            {recs.length > 0 && (
              <div className="mt-8 pt-6 border-t border-black/10">
                <h3 className="text-xl font-extrabold text-dark mb-4">Bunu Alanlar Bunları da Aldı</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recs.map((rec) => (
                    <div key={rec.id} className="rounded-3xl border border-black/10 bg-white p-4 flex gap-4 items-center group transition hover:shadow-md">
                      <div className="h-16 w-20 rounded-2xl overflow-hidden bg-light border border-black/10 flex-shrink-0 relative">
                        {rec.imageUrl ? (
                          <Image fill sizes="80px" src={rec.imageUrl} alt={rec.title} className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-extrabold text-dark truncate hover:text-[#DC2626] transition-colors">
                          <a href={`/kurs/${rec.slug}`}>
                            {rec.title?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")}
                          </a>
                        </h4>
                        <p className="text-xs text-dark/50">{rec.category || "Eğitim Paketi"}</p>
                        
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="text-sm font-extrabold text-[#DC2626]">
                            {formatTRY(rec.price)}
                            {rec.oldPrice ? (
                              <span className="ml-2 text-xs text-dark/40 line-through font-bold">
                                {formatTRY(rec.oldPrice)}
                              </span>
                            ) : null}
                          </div>
                          
                          <button
                            onClick={() => add({
                              id: rec.id,
                              slug: rec.slug,
                              title: rec.title,
                              price: rec.price,
                              imageUrl: rec.imageUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
                              qty: 1,
                              variantId: undefined,
                              selectedAddonIds: [],
                              isCouponApplicable: rec.isCouponApplicable ?? true,
                              isInstallmentApplicable: rec.isInstallmentApplicable ?? true,
                            })}
                            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl shadow-sm transition"
                          >
                            + Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 space-y-4">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-sm font-bold text-dark/60">Sipariş özeti</div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-dark/60 font-bold">Ara toplam</span>
                <span className="text-dark font-extrabold">{formatTRY(subtotal)}</span>
              </div>
              {state.coupon && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-dark/60 font-bold">Kupon İndirimi ({state.coupon.code})</span>
                  <span className="text-green-600 font-extrabold">-{formatTRY(discount)}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2">
                <span className="text-dark/60 font-bold">Toplam</span>
                <span className="text-primary font-extrabold">{formatTRY(total)}</span>
              </div>

              {/* KUPON KODU ALANI */}
              <div className="mt-6">
                <label className="text-xs font-bold text-dark/70 mb-2 block">İndirim Kodu / Kupon</label>
                {state.coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                      <div>
                          <p className="text-xs font-bold text-green-700">{state.coupon.code} uygulandı</p>
                          <p className="text-[10px] text-green-600 mt-0.5">{state.coupon.type === 'PERCENT' ? `%${state.coupon.amount} indirim` : `₺${state.coupon.amount} indirim`}</p>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1">Kaldır</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toLocaleUpperCase('tr-TR'))}
                        placeholder="Kupon girin" 
                        className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                    />
                    <button 
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="bg-dark text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-dark/90 transition disabled:opacity-50"
                    >
                        {couponLoading ? "..." : "Ekle"}
                    </button>
                  </div>
                )}
                {couponMsg.text && (
                    <p className={`text-[11px] font-bold mt-2 ${couponMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                        {couponMsg.text}
                    </p>
                )}
              </div>

              <a
                href="/checkout"
                className="mt-6 w-full inline-flex items-center justify-center rounded-2xl px-5 py-3 font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Ödemeye Geç
              </a>

              <div className="mt-4 text-xs text-red-600 font-semibold">
                * Kart bilgilerinizi girdikten sonra taksit seçeneklerinizi görebilirsiniz.
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
