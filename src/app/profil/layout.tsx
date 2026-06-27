"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
    UserCircleIcon, 
    BookOpenIcon, 
    ArrowLeftOnRectangleIcon,
    MapPinIcon,
    ShoppingBagIcon 
} from "@heroicons/react/24/solid";
import MainHeader from "@/app/components/MainHeader";

export default function ProfilLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        {
            name: "Profil Bilgileri",
            href: "/profil",
            icon: UserCircleIcon
        },
        {
            name: "Adres & Fatura",
            href: "/profil/adres",
            icon: MapPinIcon
        },
        {
            name: "Siparişlerim",
            href: "/profil/siparislerim",
            icon: ShoppingBagIcon
        },
        {
            name: "Kurslarım",
            href: "/profil/kurslarim",
            icon: BookOpenIcon
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <MainHeader />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* SIDEBAR */}
                    <aside className="md:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-[#DC2626] mb-3">
                                    <UserCircleIcon className="w-12 h-12" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Hesabım</h2>
                                <div className="text-sm text-gray-500">Öğrenci Paneli</div>
                            </div>

                            <nav className="space-y-2">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                                                isActive 
                                                    ? "bg-red-50 text-[#DC2626]" 
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                <button 
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-all duration-200 text-left cursor-pointer"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                    Çıkış Yap
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="md:col-span-3">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
