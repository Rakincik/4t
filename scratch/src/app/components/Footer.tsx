import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LockClosedIcon,
  CreditCardIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Footer() {
  const footerLinks = {
    uzaktanEgitim: [
      { name: "Kaymakamlık", href: "/kurs-kategori/kaymakamlik" },
      { name: "KPSS A", href: "/kurs-kategori/kpss-a" },
      { name: "Sayıştay", href: "/kurs-kategori/sayistay" },
      { name: "Tüm Kurslar", href: "/kurslar" },
    ],
    urunler: [
      { name: "4T FLIX", href: "/flix" },
      { name: "Ankara Örgün Eğitim", href: "/orgun-egitim" },
      { name: "Blog", href: "/blog" },
    ],
    kurumsal: [
      { name: "Hakkımızda", href: "/hakkimizda" },
      { name: "Eğitmen Kadromuz", href: "/egitmenler" },
      { name: "İletişim", href: "/iletisim" },
      { name: "Sıkça Sorulan Sorular", href: "/sss" },
    ],
    yasal: [
      { name: "KVKK Aydınlatma", href: "/yasal/kvkk" },
      { name: "Gizlilik Politikası", href: "/yasal/gizlilik" },
      { name: "Çerez Politikası", href: "/yasal/cerez" },
      { name: "Mesafeli Satış Sözleşmesi", href: "/yasal/mesafeli-satis" },
      { name: "İptal ve İade Şartları", href: "/yasal/iade-sartlari" },
    ],
  };

  const whatsappHref = (() => {
    const text = encodeURIComponent(
      "Merhaba, 4T Akademi eğitimleri hakkında bilgi almak istiyorum. (Sınavım: …)"
    );
    return `https://wa.me/905531724044?text=${text}`;
  })();

  return (
    <footer
      className="relative bg-[#0B1221] text-gray-300 overflow-hidden border-t border-white/5"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Background Effects - More subtle and premium */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#DC2626]/5 rounded-full blur-[80px] opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

        {/* TOP SECTION: Information & Quick Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-12">

          {/* Brand & Info (Left - 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="font-extrabold text-3xl tracking-tight flex items-center gap-2">
              <span className="text-white">4T</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                AKADEMİ
              </span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Geleceğin bürokratlarını yetiştiren öncü eğitim platformu.
              <span className="text-white font-medium"> Uzaktan Eğitim</span>,
              <span className="text-white font-medium"> Örgün Öğretim</span> ve
              <span className="text-white font-medium"> Dijital Yayıncılık</span> alanlarında lider çözüm ortağınız.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-sm text-gray-400 group">
                <MapPinIcon className="h-5 w-5 text-[#DC2626] group-hover:scale-110 transition-transform mt-0.5" />
                <span className="group-hover:text-gray-300 transition-colors">
                  İlkbahar Mah. 593 Sk. No:2 <br /> Çankaya / ANKARA
                </span>
              </div>
              <a href="mailto:destek@4takademi.com" className="flex items-center gap-3 text-sm text-gray-400 group">
                <EnvelopeIcon className="h-5 w-5 text-[#DC2626] group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">destek@4takademi.com</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400 group">
                <PhoneIcon className="h-5 w-5 text-[#DC2626] group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">(0312) 433 40 44</span>
              </div>
            </div>
          </div>

          {/* CTA Banner (Right - 8 Cols) */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 md:p-10 backdrop-blur-sm group hover:border-white/20 transition-all duration-300">

              {/* Decorative Glow within CTA */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC2626]/20 blur-[50px] rounded-full group-hover:bg-[#DC2626]/30 transition-colors"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs font-bold mb-3">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Canlı Destek Hattı
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Kararsız mı kaldın?</h3>
                  <p className="text-gray-400 text-sm max-w-md">
                    Eğitim danışmanlarımızla görüşerek hedefine en uygun yol haritasını birlikte çizelim.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b857] text-white px-6 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-green-900/20"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href="/flix"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold transition-all border border-white/5"
                  >
                    Paketleri İncele
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LINKS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">

          {/* Uzaktan Eğitim */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#DC2626] rounded-full"></span>
              Uzaktan Eğitim
            </h4>
            <ul className="space-y-3">
              {footerLinks.uzaktanEgitim.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ürünler */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Ürünler
            </h4>
            <ul className="space-y-3">
              {footerLinks.urunler.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Kurumsal
            </h4>
            <ul className="space-y-3">
              {footerLinks.kurumsal.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gray-500 rounded-full"></span>
              Yasal
            </h4>
            <ul className="space-y-3">
              {footerLinks.yasal.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} 4T Akademi Yayıncılık. Tüm hakları saklıdır.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <LockClosedIcon className="w-3 h-3" />
              256-bit SSL Güvenli Ödeme
            </div>
            <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Ödeme ikonları buraya demo olarak konulabilir veya icon set eklenebilir */}
              <CreditCardIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
