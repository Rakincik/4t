"use client";

import React, { useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length >= 12) return "0" + digits.slice(2);
  return digits;
}

export default function LeadForm({ presetExam, source }: { presetExam: string; source: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [exam, setExam] = useState(presetExam);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim().length >= 2 && normalizePhone(phone).length >= 10;

  async function onSubmit(e: any) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const payload = {
        at: new Date().toISOString(),
        source,
        name: name.trim(),
        phone: normalizePhone(phone),
        exam,
      };

      console.log("[LEAD]", payload);

      const existing = JSON.parse(localStorage.getItem("leads") || "[]");
      existing.unshift(payload);
      localStorage.setItem("leads", JSON.stringify(existing.slice(0, 50)));

      setDone(true);
    } catch {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-light-muted border border-black/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(11,60,138,0.12)]"
    >
      {!done ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-dark">Ad Soyad</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-dark">Telefon</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="05xx xxx xx xx"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-dark">İlgilendiğin Sınav</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option>Kaymakamlık</option>
                <option>KPSS A</option>
                <option>Sayıştay</option>
                <option>GUY</option>
                <option>Kararsızım</option>
              </select>
            </div>
          </div>

          <button
            disabled={!canSubmit || loading}
            className={`mt-5 w-full btn-4t rounded-2xl py-4 font-extrabold ${
              !canSubmit || loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Gönderiliyor..." : "Ücretsiz Danışmanlık Al"}
          </button>

          <a
            href="https://wa.me/905531724044"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full inline-flex items-center justify-center rounded-2xl py-4 font-extrabold
                       bg-white border border-black/10 hover:bg-light transition"
          >
            WhatsApp’tan Yaz
          </a>

          <div className="mt-4 text-xs text-dark/50">
            Göndererek iletişime geçilmesini kabul etmiş olursun.
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 border border-black/10 flex items-center justify-center">
            <CheckBadgeIcon className="h-9 w-9 text-primary" />
          </div>
          <h4 className="mt-4 text-2xl font-extrabold text-dark">Tamamdır!</h4>
          <p className="mt-2 text-dark/60">Danışmanımız seni arayacak.</p>
          <a href="/kurslar" className="mt-6 btn-4t rounded-2xl px-8 py-3 font-extrabold inline-flex items-center justify-center">
            Tüm Kurslara Git
          </a>
        </div>
      )}
    </form>
  );
}
