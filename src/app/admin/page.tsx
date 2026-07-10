import prisma from "@/lib/prisma";
import Link from "next/link";
import {
    UsersIcon,
    AcademicCapIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    PlusIcon,
    KeyIcon,
    CheckBadgeIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    EyeIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

/* ===================================================== */
/* DATA FETCHING                                         */
/* ===================================================== */
async function getStats() {
    const [userCount, courseCount, orderCount, paidOrdersSum, todayOrders, todayUsers] = await Promise.all([
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.course.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.order.aggregate({
            where: { status: "PAID" },
            _sum: { totalAmount: true },
        }),
        prisma.order.count({
            where: {
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            },
        }),
        prisma.user.count({
            where: {
                role: "STUDENT",
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            },
        }),
    ]);

    return {
        userCount,
        courseCount,
        orderCount,
        totalRevenue: paidOrdersSum._sum.totalAmount || 0,
        todayOrders,
        todayUsers,
    };
}

async function getRecentOrders() {
    return prisma.order.findMany({
        take: 7,
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true, email: true } },
            items: { include: { course: { select: { title: true } } } },
        },
    });
}

async function getRecentUsers() {
    return prisma.user.findMany({
        take: 7,
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true },
    });
}

async function getPopularCourses() {
    const courses = await prisma.course.findMany({
        where: { isActive: true },
        take: 5,
        include: {
            _count: { select: { orderItems: true, courseAccess: true } },
        },
        orderBy: { orderItems: { _count: "desc" } },
    });
    return courses;
}

/* ===================================================== */
/* HELPERS                                               */
/* ===================================================== */
function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    }).format(n);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

function formatShortDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
    }).format(new Date(date));
}

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

const statusMap: Record<string, { label: string; class: string }> = {
    PAID: { label: "Ödendi", class: "bg-green-100 text-green-700" },
    PENDING: { label: "Bekliyor", class: "bg-amber-100 text-amber-700" },
    FAILED: { label: "Başarısız", class: "bg-red-100 text-red-700" },
    REFUNDED: { label: "İade", class: "bg-gray-100 text-gray-600" },
    CANCELLED: { label: "İptal Edildi", class: "bg-red-50 text-red-500" },
};

/* ===================================================== */
/* PAGE                                                  */
/* ===================================================== */
export default async function AdminDashboard() {
    try {
        const stats = await getStats();
        const recentOrders = await getRecentOrders();
        const recentUsers = await getRecentUsers();
        const popularCourses = await getPopularCourses();

        const statCards = [
            {
                label: "Toplam Öğrenci",
                value: stats.userCount.toLocaleString("tr-TR"),
                icon: UsersIcon,
                color: "bg-blue-500",
                bgLight: "bg-blue-50",
                textColor: "text-blue-600",
                change: `Bugün +${stats.todayUsers}`,
            },
            {
                label: "Aktif Kurs",
                value: stats.courseCount,
                icon: AcademicCapIcon,
                color: "bg-green-500",
                bgLight: "bg-green-50",
                textColor: "text-green-600",
                change: null,
            },
            {
                label: "Toplam Sipariş",
                value: stats.orderCount.toLocaleString("tr-TR"),
                icon: ShoppingCartIcon,
                color: "bg-purple-500",
                bgLight: "bg-purple-50",
                textColor: "text-purple-600",
                change: `Bugün +${stats.todayOrders}`,
            },
            {
                label: "Toplam Gelir",
                value: formatTRY(stats.totalRevenue),
                icon: CurrencyDollarIcon,
                color: "bg-amber-500",
                bgLight: "bg-amber-50",
                textColor: "text-amber-600",
                change: null,
            },
        ];

        return (
            <div className="space-y-6">
                {/* ============ HEADER ============ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 text-sm">4T Akademi yönetim paneline hoş geldiniz.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/kurslar/ekle"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Yeni Kurs
                        </Link>
                        <Link
                            href="/admin/erisimler"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <KeyIcon className="w-4 h-4" />
                            Erişim Ver
                        </Link>
                    </div>
                </div>

                {/* ============ STAT CARDS ============ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        {stat.change && (
                                            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                                                <ArrowTrendingUpIcon className="w-3 h-3" />
                                                {stat.change}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`${stat.bgLight} w-12 h-12 rounded-xl flex items-center justify-center`}>
                                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ============ QUICK ACTIONS ============ */}
                <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl border border-primary/10 p-5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <CheckBadgeIcon className="w-4 h-4 text-primary" />
                        Hızlı Erişim
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Kurs Ekle", href: "/admin/kurslar/ekle", icon: "📚" },
                            { label: "Siparişler", href: "/admin/siparisler", icon: "🛒" },
                            { label: "Erişim Ver", href: "/admin/erisimler", icon: "🔑" },
                            { label: "Site Ayarları", href: "/admin/site", icon: "⚙️" },
                        ].map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                <span className="text-lg">{action.icon}</span>
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ============ MAIN GRID ============ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ---- SON SİPARİŞLER (2/3) ---- */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <ShoppingCartIcon className="w-5 h-5 text-gray-400" />
                                Son Siparişler
                            </h2>
                            <Link href="/admin/siparisler" className="text-xs text-primary hover:underline flex items-center gap-1">
                                Tümünü Gör <ArrowRightIcon className="w-3 h-3" />
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <ShoppingCartIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Henüz sipariş yok.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-xs text-gray-500 uppercase tracking-wider">
                                            <th className="text-left px-5 py-3 font-medium">Müşteri</th>
                                            <th className="text-left px-5 py-3 font-medium">Ürünler</th>
                                            <th className="text-left px-5 py-3 font-medium">Tutar</th>
                                            <th className="text-left px-5 py-3 font-medium">Durum</th>
                                            <th className="text-left px-5 py-3 font-medium">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentOrders.map((order) => {
                                            const s = statusMap[order.status] || statusMap.PENDING;
                                            return (
                                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                                                                {order.user?.name?.charAt(0) || "?"}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 text-sm">{order.user?.name || "Bilinmiyor"}</p>
                                                                <p className="text-xs text-gray-400">{order.user?.email || ""}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <p className="text-sm text-gray-600 max-w-[200px] truncate" title={order.items?.map((i) => i.course?.title?.replace(/<[^>]+>/g, '')?.replace(/&nbsp;/g, ' ')).filter(Boolean).join(", ")}>
                                                            {order.items?.map((i) => i.course?.title?.replace(/<[^>]+>/g, '')?.replace(/&nbsp;/g, ' ')).filter(Boolean).join(", ")}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <p className="font-semibold text-gray-900 text-sm">{formatTRY(order.totalAmount)}</p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.class}`}>
                                                            {s.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                                                        {formatShortDate(order.createdAt)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ---- SAĞ SIDEBAR (1/3) ---- */}
                    <div className="space-y-6">
                        {/* Son Kayıtlar */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <UsersIcon className="w-5 h-5 text-gray-400" />
                                    Son Kayıtlar
                                </h2>
                                <Link href="/admin/ogrenciler" className="text-xs text-primary hover:underline flex items-center gap-1">
                                    Tümü <ArrowRightIcon className="w-3 h-3" />
                                </Link>
                            </div>

                            {recentUsers.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">Henüz kayıt yok.</div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {recentUsers.map((user) => (
                                        <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                                {user.name?.charAt(0) || "?"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatShortDate(user.createdAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Popüler Kurslar */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />
                                    Popüler Kurslar
                                </h2>
                            </div>

                            {popularCourses.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">Kurs bulunamadı.</div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {popularCourses.map((course, i) => (
                                        <div key={course.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                                            <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">{stripHtml(course.title)}</p>
                                                <p className="text-xs text-gray-400">
                                                    {course._count?.orderItems || 0} sipariş • {course._count?.courseAccess || 0} erişim
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                {formatTRY(course.price)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error: any) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-xl">
                <h2 className="text-xl font-bold text-red-700 mb-4">Dashboard Yüklenirken Bir Hata Oluştu!</h2>
                <pre className="bg-white p-4 rounded border border-red-100 text-sm text-red-600 overflow-auto whitespace-pre-wrap">
                    {error.message || String(error)}
                    {"\n\nStack:\n"}
                    {error.stack}
                </pre>
            </div>
        );
    }
}
