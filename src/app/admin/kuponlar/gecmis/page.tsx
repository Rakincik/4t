import prisma from "@/lib/prisma";
import {
    TicketIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export default async function KuponGecmisPage(props: { searchParams: Promise<{ q?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";

    const orders = await prisma.order.findMany({
        where: {
            couponId: { not: null },
            status: "PAID",
            ...(q ? { coupon: { code: { contains: q, mode: "insensitive" } } } : {})
        },
        include: {
            coupon: true,
            user: true,
            items: {
                include: { course: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <a href="/admin/kuponlar" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 transition shadow-sm">
                    <ArrowLeftIcon className="w-5 h-5" />
                </a>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kupon Kullanım Geçmişi</h1>
                    <p className="text-gray-500 text-sm">Hangi influencer / indirim kodu ne zaman kullanılmış detaylıca inceleyin.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <TicketIcon className="w-5 h-5 text-purple-600" />
                        <h2 className="text-sm font-bold text-gray-700">Tüm Kullanımlar</h2>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{orders.length} sipariş</span>
                    </div>
                    <form method="get" className="relative w-full sm:w-72">
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            name="q" 
                            defaultValue={q} 
                            placeholder="Kupon Koduna Göre Ara (Örn: AHMET10)" 
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all uppercase"
                        />
                    </form>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4 border-b border-gray-100">Kupon Kodu</th>
                                <th className="px-6 py-4 border-b border-gray-100">Kullanım Zamanı</th>
                                <th className="px-6 py-4 border-b border-gray-100">Müşteri</th>
                                <th className="px-6 py-4 border-b border-gray-100">Sipariş No & Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center">
                                        <p className="text-gray-500 font-medium">Kayıt bulunamadı.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-extrabold text-sm bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200">
                                                {order.coupon?.code || "SİLİNMİŞ KUPON"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">{formatDate(order.createdAt)}</p>
                                            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                Saat: {order.createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">{order.customerName || order.user?.name}</p>
                                            <p className="text-xs text-gray-500">{order.customerEmail || order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-mono text-gray-600">#{order.orderNumber.slice(-8).toUpperCase()}</p>
                                            <p className="text-sm font-extrabold text-green-600 mt-0.5">
                                                ₺{order.totalAmount.toLocaleString("tr-TR")}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
