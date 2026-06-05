import prisma from "@/lib/prisma";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

async function getMonthlyStats() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const orders = await prisma.order.findMany({
        where: {
            status: "PAID",
            createdAt: { gte: sixMonthsAgo },
        },
        select: { createdAt: true, totalAmount: true },
    });

    const users = await prisma.user.findMany({
        where: {
            role: "STUDENT",
            createdAt: { gte: sixMonthsAgo },
        },
        select: { createdAt: true },
    });

    // Group by month
    const months: string[] = [];
    const revenueByMonth: number[] = [];
    const usersByMonth: number[] = [];

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
        const monthName = date.toLocaleDateString("tr-TR", { month: "short" });

        months.push(monthName);

        const monthRevenue = orders
            .filter((o) => o.createdAt.toISOString().slice(0, 7) === monthKey)
            .reduce((sum, o) => sum + o.totalAmount, 0);
        revenueByMonth.push(monthRevenue);

        const monthUsers = users.filter(
            (u) => u.createdAt.toISOString().slice(0, 7) === monthKey
        ).length;
        usersByMonth.push(monthUsers);
    }

    return { months, revenueByMonth, usersByMonth };
}

async function getTopCourses() {
    const courses = await prisma.course.findMany({
        where: { isActive: true },
        include: {
            _count: { select: { courseAccess: true, orderItems: true } },
        },
        orderBy: { courseAccess: { _count: "desc" } },
        take: 5,
    });

    return courses;
}

function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    }).format(n);
}

export default async function IstatistiklerPage() {
    const { months, revenueByMonth, usersByMonth } = await getMonthlyStats();
    const topCourses = await getTopCourses();
    const maxRevenue = Math.max(...revenueByMonth, 1);
    const maxUsers = Math.max(...usersByMonth, 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">İstatistikler</h1>
                <p className="text-gray-500">Son 6 aylık performans verileri.</p>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <ChartBarIcon className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-gray-900">Aylık Gelir</h2>
                </div>

                <div className="flex items-end justify-between gap-2 h-48">
                    {months.map((month, i) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: "160px" }}>
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/70 rounded-t-lg transition-all duration-500"
                                    style={{
                                        height: `${(revenueByMonth[i] / maxRevenue) * 100}%`,
                                        minHeight: revenueByMonth[i] > 0 ? "8px" : "0",
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">{month}</span>
                            <span className="text-xs font-semibold text-gray-700">
                                {formatTRY(revenueByMonth[i])}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Users Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <ChartBarIcon className="h-5 w-5 text-green-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Yeni Öğrenciler</h2>
                </div>

                <div className="flex items-end justify-between gap-2 h-32">
                    {months.map((month, i) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: "80px" }}>
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500"
                                    style={{
                                        height: `${(usersByMonth[i] / maxUsers) * 100}%`,
                                        minHeight: usersByMonth[i] > 0 ? "8px" : "0",
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">{month}</span>
                            <span className="text-xs font-semibold text-gray-700">{usersByMonth[i]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">En Popüler Kurslar</h2>

                {topCourses.length === 0 ? (
                    <p className="text-gray-500">Henüz kurs verisi yok.</p>
                ) : (
                    <div className="space-y-3">
                        {topCourses.map((course, index) => (
                            <div
                                key={course.id}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{course.title}</p>
                                    <p className="text-sm text-gray-500">{course.category || "Genel"}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {course._count.courseAccess} öğrenci
                                    </p>
                                    <p className="text-sm text-gray-500">{course._count.orderItems} satış</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
