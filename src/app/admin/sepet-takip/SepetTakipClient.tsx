"use client";

import { useState, useMemo } from "react";
import { 
    PhoneIcon, 
    TrashIcon, 
    MagnifyingGlassIcon, 
    ShoppingBagIcon, 
    ClockIcon,
    ArrowTopRightOnSquareIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline";
import { deleteAbandonedCart } from "./actions";

interface CartItem {
    id: string;
    title: string;
}

interface AbandonedCart {
    id: string;
    name: string;
    email: string;
    phone: string;
    courses: CartItem[];
    createdAt: string;
}

export default function SepetTakipClient({ initialCarts }: { initialCarts: AbandonedCart[] }) {
    const [carts, setCarts] = useState<AbandonedCart[]>(initialCarts);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter carts based on search query
    const filteredCarts = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return carts;
        return carts.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.email.toLowerCase().includes(query)
        );
    }, [carts, searchTerm]);

    // Format dates to human-friendly local time
    function formatDate(isoString: string) {
        try {
            const date = new Date(isoString);
            return date.toLocaleString("tr-TR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return isoString;
        }
    }

    // Format phone to clean country-code format (e.g. 905xxxxxxxxx) for WhatsApp
    function getCleanWhatsAppLink(phone: string, name: string, courses: CartItem[]) {
        const digitsOnly = phone.replace(/\D/g, "");
        let cleanPhone = digitsOnly;
        
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "90" + cleanPhone.slice(1);
        } else if (cleanPhone.length === 10) {
            cleanPhone = "90" + cleanPhone;
        }

        const courseNames = courses.map(c => `"${c.title}"`).join(", ");
        const message = `Merhaba ${name},\n\n4T Akademi sepetinizde yarım kalan ${courseNames} eğitim paketiniz ile ilgili sipariş adımlarında yardımcı olmamı ister misiniz?\n\nKayıt işlemlerinizi kolaylaştırmak adına size yardımcı olmak için buradayım.`;
        
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu sepet kaydını silmek istediğinize emin misiniz?")) return;
        setDeletingId(id);
        try {
            const res = await deleteAbandonedCart(id);
            if (res.success) {
                setCarts(prev => prev.filter(c => c.id !== id));
            } else {
                alert(res.error || "Silme işlemi sırasında hata oluştu.");
            }
        } catch {
            alert("Sunucu bağlantısı sırasında bir hata oluştu.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Terk Edilmiş Sepet Takibi</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                        Sitenizde ödeme aşamasına gelip bilgilerini dolduran fakat satın almayı tamamlamayan sıcak satış adayları.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="İsim, telefon veya e-posta ara..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0B1221]/10 focus:border-[#0B1221] transition text-sm bg-white"
                    />
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-800">
                <InformationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-xs font-semibold leading-relaxed">
                    <span className="font-bold">Satış Kurtarma Tüyosu:</span> Sepetini terk eden adaylar, satın almaya en yakın potansiyel öğrencilerdir. WhatsApp simgesine tıklayarak tek dokunuşla kişiselleştirilmiş bir destek veya indirim kuponu mesajı gönderebilir, sıcak satış dönüşümlerinizi kolayca artırabilirsiniz!
                </div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center">
                        <ShoppingBagIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{carts.length}</div>
                        <div className="text-xs text-gray-450 font-bold uppercase tracking-wider">Bekleyen Kurtarma</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 text-green-600 flex items-center justify-center">
                        <PhoneIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">
                            {carts.filter(c => c.phone && c.phone !== "-").length}
                        </div>
                        <div className="text-xs text-gray-450 font-bold uppercase tracking-wider">Telefonu Olan Aday</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
                        <ClockIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">Son 24 Saat</div>
                        <div className="text-xs text-gray-450 font-bold uppercase tracking-wider mt-0.5">Sıcak Müşteri Takibi</div>
                    </div>
                </div>
            </div>

            {/* Table / Grid list */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {filteredCarts.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-medium">
                        Kayıt bulunamadı.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-450 uppercase tracking-wider">
                                    <th className="p-4 pl-6">Müşteri</th>
                                    <th className="p-4">İletişim</th>
                                    <th className="p-4">Sepetteki Kurslar</th>
                                    <th className="p-4">Tarih</th>
                                    <th className="p-4 pr-6 text-right">İletişim / İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                                {filteredCarts.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition">
                                        {/* Name */}
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-gray-900">{c.name}</div>
                                            <div className="text-xs text-gray-450 font-semibold mt-0.5">Misafir Ziyaretçi</div>
                                        </td>

                                        {/* Contact details */}
                                        <td className="p-4 space-y-0.5">
                                            <div className="flex items-center gap-1.5 text-gray-900">
                                                <PhoneIcon className="h-4 w-4 text-gray-400" />
                                                <span>{c.phone}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 font-medium">{c.email}</div>
                                        </td>

                                        {/* Cart items */}
                                        <td className="p-4 max-w-xs">
                                            <div className="flex flex-wrap gap-1">
                                                {c.courses.map((item, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded-md bg-[#0B1221]/5 text-gray-800 text-xs font-bold border border-black/5"
                                                    >
                                                        {item.title}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="p-4 text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <ClockIcon className="h-4 w-4 text-gray-400" />
                                                <span>{formatDate(c.createdAt)}</span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {c.phone && c.phone !== "-" ? (
                                                    <a
                                                        href={getCleanWhatsAppLink(c.phone, c.name, c.courses)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow transition active:scale-95"
                                                    >
                                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.022-.08-.117-.162-.193-.238-.076-.076-.172-.116-.27-.116h-1.01c-.1 0-.194.04-.27.116-.076.076-.171.158-.193.238l-.348 1.258c-.024.088-.108.148-.198.148-.052 0-.102-.02-.144-.058-1.59-1.428-2.614-2.452-4.042-4.042-.038-.042-.058-.092-.058-.144 0-.09.06-.174.148-.198l1.258-.348c.08-.022.162-.117.238-.193.076-.076.116-.172.116-.27v-1.01c0-.1-.04-.194-.116-.27-.076-.076-.158-.171-.238-.193l-1.258-.348c-.088-.024-.182.012-.224.092l-.634 1.22c-.104.2-.09.444.036.632 1.488 2.218 3.284 4.014 5.502 5.502.188.126.432.14.632.036l1.22-.634c.08-.042.116-.136.092-.224l-.348-1.258zM12 2C6.477 2 2 6.477 2 12c0 1.887.525 3.65 1.442 5.162L2.043 21.92l4.908-1.353C8.423 21.493 10.15 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.15-.472-4.432-1.282l-.317-.197-2.92.805.807-2.923-.195-.316C4.135 14.882 3.666 13.5 3.666 12c0-4.596 3.738-8.333 8.334-8.333 4.595 0 8.333 3.737 8.333 8.333 0 4.596-3.738 8.333-8.333 8.333z"/>
                                                        </svg>
                                                        WhatsApp
                                                        <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 opacity-60" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-bold px-2.5 py-1.5 rounded-lg border border-gray-100 bg-gray-50">
                                                        No Phone
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    disabled={deletingId === c.id}
                                                    className="p-1.5 border border-red-150 hover:bg-red-50 text-red-600 rounded-lg transition disabled:opacity-50 active:scale-95"
                                                    title="Kaydı Arşivle/Sil"
                                                >
                                                    <TrashIcon className="h-4.5 w-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
