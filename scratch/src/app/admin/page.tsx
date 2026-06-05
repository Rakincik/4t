import prisma from "@/lib/prisma";
import {
    UsersIcon,
    AcademicCapIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

async function getStats() {
    const [userCount, courseCount, orderCount, paidOrdersSum] = await Promise.all([
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.course.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.order.aggregate({
            where: { status: "PAID" },
            _sum: { totalAmount: true },
        }),
    ]);

    return {
        userCount,
        courseCount,
        orderCount,
        totalRevenue: paidOrdersSum._sum.totalAmount || 0,
    };
}

async function getRecentOrders() {
    return prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true, email: true } },
            items: { include: { course: { select: { title: true } } } },
        },
    });
}

async function getRecentUsers() {
    return prisma.user.findMany({
        take: 5,
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true },
    });
}

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
    }).format(new Date(date));
}

export default async function AdminDashboard() {
    const stats = await getStats();
    const recentOrders = await getRecentOrders();
    const recentUsers = await getRecentUsers();

    const statCards = [
        {
            label: "Toplam Öğrenci",
            value: stats.userCount,
            icon: UsersIcon,
            color: "bg-blue-500",
        },
        {
            label: "Aktif Kurs",
            value: stats.courseCount,
            icon: AcademicCapIcon,
            color: "bg-green-500",
        },
        {
            label: "Toplam Sipariş",
            value: stats.orderCount,
            icon: ShoppingCartIcon,
            color: "bg-purple-500",
        },
        {
            label: "Toplam Gelir",
            value: formatTRY(stats.totalRevenue),
            icon: CurrencyDollarIcon,
            color: "bg-amber-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">4T Akademi yönetim paneline hoş geldiniz.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl border border-gray-200 p-5"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                                >
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent data grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent orders */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Son Siparişler
                    </h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-sm">Henüz sipariş yok.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {order.items.map((i) => i.course.title).join(", ")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatTRY(order.totalAmount)}
                                        </p>
                                        <p
                                            className={`text-xs font-medium ${order.status === "PAID"
                                                    ? "text-green-600"
                                                    : order.status === "PENDING"
                                                        ? "text-amber-600"
                                                        : "text-red-600"
                                                }`}
                                        >
                                            {order.status === "PAID"
                                                ? "Ödendi"
                                                : order.status === "PENDING"
                                                    ? "Bekliyor"
                                                    : "İptal"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent students */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Son Kayıtlar
                    </h2>
                    {recentUsers.length === 0 ? (
                        <p className="text-gray-500 text-sm">Henüz kayıtlı öğrenci yok.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-primary font-semibold text-sm">
                                                {user.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
