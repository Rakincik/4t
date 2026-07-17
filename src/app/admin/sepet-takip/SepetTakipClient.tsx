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
import { deleteAbandonedCart, updateCartStatus, createRecoveryCoupon } from "./actions";

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
    userId?: string | null;
    status: string;
    cartValue: number;
}

function stripHtml(html: string) {
    return (html || "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#160;/g, " ").trim();
}

export default function SepetTakipClient({ initialCarts }: { initialCarts: AbandonedCart[] }) {
    const [carts, setCarts] = useState<AbandonedCart[]>(initialCarts);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [couponGeneratingId, setCouponGeneratingId] = useState<string | null>(null);

    // Filter carts based on date and search queries
    const filteredCarts = useMemo(() => {
        let result = carts;

        // Apply Date Range filter
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday.getTime() - 1000 * 60 * 60 * 24);
        const sevenDaysAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);

        if (dateFilter === 'today') {
            result = result.filter(c => new Date(c.createdAt) >= startOfToday);
        } else if (dateFilter === 'yesterday') {
            result = result.filter(c => {
                const dt = new Date(c.createdAt);
                return dt >= startOfYesterday && dt < startOfToday;
            });
        } else if (dateFilter === 'week') {
            result = result.filter(c => new Date(c.createdAt) >= sevenDaysAgo);
        }

        // Apply search query filter
        const query = searchTerm.toLowerCase().trim();
        if (!query) return result;
        return result.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.email.toLowerCase().includes(query)
        );
    }, [carts, dateFilter, searchTerm]);

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

    function formatTRY(n: number) {
        try {
            return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
        } catch {
            return `₺${n.toLocaleString("tr-TR")}`;
        }
    }

    async function handleStatusChange(id: string, newStatus: string) {
        try {
            const res = await updateCartStatus(id, newStatus);
            if (res.success) {
                setCarts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
            } else {
                alert("Durum güncellenirken hata oluştu.");
            }
        } catch {
            alert("Sunucu bağlantısı kurulurken hata oluştu.");
        }
    }

    // Modal state controllers
    const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
    const [useCoupon, setUseCoupon] = useState(true);
    const [discountPercent, setDiscountPercent] = useState(10);
    const [customCouponCode, setCustomCouponCode] = useState("");
    const [isCouponEdited, setIsCouponEdited] = useState(false);

    function handleSelectCartForRecovery(c: AbandonedCart) {
        setSelectedCart(c);
        setUseCoupon(true);
        setDiscountPercent(10);
        setIsCouponEdited(false);
        
        // Generate default code
        const cleanName = c.name.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "").toUpperCase();
        const firstName = cleanName.trim().split(' ')[0] || "SEPET";
        setCustomCouponCode(`KRT-${firstName}-10`);
    }

    function handlePercentChange(val: number) {
        setDiscountPercent(val);
        if (!isCouponEdited && selectedCart) {
            const cleanName = selectedCart.name.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "").toUpperCase();
            const firstName = cleanName.trim().split(' ')[0] || "SEPET";
            setCustomCouponCode(`KRT-${firstName}-${val}`);
        }
    }

    async function handleConfirmRecovery() {
        if (!selectedCart) return;
        
        const c = selectedCart;
        let finalMessage = "";
        let couponCode = "";
        
        const digitsOnly = c.phone.replace(/\D/g, "");
        let cleanPhone = digitsOnly;
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "90" + cleanPhone.slice(1);
        } else if (cleanPhone.length === 10) {
            cleanPhone = "90" + cleanPhone;
        }

        const recoveryLink = `${window.location.origin}/sepet?recover=${c.id}`;
        const courseNames = c.courses.map(course => `"${stripHtml(course.title)}"`).join(", ");

        setCouponGeneratingId(c.id);

        try {
            if (useCoupon) {
                const finalCode = customCouponCode.trim().toLocaleUpperCase('tr-TR');
                if (!finalCode) {
                    alert("Lütfen kupon kodunu girin veya kuponsuz gönderme seçeneğini seçin.");
                    setCouponGeneratingId(null);
                    return;
                }
                
                const coupRes = await createRecoveryCoupon(c.name, discountPercent, finalCode);
                if (coupRes.success && coupRes.code) {
                    couponCode = coupRes.code;
                    finalMessage = `Merhaba ${c.name},\n\n4T Akademi sepetinizde yarım kalan ${courseNames} eğitim paketiniz ile ilgili sipariş adımlarında yardımcı olmamı ister misiniz?\n\nKayıt işlemlerinizi kolaylaştırmak adına size özel 48 saat geçerli %${discountPercent} indirim kuponu tanımladık:\n🎫 İndirim Kodu: *${couponCode}*\n\nTek tıkla sepetinizi geri yükleyip indirimli almak için şu bağlantıyı kullanabilirsiniz:\n👉 ${recoveryLink}\n\nKayıt işlemlerinizde yardımcı olmak için buradayım.`;
                } else {
                    alert(coupRes.error || "Kupon üretilemedi, standart sepet kurtarma linki ile devam ediliyor.");
                }
            }

            if (!finalMessage) {
                // Standart message without coupon
                finalMessage = `Merhaba ${c.name},\n\n4T Akademi sepetinizde yarım kalan ${courseNames} eğitim paketiniz ile ilgili sipariş adımlarında yardımcı olmamı ister misiniz?\n\nTek tıkla sepetinizi geri yükleyip kaldığınız yerden devam etmek için şu bağlantıyı kullanabilirsiniz:\n👉 ${recoveryLink}\n\nKayıt işlemlerinizi kolaylaştırmak adına size yardımcı olmak için buradayım.`;
            }

            // Mark lead status as CONTACTED in DB and local state
            await updateCartStatus(c.id, "CONTACTED");
            setCarts(prev => prev.map(item => item.id === c.id ? { ...item, status: "CONTACTED" } : item));

            // Redirect to WhatsApp
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`;
            window.open(waUrl, "_blank");
            
            // Close modal
            setSelectedCart(null);
        } catch (err) {
            console.error("WhatsApp recovery failed:", err);
            alert("İşlem gerçekleştirilirken bir hata oluştu.");
        } finally {
            setCouponGeneratingId(null);
        }
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

    const last24hCount = carts.filter(c => new Date(c.createdAt) >= new Date(Date.now() - 1000 * 60 * 60 * 24)).length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Terk Edilmiş Sepet Takibi</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                        Sitenizde ödeme aşamasına gelip bilgilerini dolduran fakat satın almayı tamamlamayan sıcak satış adayları.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Tarih Filtre Butonları */}
                    <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
                        {[
                            { id: 'all', label: 'Tümü' },
                            { id: 'today', label: 'Bugün' },
                            { id: 'yesterday', label: 'Dün' },
                            { id: 'week', label: 'Bu Hafta' }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                type="button"
                                onClick={() => setDateFilter(btn.id as any)}
                                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${dateFilter === btn.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <MagnifyingGlassIcon className="h-4.5 w-4.5" />
                        </span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Aday ara..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-250/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs bg-white font-medium"
                        />
                    </div>
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
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center gap-4 hover:shadow transition duration-200">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center">
                        <ShoppingBagIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{carts.length}</div>
                        <div className="text-xs text-gray-450 font-bold uppercase tracking-wider">Bekleyen Kurtarma</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center gap-4 hover:shadow transition duration-200">
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

                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1 hover:shadow transition duration-200">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
                        <ClockIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{last24hCount}</div>
                        <div className="text-xs text-gray-450 font-bold uppercase tracking-wider mt-0.5">Son 24 Saat Sıcak Takip</div>
                    </div>
                </div>
            </div>

            {/* Table / Grid list */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {filteredCarts.length === 0 ? (
                    <div className="p-16 text-center max-w-md mx-auto flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-500 shadow-sm animate-pulse-once">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-gray-900">Harika! Terk Edilmiş Sepet Yok</h3>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed font-medium">
                                Sitenizdeki tüm kullanıcılar ödeme adımlarını başarıyla tamamlamış veya henüz yeni bir sepet terk etme vakası gerçekleşmemiş.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="p-4 pl-6">Müşteri</th>
                                    <th className="p-4">İletişim Bilgileri</th>
                                    <th className="p-4">Sepetteki Kurslar</th>
                                    <th className="p-4 text-right">Sepet Tutarı</th>
                                    <th className="p-4 text-center">Kurtarma Durumu</th>
                                    <th className="p-4">Terk Edilme Tarihi</th>
                                    <th className="p-4 pr-6 text-right">Kurtarma Aksiyonu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700 bg-white">
                                {filteredCarts.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/40 transition-colors duration-150">
                                        {/* Name */}
                                        <td className="p-4 pl-6">
                                            {c.userId ? (
                                                <a 
                                                    href={`/admin/ogrenciler/${c.userId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 group transition"
                                                >
                                                    {c.name}
                                                    <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                                </a>
                                            ) : (
                                                <div className="font-bold text-gray-900">{c.name}</div>
                                            )}
                                            <div className="mt-1.5 flex">
                                                {c.userId ? (
                                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/80 px-2 py-0.5 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        Kayıtlı Öğrenci
                                                    </span>
                                                ) : (
                                                    <span className="bg-gray-50 text-gray-500 border border-gray-200/80 px-2 py-0.5 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                                                        Misafir Ziyaretçi
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Contact details */}
                                        <td className="p-4 space-y-1">
                                            <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                                                <PhoneIcon className="h-4 w-4 text-gray-400" />
                                                <span>{c.phone}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                                                <span>{c.email}</span>
                                            </div>
                                        </td>

                                        {/* Cart items */}
                                        <td className="p-4 max-w-xs">
                                            <div className="flex flex-wrap gap-1.5">
                                                {c.courses.map((item, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded-lg bg-blue-50/50 text-blue-700 text-xs font-bold border border-blue-100/50 shadow-inner-sm"
                                                    >
                                                        {stripHtml(item.title)}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Cart total value */}
                                        <td className="p-4 text-right font-extrabold text-gray-900">
                                            {formatTRY(c.cartValue)}
                                        </td>

                                        {/* Status dropdown */}
                                        <td className="p-4 text-center">
                                            <select
                                                value={c.status}
                                                onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                                className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border outline-none cursor-pointer transition ${
                                                    c.status === "RECOVERED"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : c.status === "CONTACTED"
                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                        : "bg-gray-50 text-gray-600 border-gray-250"
                                                }`}
                                            >
                                                <option value="PENDING">Bekliyor</option>
                                                <option value="CONTACTED">Ulaşıldı</option>
                                                <option value="RECOVERED">Satış Yapıldı</option>
                                            </select>
                                        </td>

                                        {/* Date */}
                                        <td className="p-4 text-gray-500">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold">
                                                <ClockIcon className="h-4 w-4 text-gray-400" />
                                                <span>{formatDate(c.createdAt)}</span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2.5">
                                                {c.phone && c.phone !== "-" ? (
                                                    <button
                                                        type="button"
                                                        disabled={couponGeneratingId === c.id}
                                                        onClick={() => handleSelectCartForRecovery(c)}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-55 disabled:scale-100 cursor-pointer"
                                                    >
                                                        {couponGeneratingId === c.id ? (
                                                            <span className="flex items-center gap-1">
                                                                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                </svg>
                                                                Kupon Hazırlanıyor...
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                                                    <path d="M17.472 14.382c-.022-.08-.117-.162-.193-.238-.076-.076-.172-.116-.27-.116h-1.01c-.1 0-.194.04-.27.116-.076.076-.171.158-.193.238l-.348 1.258c-.024.088-.108.148-.198.148-.052 0-.102-.02-.144-.058-1.59-1.428-2.614-2.452-4.042-4.042-.038-.042-.058-.092-.058-.144 0-.09.06-.174.148-.198l1.258-.348c.08-.022.162-.117.238-.193.076-.076.116-.172.116-.27v-1.01c0-.1-.04-.194-.116-.27-.076-.076-.158-.171-.238-.193l-1.258-.348c-.088-.024-.182.012-.224.092l-.634 1.22c-.104.2-.09.444.036.632 1.488 2.218 3.284 4.014 5.502 5.502.188.126.432.14.632.036l1.22-.634c.08-.042.116-.136.092-.224l-.348-1.258zM12 2C6.477 2 2 6.477 2 12c0 1.887.525 3.65 1.442 5.162L2.043 21.92l4.908-1.353C8.423 21.493 10.15 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.15-.472-4.432-1.282l-.317-.197-2.92.805.807-2.923-.195-.316C4.135 14.882 3.666 13.5 3.666 12c0-4.596 3.738-8.333 8.334-8.333 4.595 0 8.333 3.737 8.333 8.333 0 4.596-3.738 8.333-8.333 8.333z"/>
                                                                </svg>
                                                                Sıcak Satış WhatsApp
                                                                <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-70" />
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 font-extrabold px-2.5 py-1.5 rounded-xl border border-gray-150 bg-gray-50 select-none">
                                                        İletişim Yok
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    disabled={deletingId === c.id}
                                                    className="p-2 border border-gray-200 hover:border-red-500 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition duration-200 disabled:opacity-50 active:scale-95 cursor-pointer"
                                                    title="Arşive Kaldır"
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

            {/* Modern Recovery Modal */}
            {selectedCart && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-black/10 shadow-2xl w-full max-w-md overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-black/5 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-extrabold text-dark flex items-center gap-2">
                                    <span className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.022-.08-.117-.162-.193-.238-.076-.076-.172-.116-.27-.116h-1.01c-.1 0-.194.04-.27.116-.076.076-.171.158-.193.238l-.348 1.258c-.024.088-.108.148-.198.148-.052 0-.102-.02-.144-.058-1.59-1.428-2.614-2.452-4.042-4.042-.038-.042-.058-.092-.058-.144 0-.09.06-.174.148-.198l1.258-.348c.08-.022.162-.117.238-.193.076-.076.116-.172.116-.27v-1.01c0-.1-.04-.194-.116-.27-.076-.076-.158-.171-.238-.193l-1.258-.348c-.088-.024-.182.012-.224.092l-.634 1.22c-.104.2-.09.444.036.632 1.488 2.218 3.284 4.014 5.502 5.502.188.126.432.14.632.036l1.22-.634c.08-.042.116-.136.092-.224l-.348-1.258zM12 2C6.477 2 2 6.477 2 12c0 1.887.525 3.65 1.442 5.162L2.043 21.92l4.908-1.353C8.423 21.493 10.15 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.15-.472-4.432-1.282l-.317-.197-2.92.805.807-2.923-.195-.316C4.135 14.882 3.666 13.5 3.666 12c0-4.596 3.738-8.333 8.334-8.333 4.595 0 8.333 3.737 8.333 8.333 0 4.596-3.738 8.333-8.333 8.333z"/>
                                        </svg>
                                    </span>
                                    Sıcak Satış & Sepet Kurtarma
                                </h3>
                                <button 
                                    onClick={() => setSelectedCart(null)}
                                    className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-dark rounded-xl transition cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                                Aday <span className="font-extrabold text-dark">{selectedCart.name}</span> için özelleştirilmiş kurtarma mesajı gönderin.
                            </p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Bilgilendirme Notu */}
                            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-2 text-blue-800 text-[11px] leading-relaxed">
                                <InformationCircleIcon className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
                                <span>
                                    <strong>İpucu:</strong> İndirim oranını (%) girip kupon kodunu yanındaki kutudan <strong>doğrudan değiştirebilirsiniz</strong>. Kuponsuz standart sepet kurtarma linki göndermek için ise aşağıdaki seçeneği kapatabilirsiniz.
                                </span>
                            </div>

                            {/* Toggle Coupon Option */}
                            <label className="flex items-center gap-2.5 cursor-pointer select-none pb-4 border-b border-black/5">
                                <input 
                                    type="checkbox" 
                                    checked={useCoupon} 
                                    onChange={(e) => setUseCoupon(e.target.checked)}
                                    className="w-4.5 h-4.5 text-green-650 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                />
                                <span className="text-sm font-extrabold text-dark">İndirim Kuponu Tanımla</span>
                            </label>

                            {useCoupon && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold text-dark/60 mb-1.5 uppercase tracking-wide">Oran (%)</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max="99"
                                                value={discountPercent} 
                                                onChange={(e) => handlePercentChange(Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)))}
                                                className="w-full rounded-2xl border border-black/10 p-3 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-dark/60 mb-1.5 uppercase tracking-wide">Kupon Kodu</label>
                                            <input 
                                                type="text" 
                                                value={customCouponCode} 
                                                onChange={(e) => {
                                                    setCustomCouponCode(e.target.value);
                                                    setIsCouponEdited(true);
                                                }}
                                                className="w-full rounded-2xl border border-black/10 p-3 text-sm font-mono font-bold text-dark uppercase focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white"
                                                placeholder="KUPON-KODU"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">
                                        * Bu kupon adaya özel <strong>48 saat</strong> geçerli olacak şekilde otomatik oluşturulacaktır. Dilerseniz kupon kodunu manuel değiştirebilirsiniz.
                                    </p>
                                </div>
                            )}

                            {!useCoupon && (
                                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                        Adaya indirim tanımlanmadan, sepetini tek tıkla geri yükleyebileceği <strong>standart sepet linki</strong> içeren bir mesaj hazırlanacaktır.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-black/5 bg-gray-50/50 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedCart(null)}
                                className="flex-1 rounded-2xl border border-black/10 hover:bg-gray-100 py-3 text-sm font-bold text-dark transition cursor-pointer"
                            >
                                İptal
                            </button>
                            <button
                                type="button"
                                disabled={couponGeneratingId === selectedCart.id}
                                onClick={handleConfirmRecovery}
                                className="flex-[1.5] flex items-center justify-center gap-1.5 rounded-2xl bg-green-600 hover:bg-green-700 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-60"
                            >
                                {couponGeneratingId === selectedCart.id ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Kupon Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.022-.08-.117-.162-.193-.238-.076-.076-.172-.116-.27-.116h-1.01c-.1 0-.194.04-.27.116-.076.076-.171.158-.193.238l-.348 1.258c-.024.088-.108.148-.198.148-.052 0-.102-.02-.144-.058-1.59-1.428-2.614-2.452-4.042-4.042-.038-.042-.058-.092-.058-.144 0-.09.06-.174.148-.198l1.258-.348c.08-.022.162-.117.238-.193.076-.076.116-.172.116-.27v-1.01c0-.1-.04-.194-.116-.27-.076-.076-.158-.171-.238-.193l-1.258-.348c-.088-.024-.182.012-.224.092l-.634 1.22c-.104.2-.09.444.036.632 1.488 2.218 3.284 4.014 5.502 5.502.188.126.432.14.632.036l1.22-.634c.08-.042.116-.136.092-.224l-.348-1.258zM12 2C6.477 2 2 6.477 2 12c0 1.887.525 3.65 1.442 5.162L2.043 21.92l4.908-1.353C8.423 21.493 10.15 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.15-.472-4.432-1.282l-.317-.197-2.92.805.807-2.923-.195-.316C4.135 14.882 3.666 13.5 3.666 12c0-4.596 3.738-8.333 8.334-8.333 4.595 0 8.333 3.737 8.333 8.333 0 4.596-3.738 8.333-8.333 8.333z"/>
                                        </svg>
                                        WhatsApp'tan Gönder
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
