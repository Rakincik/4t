// Dosya Yolu: app/iletisim/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { logGenerateLead } from "@/lib/gtag";

/* ===================================================== */
/* UTILS                                                 */
/* ===================================================== */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function sanitizePhoneForTel(phone: string) {
  return phone.replace(/\s|\(|\)|-/g, "");
}

/* ===================================================== */
/* DATA (ileride CMS)                                    */
const DEFAULT_CONTACT = {
  email: "destek@4takademi.com",
  phone: "(0312) 433 40 44",
  whatsappDisplay: "(0553) 172 40 44 (WhatsApp)",
  whatsapp: "905531724044", // sadece rakam: ülke koduyla
  address: "İlkbahar Mah. 593 Sk. No:2 Çankaya/ANKARA",
  mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.706788574718!2d32.84680807661595!3d39.88081698888941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f0d6350f0f5%3A0x809c91f01c4c107!2s4T%20Akademi!5e0!3m2!1str!2str!4v1730702657801!5m2!1str!2str",
  heroBadge: "7/24 dönüş hedefi • Danışman destekli yönlendirme",
  heroTitle: "Bize Ulaşın",
  heroDesc: "Kurs seçimi, kayıt, ödeme veya teknik destek… Ne lazımsa hızlıca çözelim. En hızlı yol: WhatsApp.",
  heroBtn1: "Formu Doldur",
  heroBtn2: "WhatsApp’tan Yaz",
  heroBtn3: "Hemen Ara",
  formTitle: "Ücretsiz Danışmanlık / Destek",
  formDesc: "Formu doldurun, ekibimiz sizi arayıp en doğru paketi netleştirsin.",
  formSuccess: "Mesajın ulaştı ✅",
  formSuccessDesc: "En kısa sürede dönüş yapacağız. Acilse WhatsApp’tan yazabilirsin.",
  formKvkk: "Formu göndererek KVKK kapsamında iletişim kurulmasını kabul etmiş olursunuz.",
  mapTitle: "Haritadayız",
  mapDesc: "Ankara kampüsümüze yol tarifi alabilirsiniz.",
};

/* ===================================================== */
/* 1) HERO – satış odaklı, net yönlendirme               */
/* ===================================================== */
function ContactHero({ contactData }: { contactData: typeof DEFAULT_CONTACT }) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* controlled glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-52 right-[-120px] h-[520px] w-[520px] rounded-full bg-secondary/8 blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-dark/70">
          <span className="h-2 w-2 rounded-full bg-secondary" />
          {contactData.heroBadge}
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-dark">
          {contactData.heroTitle}
        </h1>

        <div className="mt-6 text-lg sm:text-xl text-dark/70 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: contactData.heroDesc }} />

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="#form"
            className="btn-4t rounded-2xl px-8 py-3 text-base font-extrabold inline-flex items-center justify-center"
          >
            {contactData.heroBtn1}
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>

          <a
            href={`https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent(
              "Merhaba, kurslar hakkında bilgi almak istiyorum."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn-4t-secondary rounded-2xl px-8 py-3 text-base font-extrabold inline-flex items-center justify-center"
          >
            {contactData.heroBtn2}
            <ChatBubbleLeftRightIcon className="ml-2 h-5 w-5" />
          </a>

          <a
            href={`tel:${sanitizePhoneForTel(contactData.phone)}`}
            className="rounded-2xl px-8 py-3 text-base font-extrabold inline-flex items-center justify-center
                       border border-black/10 bg-white text-dark hover:bg-light-muted transition"
          >
            {contactData.heroBtn3}
            <PhoneIcon className="ml-2 h-5 w-5 text-primary" />
          </a>
        </div>

        {/* mini trust */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { icon: ClockIcon, title: "Hızlı Dönüş", desc: "Ortalama 30-60 dk" },
            { icon: ShieldCheckIcon, title: "KVKK Uyumlu", desc: "Güvenli iletişim" },
            { icon: CheckBadgeIcon, title: "Net Yönlendirme", desc: "Hedefe göre plan" },
          ].map((x) => (
            <div key={x.title} className="card-4t rounded-3xl p-5 text-left">
              <div className="flex items-center gap-3">
                <x.icon className="h-6 w-6 text-primary" />
                <div className="font-extrabold text-dark">{x.title}</div>
              </div>
              <div className="mt-2 text-sm text-dark/60">{x.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* 2) CONTACT – form + hızlı iletişim kartları + harita   */
/* ===================================================== */
function ContactFormSection({ contactData }: { contactData: typeof DEFAULT_CONTACT }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "Kurslar Hakkında Bilgi",
    message: "",
  });

  const whatsappHref = useMemo(() => {
    const msg = encodeURIComponent(
      `Merhaba, bilgi almak istiyorum.\n\nAd: ${form.firstName} ${form.lastName}\nKonu: ${form.subject}\nMesaj: ${form.message || "-"}`
    );
    return `https://wa.me/${contactData.whatsapp}?text=${msg}`;
  }, [form, contactData.whatsapp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);

    // TODO: API call (ileride)
    // await fetch("/api/contact", { method:"POST", body: JSON.stringify(form) })

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      logGenerateLead("contact_form", "Contact Form Submit");
      setForm((p) => ({
        ...p,
        message: "",
      }));
    }, 900);
  };

  return (
    <section id="form" className="bg-light py-20 scroll-mt-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* LEFT: FORM */}
          <div className="bg-white rounded-3xl border border-black/10 p-8 sm:p-10 shadow-[0_30px_80px_rgba(11,60,138,0.10)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-dark">
                  {contactData.formTitle}
                </h2>
                <div className="mt-2 text-dark/60" dangerouslySetInnerHTML={{ __html: contactData.formDesc }} />
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold
                           border border-black/10 bg-white text-dark hover:bg-light-muted transition"
              >
                WhatsApp
                <ChatBubbleLeftRightIcon className="ml-2 h-5 w-5 text-secondary" />
              </a>
            </div>

            {sent && (
              <div className="mt-6 rounded-2xl border border-black/10 bg-light p-4">
                <div className="flex items-start gap-3">
                  <CheckBadgeIcon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-dark">
                      {contactData.formSuccess}
                    </div>
                    <div className="text-sm text-dark/60 mt-1">
                      {contactData.formSuccessDesc}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-extrabold text-dark">
                    Adınız
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="mt-2 block w-full rounded-2xl border border-black/10 bg-white p-3 shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Ad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-dark">
                    Soyadınız
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="mt-2 block w-full rounded-2xl border border-black/10 bg-white p-3 shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Soyad"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-extrabold text-dark">
                    E-posta
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 block w-full rounded-2xl border border-black/10 bg-white p-3 shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="ornek@mail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-dark">
                    Telefon (isteğe bağlı)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-2 block w-full rounded-2xl border border-black/10 bg-white p-3 shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="05xx xxx xx xx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-dark">
                  Konu
                </label>
                <select
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-2 block w-full rounded-2xl border border-black/10 bg-white p-3 shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option>Kurslar Hakkında Bilgi</option>
                  <option>Teknik Destek</option>
                  <option>Ödeme ve Fatura</option>
                  <option>Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-dark">
                  Mesajınız
                </label>
                <textarea
                  rows={6}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 block w-full rounded-2xl border border-black/10 bg-white p-3 shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Hedef sınavınız, seviyeniz ve neye ihtiyacınız var? (örn: KPSS A, iktisat netleri düşük, plan istiyorum)"
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full rounded-2xl py-4 text-base font-extrabold text-white transition",
                    loading ? "bg-black/20" : "btn-4t"
                  )}
                >
                  {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl py-3 text-sm font-extrabold text-dark border border-black/10 bg-white hover:bg-light-muted transition
                               inline-flex items-center justify-center gap-2"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-secondary" />
                    WhatsApp’tan Yaz
                  </a>

                  <a
                    href={`tel:${sanitizePhoneForTel(contactData.phone)}`}
                    className="rounded-2xl py-3 text-sm font-extrabold text-dark border border-black/10 bg-white hover:bg-light-muted transition
                               inline-flex items-center justify-center gap-2"
                  >
                    <PhoneIcon className="h-5 w-5 text-primary" />
                    Hemen Ara
                  </a>
                </div>

                <div className="text-xs text-dark/50 text-center">
                  {contactData.formKvkk}
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT: INFO + MAP */}
          <div className="space-y-6">
            {/* Quick cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-[0_18px_60px_rgba(11,60,138,0.08)]">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-6 w-6 text-primary" />
                  <div className="font-extrabold text-dark">Telefon</div>
                </div>
                <a
                  href={`tel:${sanitizePhoneForTel(contactData.phone)}`}
                  className="mt-3 block text-lg font-extrabold text-dark hover:underline"
                >
                  {contactData.phone}
                </a>
                <div className="mt-1 text-sm text-dark/60">
                  Çalışma saatleri: 09:00–19:00
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-[0_18px_60px_rgba(11,60,138,0.08)]">
                <div className="flex items-center gap-3">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-secondary" />
                  <div className="font-extrabold text-dark">WhatsApp</div>
                </div>
                <a
                  href={`https://wa.me/${contactData.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-lg font-extrabold text-dark hover:underline"
                >
                  {contactData.whatsappDisplay}
                </a>
                <div className="mt-1 text-sm text-dark/60">
                  En hızlı dönüş kanalı
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-[0_18px_60px_rgba(11,60,138,0.08)]">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-6 w-6 text-primary" />
                  <div className="font-extrabold text-dark">E-posta</div>
                </div>
                <a
                  href={`mailto:${contactData.email}`}
                  className="mt-3 block text-lg font-extrabold text-dark hover:underline break-all"
                >
                  {contactData.email}
                </a>
                <div className="mt-1 text-sm text-dark/60">
                  Destek & fatura işlemleri
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-[0_18px_60px_rgba(11,60,138,0.08)]">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-6 w-6 text-primary" />
                  <div className="font-extrabold text-dark">Adres</div>
                </div>
                <div className="mt-3 text-sm text-dark/70 leading-relaxed whitespace-pre-line">
                  {contactData.address}
                </div>
                <a
                  href="#harita"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline"
                >
                  Haritada aç
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Map */}
            <div
              id="harita"
              className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-[0_30px_80px_rgba(11,60,138,0.10)]"
            >
              <div className="p-6 border-b border-black/10">
                <div className="text-lg font-extrabold text-dark">{contactData.mapTitle}</div>
                <div className="text-sm text-dark/60 mt-1" dangerouslySetInnerHTML={{ __html: contactData.mapDesc }} />
              </div>

              <div className="aspect-video w-full">
                <iframe
                  title="Google Maps"
                  src={
                    contactData.mapsEmbed.includes("<iframe") 
                      ? (contactData.mapsEmbed.match(/src="([^"]+)"/) || [])[1] || contactData.mapsEmbed 
                      : contactData.mapsEmbed
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Extra CTA */}

          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== */
/* PAGE                                                  */
/* ===================================================== */
/* ===================================================== */
/* PAGE                                                  */
/* ===================================================== */
export default function ContactPage() {
  const [contactData, setContactData] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    fetch("/api/admin/page-content?page=iletisim")
      .then(res => res.json())
      .then(data => {
        if (data?.contact?.metadata) {
          const m = data.contact.metadata;
          setContactData(prev => ({
            ...prev,
            email: m.email || prev.email,
            phone: m.phone || prev.phone,
            whatsappDisplay: m.whatsappDisplay || prev.whatsappDisplay,
            whatsapp: m.whatsapp || prev.whatsapp,
            address: m.address || prev.address,
            mapsEmbed: m.mapsEmbed || prev.mapsEmbed,
            heroBadge: m.heroBadge || prev.heroBadge,
            heroTitle: m.heroTitle || prev.heroTitle,
            heroDesc: m.heroDesc || prev.heroDesc,
            heroBtn1: m.heroBtn1 || prev.heroBtn1,
            heroBtn2: m.heroBtn2 || prev.heroBtn2,
            heroBtn3: m.heroBtn3 || prev.heroBtn3,
            formTitle: m.formTitle || prev.formTitle,
            formDesc: m.formDesc || prev.formDesc,
            formSuccess: m.formSuccess || prev.formSuccess,
            formSuccessDesc: m.formSuccessDesc || prev.formSuccessDesc,
            formKvkk: m.formKvkk || prev.formKvkk,
            mapTitle: m.mapTitle || prev.mapTitle,
            mapDesc: m.mapDesc || prev.mapDesc,
          }));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-light">
      <MainHeader />
      <ContactHero contactData={contactData} />
      <ContactFormSection contactData={contactData} />
      <Footer />
    </main>
  );
}
