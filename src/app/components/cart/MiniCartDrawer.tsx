"use client";

import React, { useMemo } from "react";
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useCart } from "./cartStore";
import Image from "next/image";

function formatTRY(n: number) {
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
  } catch {
    return `₺${n.toFixed(0)}`;
  }
}

export default function MiniCartDrawer() {
  const { state, isOpen, close, subtotal, total, remove, setQty } = useCart();

  const count = useMemo(() => state.items.reduce((s, x) => s + x.qty, 0), [state.items]);

  return (
    <>
      {/* overlay */}
      <div
        className={[
          "fixed inset-0 z-[60] transition",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={close}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* panel */}
      <aside
        className={[
          "fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white shadow-[0_20px_80px_rgba(0,0,0,0.35)]",
          "transition-transform duration-200",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Sepet"
      >
        <div className="h-full flex flex-col">
          {/* header */}
          <div className="px-5 py-5 border-b border-black/10 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-dark/60">Sepet</div>
              <div className="text-xl font-extrabold text-dark">{count} ürün</div>
            </div>
            <button
              type="button"
              onClick={close}
              className="h-10 w-10 rounded-xl border border-black/10 bg-white hover:bg-light-muted transition inline-flex items-center justify-center"
              aria-label="Kapat"
            >
              <XMarkIcon className="h-5 w-5 text-dark/70" />
            </button>
          </div>

          {/* items */}
          <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
            {state.items.length === 0 ? (
              <div className="rounded-3xl border border-black/10 bg-light p-6">
                <div className="text-lg font-extrabold text-dark">Sepet boş</div>
                <div className="mt-2 text-sm text-dark/60">
                  Kurs ekleyince burada görünecek.
                </div>
                <a
                  href="/kurslar"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 font-extrabold text-white btn-4t"
                  onClick={close}
                >
                  Kurslara Git
                </a>
              </div>
            ) : (
              state.items.map((it) => (
                <div key={it.id} className="rounded-3xl border border-black/10 bg-white p-4">
                  <div className="flex gap-3">
                    <div className="h-16 w-20 rounded-2xl overflow-hidden bg-light border border-black/10 flex-shrink-0">
                      {it.imageUrl ? (
                        <div className="relative w-full h-full"><Image fill sizes="80px" src={it.imageUrl} alt={it.title} className="object-cover" /></div>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-extrabold text-dark truncate">{it.title}</div>
                      <div className="text-xs text-dark/50">{it.category || "Eğitim Paketi"}</div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="text-sm font-extrabold text-primary">
                          {formatTRY(it.price)}
                          {it.originalPrice ? (
                            <span className="ml-2 text-xs text-dark/40 line-through font-bold">
                              {formatTRY(it.originalPrice)}
                            </span>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(it.id)}
                          className="h-9 w-9 rounded-xl border border-black/10 bg-white hover:bg-light-muted transition inline-flex items-center justify-center"
                          aria-label="Sil"
                        >
                          <TrashIcon className="h-4 w-4 text-dark/60" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-2xl border border-black/10 bg-light">
                          <button
                            type="button"
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="h-10 w-10 inline-flex items-center justify-center hover:bg-light-muted rounded-2xl transition"
                            aria-label="Azalt"
                          >
                            <MinusIcon className="h-4 w-4 text-dark/60" />
                          </button>
                          <div className="px-3 text-sm font-extrabold text-dark">{it.qty}</div>
                          <button
                            type="button"
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="h-10 w-10 inline-flex items-center justify-center hover:bg-light-muted rounded-2xl transition"
                            aria-label="Arttır"
                          >
                            <PlusIcon className="h-4 w-4 text-dark/60" />
                          </button>
                        </div>

                        <div className="text-sm font-extrabold text-dark">
                          {formatTRY(it.price * it.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* footer */}
          <div className="px-5 py-5 border-t border-black/10 bg-white">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark/60 font-bold">Ara toplam</span>
              <span className="text-dark font-extrabold">{formatTRY(subtotal)}</span>
            </div>
            {state.coupon && (
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-dark/60 font-bold">Kupon İndirimi ({state.coupon.code})</span>
                <span className="text-green-600 font-extrabold">-{formatTRY(state.coupon.type === 'PERCENT' ? (subtotal * state.coupon.amount) / 100 : state.coupon.amount)}</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between text-sm border-t border-black/10 pt-2">
              <span className="text-dark/60 font-bold">Toplam</span>
              <span className="text-primary font-extrabold">{formatTRY(total)}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href="/sepet"
                className="rounded-2xl px-4 py-3 font-extrabold text-primary border border-primary bg-white hover:bg-light-muted transition inline-flex items-center justify-center"
                onClick={close}
              >
                Sepete Git
              </a>
              <a
                href="/checkout"
                className="rounded-2xl px-4 py-3 font-extrabold text-white btn-4t inline-flex items-center justify-center"
                onClick={close}
              >
                Satın Al
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
