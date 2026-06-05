"use client";

import {
  PhoneIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const uzaktanEgitimLinks = [
  { name: "Kaymakamlık", href: "/kurs-kategori/kaymakamlik", desc: "Sıfırdan zirveye hazırlık" },
  { name: "KPSS A", href: "/kurs-kategori/kpss-a", desc: "Premium online paketler" },
  { name: "Sayıştay", href: "/kurs-kategori/sayistay", desc: "Kamp + deneme sistemi" },
  { name: "Tüm Uzaktan Kurslar", href: "/kurslar", desc: "Tüm paketleri incele" },
];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MainHeader() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropWrapRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = dropWrapRef.current;
      if (dropOpen && el && !el.contains(e.target as Node)) setDropOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropOpen]);

  useEffect(() => {
    if (!isMounted) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isMounted]);

  /* =========================
     SSR FALLBACK
     ========================= */
  if (!isMounted) {
    return (
      <header className="w-full sticky top-0 z-[200]">
        {/* Fallback styling keeping layout stability */}
        <div className="bg-[#0B1221] h-10 w-full"></div>
        <div className="bg-white border-b border-black/10">
          <div className="container mx-auto max-w-7xl px-4 h-[74px] flex items-center">
            <a href="/" aria-label="4T Akademi">
              <img src="/Logo.svg" alt="4T Akademi" className="h-10 w-auto" />
            </a>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full sticky top-0 z-[200] font-sans">

      {/* 
         TOP BAR (LEAD BAR) 
         Premium Dark Theme + Highlighted Actions
      */}
      <div className="bg-[#0B1221] border-b border-white/5 relative overflow-hidden">
        {/* Subtle background gradient/glow */}
        <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/10 blur-xl pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center h-10 text-xs sm:text-sm">

            {/* LEFT SIDE: Contact & Yayınevi */}
            <div className="flex items-center gap-6">
              <a href="tel:03124334044" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <PhoneIcon className="h-3.5 w-3.5 mr-2 text-[#DC2626]" />
                <span className="hidden sm:inline">(0312) 433 40 44</span>
                <span className="sm:hidden">Ara</span>
              </a>

              <a
                href="https://4tyayinevi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium relative group"
              >
                <BookOpenIcon className="h-3.5 w-3.5 mr-2" />
                <span>4T Yayınevi</span>
                {/* Underline animation */}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-400 transition-all group-hover:w-full"></span>
              </a>

              <div className="hidden md:flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="text-gray-500">Geleceğe Hazırlık</span>
              </div>
            </div>

            {/* RIGHT SIDE: Öğrenci Paneli & SSS */}
            <div className="flex items-center gap-4">
              <a href="/sss" className="hidden sm:flex items-center text-gray-400 hover:text-white transition-colors">
                <QuestionMarkCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                SSS
              </a>

              <a
                href="https://4tuzem.okinar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 hover:bg-[#DC2626] hover:border-[#DC2626] text-white font-bold transition-all duration-300 group shadow-lg shadow-black/20"
              >
                <UserCircleIcon className="h-4 w-4 text-white/80 group-hover:text-white" />
                <span>Öğrenci Paneli</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 
          MAIN NAVBAR 
      */}
      <div
        className={cn(
          "border-b border-black/5 bg-white/90 backdrop-blur-md transition-all duration-300",
          scrolled && "shadow-lg shadow-gray-200/50"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center h-[74px]">

            {/* LOGO */}
            <a href="/" aria-label="4T Akademi" className="flex items-center group">
              <img
                src="/Logo.svg"
                alt="4T Akademi"
                className="h-10 w-auto group-hover:opacity-90 transition-opacity"
              />
            </a>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-1">

              {/* Dropdown Menu */}
              <div className="relative" ref={dropWrapRef}>
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className={cn(
                    "inline-flex items-center px-4 py-2 rounded-xl text-[15px] font-bold transition-all duration-200",
                    dropOpen ? "bg-gray-100 text-[#0B1221]" : "text-gray-600 hover:bg-gray-50 hover:text-[#0B1221]"
                  )}
                >
                  Uzaktan Eğitim
                  <ChevronDownIcon className={cn("h-4 w-4 ml-1.5 transition-transform duration-200", dropOpen && "rotate-180")} />
                </button>

                <div
                  className={cn(
                    "absolute left-0 top-full mt-2 w-[320px] origin-top-left transition-all duration-200",
                    dropOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-xl p-3 space-y-1">
                    {uzaktanEgitimLinks.map(l => (
                      <a
                        key={l.name}
                        href={l.href}
                        className="flex flex-col px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="font-bold text-gray-800 group-hover:text-[#DC2626] flex items-center justify-between">
                          {l.name}
                          <ChevronDownIcon className="w-3 h-3 -rotate-90 opacity-0 group-hover:opacity-100 text-[#DC2626] transition-opacity" />
                        </div>
                        <div className="text-xs text-gray-400 font-medium">{l.desc}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <a href="/orgun-egitim" className="px-4 py-2 rounded-xl text-[15px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0B1221] transition-all">Ankara Örgün</a>
              <a href="/flix" className="px-4 py-2 rounded-xl text-md font-extrabold text-[#DC2626] hover:bg-red-50 transition-all flex items-center gap-1">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                4T FLIX
              </a>
              <a href="/blog" className="px-4 py-2 rounded-xl text-[15px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0B1221] transition-all">Blog</a>
              <a href="/hakkimizda" className="px-4 py-2 rounded-xl text-[15px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0B1221] transition-all">Hakkımızda</a>
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              {status === "authenticated" ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                    <UserCircleIcon className="w-6 h-6 text-[#DC2626]" />
                    <span className="hidden sm:inline">{session.user?.name || "Hesabım"}</span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2 space-y-1">
                      <a href="/profil" className="block px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#DC2626] transition-colors">
                        Profilim
                      </a>
                      <a href="/profil/kurslarim" className="block px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#DC2626] transition-colors">
                        Kurslarım
                      </a>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  href="/giris"
                  className="hidden lg:inline-flex px-6 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                >
                  Giriş Yap
                </a>
              )}

              <a
                href="/iletisim"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B1221] hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-black/20 hover:shadow-black/30 transition-all hover:-translate-y-0.5"
              >
                <span>İletişim</span>
              </a>

              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Bars3Icon className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-6 shadow-2xl animate-slide-in-right">
            <div className="flex justify-between items-center mb-8">
              <img src="/Logo.svg" alt="4T Akademi" className="h-8" />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menü</div>
                <a href="/orgun-egitim" className="block text-lg font-bold text-[#0B1221]">Ankara Örgün</a>
                <a href="/flix" className="block text-lg font-bold text-[#DC2626]">4T FLIX</a>
                <a href="/blog" className="block text-lg font-bold text-[#0B1221]">Blog</a>
                <a href="/hakkimizda" className="block text-lg font-bold text-[#0B1221]">Hakkımızda</a>
                <a href="/iletisim" className="block text-lg font-bold text-[#0B1221]">İletişim</a>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Uzaktan Eğitim</div>
                {uzaktanEgitimLinks.map(l => (
                  <a key={l.name} href={l.href} className="block py-2 text-gray-600 font-medium">
                    {l.name}
                  </a>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <a href="https://4tuzem.okinar.com" className="flex items-center justify-center gap-2 w-full py-3 bg-[#DC2626] text-white rounded-xl font-bold">
                  <UserCircleIcon className="w-5 h-5" />
                  Öğrenci Paneli
                </a>
                <a href="https://4tyayinevi.com" className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-400 text-[#0B1221] rounded-xl font-bold">
                  <BookOpenIcon className="w-5 h-5" />
                  4T Yayınevi
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
