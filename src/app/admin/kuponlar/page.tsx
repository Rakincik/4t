import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
    TicketIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createGlobalCoupon(formData: FormData) {
    "use server";
    const code = formData.get("code") as string;
    const type = formData.get("type") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const maxUsesStr = formData.get("maxUses") as string;
    const maxUses = maxUsesStr ? parseInt(maxUsesStr) : null;
    const expiresAtStr = formData.get("expiresAt") as string;
    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : null;

    const excludedCourses = formData.getAll("excludedCourses") as string[];
    const excludedVariants = formData.getAll("excludedVariants") as string[];

    if (!code || !amount) return;

    await prisma.coupon.create({
        data: {
            code: code.toUpperCase().trim(),
            type,
            amount,
            maxUses,
            expiresAt,
            isActive: true,
            courseId: null,
            excludedCourseIds: excludedCourses.length > 0 ? excludedCourses : null,
            excludedVariantIds: excludedVariants.length > 0 ? excludedVariants : null,
        }
    });
    revalidatePath("/admin/kuponlar");
    redirect("/admin/kuponlar");
}

async function toggleCoupon(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (coupon) {
        await prisma.coupon.update({ where: { id }, data: { isActive: !coupon.isActive } });
    }
    revalidatePath("/admin/kuponlar");
}

async function deleteCoupon(formData: FormData) {
    "use server";
    await prisma.coupon.delete({ where: { id: formData.get("id") as string } });
    revalidatePath("/admin/kuponlar");
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

function getStatus(coupon: { isActive: boolean; expiresAt: Date | null; maxUses: number | null; usedCount: number }) {
    if (!coupon.isActive) return { label: "Pasif", color: "bg-gray-100 text-gray-500", icon: XCircleIcon };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { label: "Süresi Dolmuş", color: "bg-red-100 text-red-600", icon: ExclamationTriangleIcon };
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { label: "Tükenmiş", color: "bg-orange-100 text-orange-600", icon: ExclamationTriangleIcon };
    return { label: "Aktif", color: "bg-green-100 text-green-700", icon: CheckCircleIcon };
}

function daysUntilExpiry(date: Date | null) {
    if (!date) return null;
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminKuponlarPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const viewUsageId = params?.viewUsage as string | undefined;
    const showNewCouponModal = params?.newCoupon === "true";

    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
        include: { 
            course: { select: { id: true, title: true, slug: true } },
            variant: { select: { id: true, title: true } }
        },
    });

    const activeCoupons = coupons.filter(c => c.isActive && (!c.expiresAt || new Date(c.expiresAt) >= new Date()));
    const expiredCoupons = coupons.filter(c => c.expiresAt && new Date(c.expiresAt) < new Date());
    const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    const expiringCoupons = coupons.filter(c => {
        const days = daysUntilExpiry(c.expiresAt);
        return c.isActive && days !== null && days > 0 && days <= 7;
    });
    const topCoupon = [...coupons].sort((a, b) => b.usedCount - a.usedCount)[0];

    // MODAL İÇİN VERİ ÇEKİMİ
    let usageModalData = null;
    if (viewUsageId) {
        usageModalData = await prisma.coupon.findUnique({
            where: { id: viewUsageId },
            include: {
                orders: {
                    include: { user: true },
                    orderBy: { createdAt: "desc" }
                }
            }
        });
    }

    const courses = await prisma.course.findMany({
        where: { isDeleted: false, isActive: true },
        select: {
            id: true,
            title: true,
            variants: {
                select: {
                    id: true,
                    title: true
                },
                orderBy: { order: "asc" }
            }
        },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }]
    });

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kupon Takip Merkezi</h1>
                    <p className="text-gray-500 text-sm">Tüm indirim kuponlarınızı tek noktadan takip edin.</p>
                </div>
                <div className="flex gap-3">
                    <a href="/admin/kuponlar/gecmis" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm text-sm">
                        <ChartBarIcon className="w-5 h-5 text-purple-600" />
                        Tüm Kullanım Geçmişi
                    </a>
                    <a href="?newCoupon=true" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1221] text-white font-bold rounded-xl hover:bg-[#0B1221]/90 transition shadow-lg text-sm">
                        <PlusIcon className="w-5 h-5" />
                        Global Kupon Ekle
                    </a>
                </div>
            </div>

            {/* ======================= ÖZET KARTLARI ======================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Aktif Kuponlar */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -translate-x-4 -translate-y-4" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aktif</span>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900">{activeCoupons.length}</p>
                        <p className="text-xs text-gray-400 mt-1">kullanılabilir kupon</p>
                    </div>
                </div>

                {/* Toplam Kullanım */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-x-4 -translate-y-4" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kullanım</span>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900">{totalUsage}</p>
                        <p className="text-xs text-gray-400 mt-1">toplam kullanım</p>
                    </div>
                </div>

                {/* En Çok Kullanılan */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full -translate-x-4 -translate-y-4" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <TicketIcon className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">En Popüler</span>
                        </div>
                        {topCoupon ? (
                            <>
                                <p className="text-xl font-extrabold text-gray-900 font-mono">{topCoupon.code}</p>
                                <p className="text-xs text-gray-400 mt-1">{topCoupon.usedCount} kullanım</p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-300">Veri yok</p>
                        )}
                    </div>
                </div>

                {/* Süresi Dolacaklar */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -translate-x-4 -translate-y-4" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <ClockIcon className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Uyarı</span>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900">{expiringCoupons.length}</p>
                        <p className="text-xs text-gray-400 mt-1">7 gün içinde dolacak</p>
                    </div>
                </div>
            </div>

            {/* ======================= KUPON TABLOSU ======================= */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ChartBarIcon className="w-5 h-5 text-gray-400" />
                        <h2 className="text-sm font-bold text-gray-700">Tüm Kuponlar</h2>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{coupons.length} kupon</span>
                    </div>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MagnifyingGlassIcon className="w-3 h-3" />
                        Kupon oluşturmak için Kurslar → Düzenle → Kuponlar bölümünü kullanın
                    </p>
                </div>
                {coupons.length === 0 ? (
                    <div className="p-16 text-center">
                        <TicketIcon className="w-16 h-16 mx-auto text-gray-100 mb-4" />
                        <h3 className="text-lg font-bold text-gray-600 mb-2">Henüz kupon oluşturulmamış</h3>
                        <p className="text-sm text-gray-400">Bir kursun düzenleme sayfasına gidip &quot;Kuponlar&quot; bölümünden yeni kupon ekleyebilirsiniz.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                                    <th className="text-left px-5 py-3 font-semibold">Kod</th>
                                    <th className="text-left px-5 py-3 font-semibold">İndirim</th>
                                    <th className="text-left px-5 py-3 font-semibold">Bağlı Ürün</th>
                                    <th className="text-left px-5 py-3 font-semibold">Kullanım</th>
                                    <th className="text-left px-5 py-3 font-semibold">Son Tarih</th>
                                    <th className="text-left px-5 py-3 font-semibold">Durum</th>
                                    <th className="text-right px-5 py-3 font-semibold">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {coupons.map((coupon) => {
                                    const status = getStatus(coupon);
                                    const StatusIcon = status.icon;
                                    const days = daysUntilExpiry(coupon.expiresAt);
                                    const usagePercent = coupon.maxUses ? Math.round((coupon.usedCount / coupon.maxUses) * 100) : null;

                                    return (
                                        <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <span className="font-mono font-extrabold text-sm bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200">
                                                    {coupon.code}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {coupon.type === "PERCENT" ? `%${coupon.amount}` : `₺${coupon.amount}`}
                                                </span>
                                                {coupon.minOrder && (
                                                    <span className="text-[10px] text-gray-400 font-medium block">min ₺{coupon.minOrder}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {coupon.course ? (
                                                    <div className="space-y-0.5">
                                                        <a href={`/admin/kurslar/${coupon.course.id}`} className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full inline-block" />
                                                            {coupon.course.title.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}
                                                        </a>
                                                        {coupon.variant && (
                                                            <span className="block text-[10px] text-purple-600 font-bold ml-2.5">
                                                                Seçenek: {coupon.variant.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-200">Global</span>
                                                        {(coupon.excludedCourseIds || coupon.excludedVariantIds) && (
                                                            <span className="block text-[9px] text-red-500 font-extrabold ml-1">
                                                                (Bazı Seçenekler Hariç)
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <a href={`?viewUsage=${coupon.id}`} className="flex items-center gap-2 hover:bg-gray-50 p-1.5 -ml-1.5 rounded transition block w-max">
                                                    <span className="text-sm font-bold text-blue-600 underline decoration-blue-200 underline-offset-2">{coupon.usedCount}</span>
                                                    <span className="text-xs text-gray-400">/ {coupon.maxUses ?? "∞"}</span>
                                                </a>
                                                {usagePercent !== null && (
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${usagePercent >= 90 ? 'bg-red-400' : usagePercent >= 50 ? 'bg-orange-400' : 'bg-green-400'}`}
                                                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {coupon.expiresAt ? (
                                                    <div>
                                                        <span className="text-xs text-gray-600">{formatDate(coupon.expiresAt)}</span>
                                                        {days !== null && days > 0 && days <= 7 && (
                                                            <span className="block text-[10px] text-red-500 font-bold mt-0.5">⚠ {days} gün kaldı</span>
                                                        )}
                                                        {days !== null && days <= 0 && (
                                                            <span className="block text-[10px] text-red-400 font-medium mt-0.5">Süresi doldu</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-300">Süresiz</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${status.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <form action={toggleCoupon} className="inline">
                                                        <input type="hidden" name="id" value={coupon.id} />
                                                        <button type="submit" className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${coupon.isActive ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                                                            {coupon.isActive ? "Pasif Yap" : "Aktif Yap"}
                                                        </button>
                                                    </form>
                                                    <form action={deleteCoupon}>
                                                        <input type="hidden" name="id" value={coupon.id} />
                                                        <button type="submit" className="px-2 py-1 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-[10px] font-bold">
                                                            Sil
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ======================= YAKINDA DOLACAKLAR ======================= */}
            {expiringCoupons.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-red-700 flex items-center gap-2 mb-3">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        Süresi Dolmak Üzere Olan Kuponlar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {expiringCoupons.map(c => {
                            const days = daysUntilExpiry(c.expiresAt)!;
                            return (
                                <div key={c.id} className="bg-white rounded-lg p-3 border border-red-100 flex items-center justify-between">
                                    <div>
                                        <span className="font-mono font-bold text-sm text-red-700">{c.code}</span>
                                        <span className="text-xs text-gray-400 ml-2">{c.type === "PERCENT" ? `%${c.amount}` : `₺${c.amount}`}</span>
                                    </div>
                                    <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">{days} gün</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ======================= USAGE MODAL ======================= */}
            {usageModalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <TicketIcon className="w-5 h-5 text-[#DC2626]" />
                                    {usageModalData.code} Kupon Kullanımları
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Toplam {usageModalData.orders.length} kişi bu kuponu kullanarak satın alım gerçekleştirdi.</p>
                            </div>
                            <a href="/admin/kuponlar" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                                <XCircleIcon className="w-6 h-6" />
                            </a>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0">
                            {usageModalData.orders.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    Bu kupon henüz kimse tarafından kullanılmamış.
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-widest sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 border-b border-gray-100">Kullanıcı</th>
                                            <th className="px-6 py-3 border-b border-gray-100">Tarih</th>
                                            <th className="px-6 py-3 border-b border-gray-100 text-right">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {usageModalData.orders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-gray-900">{order.customerName || order.user?.name}</p>
                                                    <p className="text-xs text-gray-500">{order.customerEmail || order.user?.email}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p>
                                                    <p className="text-[10px] text-gray-400">{order.createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {order.status === 'PAID' ? 'Ödendi' : 'Beklemede'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ======================= YENİ GLOBAL KUPON MODAL ======================= */}
            {showNewCouponModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <TicketIcon className="w-5 h-5 text-blue-600" />
                                    Yeni Global Kupon Ekle
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Bu kupon tüm ürünlerde geçerli olacaktır.</p>
                            </div>
                            <a href="/admin/kuponlar" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                                <XCircleIcon className="w-6 h-6" />
                            </a>
                        </div>
                        <div className="p-6">
                            <form action={createGlobalCoupon} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kupon Kodu *</label>
                                    <input type="text" name="code" required className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-mono" placeholder="YAZ2025" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">İndirim Tipi</label>
                                        <select name="type" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white">
                                            <option value="PERCENT">Yüzde (%)</option>
                                            <option value="FIXED">Sabit Tutar (₺)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">İndirim Miktarı *</label>
                                        <input type="number" name="amount" required min="1" step="0.01" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="25" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Maks. Kullanım</label>
                                        <input type="number" name="maxUses" min="1" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Boş = Sınırsız" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Son Kullanım</label>
                                        <input type="datetime-local" name="expiresAt" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Geçersiz Olacağı Ürünler / Seçenekler (Hariç Tutulanlar)</label>
                                    <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto p-3 space-y-2 text-sm bg-gray-50/50">
                                        {courses.map(course => (
                                            <div key={course.id} className="space-y-1">
                                                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                                                    <input type="checkbox" name="excludedCourses" value={course.id} className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 w-4 h-4" />
                                                    <span dangerouslySetInnerHTML={{ __html: course.title }} />
                                                </label>
                                                {course.variants.length > 0 && (
                                                    <div className="pl-6 space-y-1 border-l-2 border-gray-200 ml-2">
                                                        {course.variants.map(v => (
                                                            <label key={v.id} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-500">
                                                                <input type="checkbox" name="excludedVariants" value={v.id} className="rounded text-purple-600 focus:ring-purple-500 border-gray-300 w-3.5 h-3.5" />
                                                                {v.title}
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">İpucu: Global kuponun uygulanmasını istemediğiniz kursları veya abonelik sürelerini seçin.</p>
                                </div>
                                <div className="pt-2 flex justify-end gap-3 mt-6">
                                    <a href="/admin/kuponlar" className="px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition text-sm">İptal</a>
                                    <button type="submit" className="px-6 py-2 bg-[#0B1221] text-white font-bold rounded-xl hover:bg-[#0B1221]/90 transition shadow-lg text-sm">
                                        Kuponu Oluştur
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
