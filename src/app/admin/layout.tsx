"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    UsersIcon,
    AcademicCapIcon,
    ShoppingCartIcon,
    KeyIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    FilmIcon,
    NewspaperIcon,
    TicketIcon,
    DocumentTextIcon,
    Squares2X2Icon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    TagIcon,
} from "@heroicons/react/24/outline";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: Squares2X2Icon },
    { href: "/admin/yoneticiler", label: "Yöneticiler", icon: ShieldCheckIcon },
    { href: "/admin/ogrenciler", label: "Öğrenciler", icon: UsersIcon },
    { href: "/admin/kurslar", label: "Kurslar", icon: AcademicCapIcon },
    { href: "/admin/kategoriler", label: "Kategoriler", icon: TagIcon },
    { href: "/admin/flix", label: "4T FLIX Paketleri", icon: FilmIcon },
    { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingCartIcon },
    { href: "/admin/erisimler", label: "Kurs Erişimleri", icon: KeyIcon },
    { href: "/admin/blog", label: "Blog Yazıları", icon: NewspaperIcon },
    { href: "/admin/kuponlar", label: "Kupon Takibi", icon: TicketIcon },
    { href: "/admin/sayfalar", label: "Sayfa İçerikleri", icon: DocumentTextIcon },
    { href: "/admin/istatistikler", label: "İstatistikler", icon: ChartBarIcon },
    { href: "/admin/site", label: "Site Yönetimi", icon: Cog6ToothIcon },
];

// Sidebar'ın otomatik kapanması gereken sayfalar
const WIDE_PAGES = ["/admin/sayfalar/"];

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // CMS editör sayfalarında otomatik collapse
    useEffect(() => {
        const isWidePage = WIDE_PAGES.some(p => pathname.startsWith(p));
        setCollapsed(isWidePage);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — 4T Branded Dark */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full bg-[#0B1221] transform transition-all duration-300 ease-in-out flex flex-col ${
                    collapsed ? "w-[68px] lg:translate-x-0" : "w-64 lg:translate-x-0"
                } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Logo */}
                <div className="relative flex items-center justify-center px-4 py-5 border-b border-white/10 shrink-0 min-h-[5rem]">
                    <Link href="/admin" className="flex flex-col items-center justify-center w-full overflow-hidden gap-1.5">
                        <div className={`flex items-center justify-center shrink-0 transition-all ${collapsed ? 'w-10 h-10' : 'w-40 h-12'}`}>
                            <Image src="/Logo.svg" alt="4T Akademi Logo" width={collapsed ? 40 : 160} height={48} className="object-contain w-full h-full" />
                        </div>
                        {!collapsed && (
                            <div className="transition-opacity duration-200">
                                <span className="text-[11px] text-blue-300/70 font-medium whitespace-nowrap tracking-wide uppercase">Yönetim Paneli</span>
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute right-3 top-3 p-2 rounded-lg hover:bg-white/10 text-white/60"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation - scrollable */}
                <nav className="flex-1 overflow-y-auto no-scrollbar px-2 py-4 space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={`flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                                    collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
                                } ${isActive
                                    ? "bg-gradient-to-r from-[#0D47A1] to-[#1565C0] text-white shadow-lg shadow-blue-900/30"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-blue-200" : ""}`} />
                                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex items-center justify-center gap-2 mx-2 mb-2 px-3 py-2 rounded-xl text-[11px] font-medium text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
                >
                    {collapsed ? (
                        <ChevronDoubleRightIcon className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronDoubleLeftIcon className="h-4 w-4" />
                            <span>Menüyü Daralt</span>
                        </>
                    )}
                </button>

                {/* User info & logout - sticky bottom */}
                <div className="shrink-0 px-2 py-3 border-t border-white/10">
                    {collapsed ? (
                        /* Collapsed: sadece avatar */
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-[#0D47A1] to-[#1E88E5] rounded-full flex items-center justify-center" title={session?.user?.name || "Admin"}>
                                <span className="text-white font-bold text-sm">
                                    {session?.user?.name?.charAt(0) || "A"}
                                </span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                title="Çıkış Yap"
                                className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        /* Expanded: tam bilgi */
                        <>
                            <div className="flex items-center gap-3 mb-3 px-2">
                                <div className="w-9 h-9 bg-gradient-to-br from-[#0D47A1] to-[#1E88E5] rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-sm">
                                        {session?.user?.name?.charAt(0) || "A"}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {session?.user?.name || "Admin"}
                                    </p>
                                    <p className="text-[11px] text-gray-500 truncate">
                                        {session?.user?.email || "admin@4takademi.com"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                Çıkış Yap
                            </button>
                        </>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className={`transition-all duration-300 ${collapsed ? "lg:pl-[68px]" : "lg:pl-64"}`}>
                {/* Header */}
                <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Bars3Icon className="h-6 w-6 text-gray-600" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs font-medium text-gray-400 hover:text-[#0D47A1] transition-colors flex items-center gap-1"
                        >
                            Siteyi Görüntüle
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
