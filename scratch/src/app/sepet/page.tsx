"use client";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/components/cart/cartStore";

function formatTRY(n: number) {
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
  } catch {
    return `₺${n.toFixed(0)}`;
  }
}

export default function SepetPage() {
  const { state, subtotal, total, remove, setQty, clear } = useCart();

  return (
    <main className="min-h-screen bg-light">
      <MainHeader />

      <section className="container mx-auto max-w-7xl px-4 pt-28 pb-20">
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
                <a href="/kurslar" className="mt-6 inline-flex rounded-2xl px-5 py-3 font-extrabold text-white btn-4t">
                  Kurslara Git
                </a>
              </div>
            ) : (
              state.items.map((it) => (
                <div key={it.id} className="rounded-3xl border border-black/10 bg-white p-5">
                  <div className="flex gap-4">
                    <div className="h-20 w-28 rounded-2xl overflow-hidden bg-light border border-black/10 flex-shrink-0">
                      {it.imageUrl ? (
                        <img src={it.imageUrl} alt={it.title} className="h-full w-full object-cover" />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-lg font-extrabold text-dark truncate">{it.title}</div>
                      <div className="text-sm text-dark/50">{it.category || "Eğitim Paketi"}</div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-2xl border border-black/10 bg-light">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="h-10 w-10 inline-flex items-center justify-center hover:bg-light-muted rounded-2xl transition"
                          >
                            −
                          </button>
                          <div className="px-4 text-sm font-extrabold text-dark">{it.qty}</div>
                          <button
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="h-10 w-10 inline-flex items-center justify-center hover:bg-light-muted rounded-2xl transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-lg font-extrabold text-primary">
                          {formatTRY(it.price * it.qty)}
                        </div>

                        <button
                          onClick={() => remove(it.id)}
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
          </div>

          <aside className="lg:sticky lg:top-28 space-y-4">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-sm font-bold text-dark/60">Sipariş özeti</div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-dark/60 font-bold">Ara toplam</span>
                <span className="text-dark font-extrabold">{formatTRY(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-dark/60 font-bold">Toplam</span>
                <span className="text-primary font-extrabold">{formatTRY(total)}</span>
              </div>

              <a
                href="/checkout"
                className="mt-6 w-full inline-flex items-center justify-center rounded-2xl px-5 py-3 font-extrabold text-white btn-4t"
              >
                Ödemeye Geç
              </a>

              <div className="mt-4 text-xs text-dark/50">
                * Ödeme adımında taksit/Param seçenekleri gösterilecek.
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
