import { ReactNode } from "react";
import Link from "next/link";
import { UserCircleIcon, BookOpenIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import MainHeader from "@/app/components/MainHeader";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilLayout({ children }: { children: ReactNode }) {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   redirect("/giris");
    // }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <MainHeader />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* SIDEBAR */}
                    <aside className="md:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-[#DC2626] mb-3">
                                    <UserCircleIcon className="w-12 h-12" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Hesabım</h2>
                                <div className="text-sm text-gray-500">Öğrenci Paneli</div>
                            </div>

                            <nav className="space-y-2">
                                <Link
                                    href="/profil"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-red-50 hover:text-[#DC2626] transition-colors"
                                >
                                    <UserCircleIcon className="w-5 h-5" />
                                    Profil Bilgileri
                                </Link>
                                <Link
                                    href="/profil/kurslarim"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-red-50 hover:text-[#DC2626] transition-colors"
                                >
                                    <BookOpenIcon className="w-5 h-5" />
                                    Kurslarım
                                </Link>
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-colors text-left">
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
