import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
    ShoppingBagIcon, 
    CalendarIcon, 
    CreditCardIcon, 
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowPathIcon
} from "@heroicons/react/24/solid";
import Link from "next/link";
import ReceiptUploader from "./ReceiptUploader";

function formatTL(n: number) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(date));
}

function getStatusBadge(status: string, notes: string | null) {
    const isEft = notes?.toLowerCase().includes("eft") || notes?.toLowerCase().includes("havale");

    switch (status) {
        case "PAID":
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 animate-fade-in">
                    <CheckCircleIcon className="w-4 h-4" />
                    Ödendi
                </span>
            );
        case "PENDING":
            if (isEft) {
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <ClockIcon className="w-4 h-4" />
                        Havale Onayı Bekliyor
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    <ClockIcon className="w-4 h-4" />
                    Ödeme Bekliyor
                </span>
            );
        case "FAILED":
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                    <XCircleIcon className="w-4 h-4" />
                    Başarısız
                </span>
            );
        case "REFUNDED":
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                    <ArrowPathIcon className="w-4 h-4" />
                    İade Edildi
                </span>
            );
        case "CANCELLED":
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                    <XCircleIcon className="w-4 h-4" />
                    İptal Edildi
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600 border border-gray-100">
                    {status}
                </span>
            );
    }
}

export default async function SiparislerimPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/giris");
    }

    const userId = (session.user as any).id;

    // Fetch user orders with their items
    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    course: true
                }
            }
        }
    });

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-[#0B1221] to-[#1e293b] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-2">Sipariş Geçmişim</h1>
                    <p className="text-gray-300">
                        Satın aldığınız eğitimleri, ödeme yöntemlerini ve fatura takibini buradan yapabilirsiniz.
                    </p>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <ShoppingBagIcon className="w-6 h-6 text-[#DC2626]" />
                    Siparişleriniz
                </h2>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                            <ShoppingBagIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Henüz Siparişiniz Yok</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                            4T Akademi bünyesindeki canlı veya offline hazırlık programlarını inceleyerek ilk siparişinizi oluşturabilirsiniz.
                        </p>
                        <Link
                            href="/uzaktan-egitim"
                            className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-bold text-white bg-[#DC2626] hover:bg-[#b91c1c] transition-all duration-200"
                        >
                            Eğitimlere Göz At
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <th className="pb-4 font-semibold">Sipariş No / Tarih</th>
                                        <th className="pb-4 font-semibold">Satın Alınan Kurslar</th>
                                        <th className="pb-4 font-semibold">Ödeme Türü</th>
                                        <th className="pb-4 font-semibold text-right">Toplam Tutar</th>
                                        <th className="pb-4 font-semibold text-center">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                    {orders.map((order) => {
                                        const isEft = order.notes?.toLowerCase().includes("eft") || order.notes?.toLowerCase().includes("havale");
                                        return (
                                            <tr key={order.id} className="hover:bg-gray-50/55 transition-colors">
                                                <td className="py-4 pr-3">
                                                    <div className="font-mono font-bold text-gray-900">{order.id}</div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-medium">
                                                        <CalendarIcon className="w-3.5 h-3.5" />
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-3 max-w-xs">
                                                    <div className="font-semibold text-gray-800 space-y-1">
                                                        {order.items.map((item) => (
                                                            <div 
                                                                key={item.id} 
                                                                className="truncate" 
                                                                title={item.course.title.replace(/<[^>]*>/g, '')}
                                                                dangerouslySetInnerHTML={{ __html: item.course.title }}
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-3 text-gray-500 font-medium">
                                                    <div className="flex items-center gap-1.5">
                                                        <CreditCardIcon className="w-4 h-4 text-gray-400" />
                                                        {isEft ? "Havale / EFT" : "Kredi Kartı"}
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-3 text-right font-extrabold text-gray-900">
                                                    {formatTL(order.totalAmount)}
                                                </td>
                                                <td className="py-4 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        {getStatusBadge(order.status, order.notes)}
                                                        {order.status === "PENDING" && isEft && (
                                                            <ReceiptUploader orderId={order.id} initialReceiptUrl={order.receiptUrl} />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {orders.map((order) => {
                                const isEft = order.notes?.toLowerCase().includes("eft") || order.notes?.toLowerCase().includes("havale");
                                return (
                                    <div key={order.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Sipariş No</div>
                                                <div className="font-mono font-bold text-gray-900 text-sm mt-0.5">{order.id}</div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                {getStatusBadge(order.status, order.notes)}
                                                {order.status === "PENDING" && isEft && (
                                                    <ReceiptUploader orderId={order.id} initialReceiptUrl={order.receiptUrl} />
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200/50 pt-2">
                                            <div className="text-xs text-gray-400 font-semibold mb-1">Kurslar</div>
                                            <div className="text-sm font-semibold text-gray-800 space-y-1">
                                                {order.items.map((item) => (
                                                    <div 
                                                        key={item.id} 
                                                        dangerouslySetInnerHTML={{ __html: item.course.title }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 border-t border-gray-200/50 pt-2 text-xs">
                                            <div>
                                                <span className="text-gray-400 font-semibold">Tarih:</span>
                                                <span className="text-gray-700 font-bold block mt-0.5">{formatDate(order.createdAt)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 font-semibold">Ödeme Türü:</span>
                                                <span className="text-gray-700 font-bold block mt-0.5">{isEft ? "Havale / EFT" : "Kredi Kartı"}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center border-t border-gray-200/50 pt-3">
                                            <span className="text-sm font-bold text-gray-500">Toplam Tutar</span>
                                            <span className="text-lg font-extrabold text-gray-900">{formatTL(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
