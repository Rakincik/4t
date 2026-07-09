"use client";

import {
  PhoneIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  VideoCameraIcon, 
  ComputerDesktopIcon, 
  MapIcon, 
  SparklesIcon, 
  ScaleIcon, 
  CalculatorIcon
} from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/solid";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function getDropIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("kpss") || lower.includes("eğitim")) return ComputerDesktopIcon;
  if (lower.includes("hakimlik") || lower.includes("hukuk")) return ScaleIcon;
  if (lower.includes("muhasebe") || lower.includes("maliye")) return CalculatorIcon;
  if (lower.includes("sayıştay") || lower.includes("kaymakam")) return AcademicCapIcon;
  if (lower.includes("kamp") || lower.includes("çözüm")) return MapIcon;
  if (lower.includes("yayın") || lower.includes("kitap")) return BookOpenIcon;
  if (lower.includes("video") || lower.includes("canlı")) return VideoCameraIcon;
  return SparklesIcon;
}

interface MenuItem {
  id: string;
  label: string;
  url: string;
  desc?: string | null;
  children?: MenuItem[];
}

interface MenuBlock {
  id: string;
  slug: string;
  title: string;
  items: MenuItem[];
}

export default function MainHeader() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (!mobileOpen) {
      setOpenMobileSubmenu(null);
    }
  }, [mobileOpen]);
  const [announcement, setAnnouncement] = useState("Geleceğe Hazırlık");
  const [phone, setPhone] = useState("(0312) 433 40 44");
  
  const DEFAULT_MENUS: MenuBlock[] = [
    {
      id: "m1", slug: "header-uzaktan", title: "Uzaktan Eğitim",
      items: []
    },
    {
      id: "m2", slug: "header-kamplar", title: "Kamplar",
      items: [
        { id: "i5", label: "Kamplar", url: "/kamplar" }
      ]
    },
    {
      id: "m3", slug: "header-flix", title: "4T FLIX",
      items: [
        { id: "i6", label: "4T FLIX", url: "/flix" }
      ]
    },
    {
      id: "m4", slug: "header-orgun", title: "Ankara Örgün",
      items: [
        { id: "i7", label: "Örgün Eğitim", url: "/orgun-egitim" }
      ]
    },
    {
      id: "m5", slug: "header-kurumsal", title: "Kurumsal",
      items: [
        { id: "i8", label: "Hakkımızda", url: "/hakkimizda" },
        { id: "i9", label: "Başarılarımız", url: "/basarilarimiz" },
        { id: "i10", label: "Blog", url: "/blog" }
      ]
    }
  ];

  const [headerMenus, setHeaderMenus] = useState<MenuBlock[]>(DEFAULT_MENUS);
  
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch dynamic announcement
    fetch("/api/settings/announcement?t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data && data.announcement) {
          setAnnouncement(data.announcement);
        }
      })
      .catch(console.error);

    // Fetch dynamic global config for phone
    fetch("/api/settings/global?t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data && data.config?.phone) {
          setPhone(data.config.phone);
        }
      })
      .catch(console.error);

    // Fetch all header menus
    fetch("/api/settings/menu?prefix=header-", { cache: "no-store", headers: { "Pragma": "no-cache" } })
      .then(res => res.json())
      .then(data => {
        if (data && data.menus) {
          // API artık menüleri DB'deki `order` değerine göre sıralı döndürüyor.
          if (data.menus && data.menus.length > 0) {
            const merged = data.menus.map((sm: any) => {
               const dm = DEFAULT_MENUS.find(d => d.slug === sm.slug);
               if ((!sm.items || sm.items.length === 0) && dm) {
                   return { ...sm, items: dm.items };
               }
               return sm;
            });
            setHeaderMenus(merged as MenuBlock[]);
          }
        }
      })
      .catch(console.error);

    setIsMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
          setOpenDropdownId(null);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdownId(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

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
        <div className="bg-[#0B1221] h-10 w-full"></div>
        <div className="bg-white border-b border-black/10">
          <div className="container mx-auto max-w-[1440px] px-4 h-[74px] flex items-center">
            <a href="/" aria-label="4T Akademi">
              <img src="/Logo.svg" alt="4T Akademi" className="h-10 w-auto" />
            </a>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full sticky top-0 z-[200] font-sans" ref={headerRef}>

      {/* TOP BAR / LEAD BAR */}
      <div className="bg-[#0B1221] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/10 blur-xl pointer-events-none"></div>

        <div className="container mx-auto max-w-[1440px] px-4">
          <div className="flex justify-between items-center h-10 text-xs sm:text-sm">
            <div className="flex items-center gap-6">
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="flex items-center text-gray-400 hover:text-white transition-colors">
                <PhoneIcon className="h-3.5 w-3.5 mr-2 text-[#DC2626]" />
                <span className="hidden sm:inline">{phone}</span>
                <span className="sm:hidden">Ara</span>
              </a>

              <a href="/sss" className="hidden sm:flex items-center text-gray-400 hover:text-white transition-colors">
                <QuestionMarkCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                SSS
              </a>

              <div className="hidden md:flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="text-gray-500">{announcement}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://4tyayinevi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium relative group"
              >
                <BookOpenIcon className="h-3.5 w-3.5 mr-2" />
                <span>4T Yayınevi</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-400 transition-all group-hover:w-full"></span>
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

      {/* MAIN NAVBAR */}
      <div
        className={cn(
          "border-b border-black/5 bg-white/90 backdrop-blur-md transition-all duration-300",
          scrolled && "shadow-lg shadow-gray-200/50"
        )}
      >
        <div className="container mx-auto max-w-[1440px] px-4 xl:px-6">
          <div className="flex items-center h-[74px]">

            {/* SOL TARAF: LOGO + NAV */}
            <div className="flex items-center flex-1">
              {/* LOGO */}
              <a href="/" aria-label="4T Akademi" className="flex items-center group mr-8 xl:mr-12">
                <img
                  src="/Logo.svg"
                  alt="4T Akademi"
                  className="h-10 w-auto group-hover:opacity-90 transition-opacity"
                />
              </a>

              {/* DESKTOP NAV */}
              <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              
              {headerMenus.map(menuBlock => {
                const items = menuBlock.items || [];
                if (items.length === 0) return null;

                const displayTitle = menuBlock.title.replace(/\s*\(Header\)\s*/i, "").trim();
                
                // Eğer tek bir öğe varsa, alt öğesi yoksa ve öğenin adı menü grubu adıyla AYNIYSA direkt buton/link olarak bas.
                // Eğer isimler FARKLIYSA (örneğin Ankara Örgün altına 'Kırıkkale' eklendiyse) bunu açılır menü (dropdown) yap.
                const isForceDropdown = menuBlock.slug === "header-uzaktan" || 
                                       (items.length === 1 && items[0].label.toLowerCase() !== displayTitle.toLowerCase());
                
                if (!isForceDropdown && items.length === 1 && (!items[0].children || items[0].children.length === 0)) {
                  const child = items[0];
                  
                  // Flix için özel animasyonlu tasarım
                  if (menuBlock.slug === "header-flix") {
                    return (
                      <a key={child.id} href={child.url} className="px-3 xl:px-4 py-2 rounded-xl border border-red-100 bg-red-50/30 text-md font-extrabold text-[#DC2626] hover:bg-red-50 hover:border-red-200 transition-all flex items-center gap-1 whitespace-nowrap">
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        {displayTitle}
                      </a>
                    );
                  }

                  // Normal link tasarımı (Örgün, Blog, Hakkımızda, Kamplar vb.)
                  return (
                    <a key={child.id} href={child.url} className="px-3 xl:px-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 text-[15px] font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-200 hover:text-[#0B1221] transition-all whitespace-nowrap">
                      {displayTitle}
                    </a>
                  );
                }

                // Çoklu öğe (veya force dropdown) varsa Dropdown olarak bas
                const title = menuBlock.title.replace(/\s*\(Header\)\s*/, "").trim();
                const isOpen = openDropdownId === menuBlock.slug;

                return (
                  <div className="relative group" key={menuBlock.id}>
                    <button
                      onClick={() => setOpenDropdownId(isOpen ? null : menuBlock.slug)}
                      className={cn(
                        "whitespace-nowrap inline-flex items-center px-3 xl:px-4 py-2 rounded-xl border text-[15px] font-bold transition-all duration-200 group/btn",
                        isOpen ? "bg-gray-100 border-gray-200 text-[#0B1221]" : "bg-gray-50/50 border-gray-100 text-gray-700 hover:bg-gray-100 hover:border-gray-200 hover:text-[#0B1221]"
                      )}
                    >
                      {title}
                      <ChevronDownIcon className={cn("h-4 w-4 ml-1.5 transition-transform duration-200", isOpen && "rotate-180")} />
                    </button>

                    <div
                      className={cn(
                        "absolute left-0 top-full mt-2 w-[520px] origin-top-left transition-all duration-200 z-50",
                        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="rounded-2xl border border-gray-100 bg-white shadow-2xl p-4 ring-1 ring-black/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {items.map(child => {
                            return (
                              <div key={child.id} className="flex flex-col">
                                <a
                                  href={child.url}
                                  className="flex flex-col p-3 rounded-xl hover:bg-gray-50 transition-colors group/child border border-transparent hover:border-gray-100"
                                  title={child.label}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[14px] text-gray-800 group-hover/child:text-[#DC2626] transition-colors leading-snug break-words">
                                      {child.label}
                                    </div>
                                    {child.desc && (
                                      <div className="text-[12px] text-gray-500 font-medium leading-relaxed mt-1 line-clamp-2">
                                        {child.desc}
                                      </div>
                                    )}
                                  </div>
                                </a>
                                {/* Alt Öğeler (Sub Items) */}
                                {child.children && child.children.length > 0 && (
                                  <div className="pl-4 pr-2 pb-2 flex flex-col gap-1 -mt-1">
                                    {child.children.map(sub => (
                                      <a 
                                        key={sub.id} 
                                        href={sub.url} 
                                        className="text-[13px] text-gray-600 font-medium hover:text-[#DC2626] hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors flex items-start"
                                        title={sub.label}
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2 mt-1.5 shrink-0"></span>
                                        <span className="leading-snug break-words">{sub.label}</span>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {items.length > 1 && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-center">
                            <a href={
                              menuBlock.slug === "header-orgun" ? "/orgun-egitim" :
                              menuBlock.slug === "header-kamplar" ? "/kamplar" :
                              menuBlock.slug === "header-kurumsal" ? "/hakkimizda" :
                              "/kurslar"
                            } className="text-[13px] font-bold text-gray-600 hover:text-[#DC2626] flex items-center transition-colors group/viewall">
                              Tümünü Görüntüle <ChevronRightIcon className="w-3.5 h-3.5 ml-1 transition-transform group-hover/viewall:translate-x-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              {status === "authenticated" ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors border border-transparent">
                    <UserCircleIcon className="w-6 h-6 text-[#DC2626]" />
                    <span className="hidden sm:inline">{session?.user?.name || "Hesabım"}</span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2 space-y-1">
                      {(session?.user as any)?.role === "ADMIN" && (
                        <a href="/admin" className="block px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-1">
                          Admin Paneli
                        </a>
                      )}
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
                  className="hidden lg:inline-flex px-6 py-2.5 rounded-xl font-bold text-gray-700 hover:text-[#0B1221] bg-white hover:bg-gray-50 border border-black/10 hover:border-black/20 transition-all duration-200 whitespace-nowrap shadow-sm"
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
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Bars3Icon className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
          <div className="absolute inset-0 z-0" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full w-[85%] max-w-sm bg-white p-6 shadow-2xl animate-slide-in-right overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <img src="/Logo.svg" alt="4T Akademi" className="h-8" />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {status === "authenticated" && session ? (
              <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#0B1221] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#0B1221] truncate">{session?.user?.name || "Kullanıcı"}</div>
                    <div className="text-xs text-gray-500 truncate">{session?.user?.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a href="/profil" className="text-center py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">Profilim</a>
                  <a href="/profil/kurslarim" className="text-center py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">Kurslarım</a>
                  {(session?.user as any)?.role === "ADMIN" && (
                    <a href="/admin" className="col-span-2 text-center py-2 bg-blue-600 border border-blue-700 rounded-lg text-xs font-bold text-white hover:bg-blue-700">Admin Paneli</a>
                  )}
                </div>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full mt-2 py-2 text-center text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Çıkış Yap</button>
              </div>
            ) : (
              <div className="mb-6 flex gap-3">
                <a href="/giris" className="flex-1 py-3 text-center bg-[#0B1221] text-white rounded-xl font-bold text-sm shadow-md">Giriş Yap</a>
                <a href="/kayit" className="flex-1 py-3 text-center border border-gray-200 text-[#0B1221] rounded-xl font-bold text-sm hover:bg-gray-50">Üye Ol</a>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menü</div>
                {/* Tekli Linkler */}
                {headerMenus.filter(m => {
                  const displayTitle = m.title.replace(/\s*\(Header\)\s*/i, "").trim();
                  const isForceDropdown = m.slug === "header-uzaktan" || (m.items?.length === 1 && m.items[0].label.toLowerCase() !== displayTitle.toLowerCase());
                  return !isForceDropdown && m.items?.length === 1 && (!m.items[0].children || m.items[0].children.length === 0);
                }).map(menuBlock => {
                  const displayTitle = menuBlock.title.replace(/\s*\(Header\)\s*/i, "").trim();
                  const child = menuBlock.items[0];
                  if (menuBlock.slug === "header-flix") {
                    return <a key={child.id} href={child.url} className="block py-3 text-lg font-bold text-[#DC2626]">{displayTitle}</a>;
                  }
                  return <a key={child.id} href={child.url} className="block py-3 text-lg font-bold text-[#0B1221]">{displayTitle}</a>;
                })}
                <a href="/iletisim" className="block py-3 text-lg font-bold text-[#0B1221]">İletişim</a>
              </div>

              {/* Açılır Menüler / Submenüler (Accordion Görünümü) */}
              {headerMenus.filter(m => {
                const displayTitle = m.title.replace(/\s*\(Header\)\s*/i, "").trim();
                const isForceDropdown = m.slug === "header-uzaktan" || (m.items?.length === 1 && m.items[0].label.toLowerCase() !== displayTitle.toLowerCase());
                return isForceDropdown || (m.items?.length || 0) > 1 || (m.items?.length === 1 && (m.items[0]?.children?.length || 0) > 0);
              }).map(menuBlock => {
                const title = menuBlock.title.replace(/\s*\(Header\)\s*/i, "").trim();
                const isSubmenuOpen = openMobileSubmenu === menuBlock.slug;
                return (
                  <div key={menuBlock.id} className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : menuBlock.slug)}
                      className="flex items-center justify-between w-full py-2 text-[#0B1221] font-bold text-base focus:outline-none"
                    >
                      <span>{title}</span>
                      <ChevronDownIcon className={cn("h-5 w-5 text-gray-500 transition-transform duration-200", isSubmenuOpen && "rotate-180")} />
                    </button>
                    {isSubmenuOpen && (
                      <div className="pl-2 mt-2 space-y-1">
                        {menuBlock.items.map(l => (
                          <div key={l.id} className="mb-2">
                            <a href={l.url} className="block py-1.5 text-gray-700 font-bold hover:text-[#DC2626] transition-colors text-sm">
                              {l.label}
                            </a>
                            {l.children && l.children.length > 0 && (
                              <div className="pl-4 border-l border-gray-200 ml-2 space-y-1 mt-1">
                                {l.children.map(sub => (
                                  <a key={sub.id} href={sub.url} className="block py-1.5 text-xs text-gray-500 font-medium hover:text-[#DC2626]">
                                    {sub.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <a href="https://4tuzem.okinar.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-[#DC2626] text-white rounded-xl font-bold hover:opacity-90">
                  <UserCircleIcon className="w-5 h-5" />
                  Öğrenci Paneli
                </a>
                <a href="https://4tyayinevi.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-400 text-[#0B1221] rounded-xl font-bold hover:bg-yellow-300">
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
