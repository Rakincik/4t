"use client";

import { useEffect, useMemo, useState } from "react";
import {
  XMarkIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

type LeadPayload = {
  name: string;
  phone: string;
  exam: string;
  note?: string;
};

function normalizePhone(input: string) {
  // basit TR normalize: sadece rakam kalsın
  const digits = input.replace(/\D/g, "");
  // 0 ile başlıyorsa koru; +90 girdiyse sadeleştir
  if (digits.startsWith("90") && digits.length >= 12) return "0" + digits.slice(2);
  return digits;
}

export default function LeadModal({
  open,
  onClose,
  source = "site",
  presetExam,
}: {
  open: boolean;
  onClose: () => void;
  source?: string;
  presetExam?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [exam, setExam] = useState(presetExam || "Kararsızım");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setDone(false);
    setLoading(false);
    // preset exam değişirse modal açıldığında uygula
    setExam(presetExam || "Kararsızım");
  }, [open, presetExam]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const canSubmit = useMemo(() => {
    const n = name.trim().length >= 2;
    const p = normalizePhone(phone).length >= 10;
    return n && p && !loading;
  }, [name, phone, loading]);

  async function submit() {
    if (!canSubmit) return;

    setLoading(true);
    const payload: LeadPayload = {
      name: name.trim(),
      phone: normalizePhone(phone),
      exam,
      note: note.trim() || undefined,
    };

    try {
      // ŞİMDİLİK: backend yok → console + localStorage
      console.log("[LEAD]", { source, ...payload });

      const existing = JSON.parse(localStorage.getItem("leads") || "[]");
      existing.unshift({ at: new Date().toISOString(), source, ...payload });
      localStorage.setItem("leads", JSON.stringify(existing.slice(0, 50)));

      setDone(true);
    } catch (e) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-3xl bg-white border border-black/10 shadow-[0_30px_120px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="p-6 sm:p-7 border-b border-black/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-light-muted border border-black/10 px-3 py-1 text-xs font-extrabold text-dark/70">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-primary" />
                  Ücretsiz Danışmanlık
                </div>
                <h3 className="mt-3 text-2xl font-extrabold text-dark">
                  1 Dakikada Arayalım
                </h3>
                <p className="mt-2 text-sm text-dark/60">
                  Hedef sınavına göre en doğru programı önerelim.
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-light-muted transition"
                aria-label="Kapat"
              >
                <XMarkIcon className="h-6 w-6 text-dark/60" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            {!done ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-dark">Ad Soyad</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-dark">Telefon</label>
                    <div className="mt-2 relative">
                      <PhoneIcon className="h-5 w-5 text-dark/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05xx xxx xx xx"
                        className="w-full rounded-2xl border border-black/10 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-bold text-dark">İlgilendiğin sınav</label>
                    <select
                      value={exam}
                      onChange={(e) => setExam(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option>Kaymakamlık</option>
                      <option>KPSS A</option>
                      <option>Sayıştay</option>
                      <option>Hakimlik</option>
                      <option>Kararsızım</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-bold text-dark">Not (opsiyonel)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Örn: Haftaiçi akşam aranmak istiyorum."
                      className="mt-2 w-full min-h-[96px] rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={submit}
                    disabled={!canSubmit}
                    className={`btn-4t rounded-2xl px-6 py-4 font-extrabold w-full
                      ${!canSubmit ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Gönderiliyor..." : "Ücretsiz Danışmanlık Al"}
                  </button>

                  <a
                    href="https://wa.me/905531724044"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl px-6 py-4 font-extrabold w-full text-center
                               border border-black/10 hover:bg-light-muted transition"
                  >
                    WhatsApp’tan Yaz
                  </a>
                </div>

                <div className="mt-5 text-xs text-dark/50">
                  Göndererek iletişime geçilmesini kabul etmiş olursun.
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 border border-black/10 flex items-center justify-center">
                  <CheckBadgeIcon className="h-9 w-9 text-primary" />
                </div>
                <h4 className="mt-4 text-2xl font-extrabold text-dark">Tamamdır!</h4>
                <p className="mt-2 text-dark/60">
                  Danışmanımız en kısa sürede seni arayacak.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 btn-4t rounded-2xl px-8 py-3 font-extrabold"
                >
                  Kapat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
