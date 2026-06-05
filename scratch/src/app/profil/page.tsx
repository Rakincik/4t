"use client";

import { useSession } from "next-auth/react";
import { UserCircleIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";

export default function ProfilPage() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-[#0B1221] to-[#1e293b] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-2">Hoş Geldin, {user?.name}!</h1>
                    <p className="text-gray-300">Öğrenci paneline buradan erişebilirsin.</p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <UserCircleIcon className="w-6 h-6 text-[#DC2626]" />
                    Kişisel Bilgiler
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="text-sm font-bold text-gray-500 mb-1">Ad Soyad</div>
                        <div className="font-bold text-gray-800">{user?.name}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="text-sm font-bold text-gray-500 mb-1 flex items-center gap-1">
                            <EnvelopeIcon className="w-4 h-4" />
                            E-posta Adresi
                        </div>
                        <div className="font-bold text-gray-800">{user?.email}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="text-sm font-bold text-gray-500 mb-1 flex items-center gap-1">
                            <PhoneIcon className="w-4 h-4" />
                            Telefon
                        </div>
                        <div className="font-bold text-gray-800">
                            {/* Phone is not in base User type yet, need to update type or fetch */}
                            -
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
