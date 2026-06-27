import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

function getDateRangeBounds(range: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
        case "today": {
            const start = new Date(todayStart);
            return {
                start,
                label: "Bugün",
                interval: "hourly" as const
            };
        }
        case "week": {
            const start = new Date(todayStart);
            start.setDate(start.getDate() - 7);
            return {
                start,
                label: "Bu Hafta",
                interval: "daily" as const
            };
        }
        case "month": {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            return {
                start,
                label: "Bu Ay",
                interval: "daily" as const
            };
        }
        case "30d": {
            const start = new Date(todayStart);
            start.setDate(start.getDate() - 30);
            return {
                start,
                label: "Son 30 Gün",
                interval: "daily" as const
            };
        }
        case "3m": {
            const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
            return {
                start,
                label: "Son 3 Ay",
                interval: "monthly" as const
            };
        }
        case "1y": {
            const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
            return {
                start,
                label: "Son 1 Yıl",
                interval: "monthly" as const
            };
        }
        case "all": {
            return {
                start: new Date(2025, 0, 1), // fallback oldest
                label: "Bugüne Kadar",
                interval: "monthly" as const
            };
        }
        case "6m":
        default: {
            const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
            return {
                start,
                label: "Son 6 Ay",
                interval: "monthly" as const
            };
        }
    }
}

function generateTrendData(
    interval: "hourly" | "daily" | "monthly",
    start: Date,
    allOrders: any[],
    allUsers: any[]
) {
    const data: { month: string; revenue: number; users: number }[] = [];
    const now = new Date();

    if (interval === "hourly") {
        for (let h = 0; h <= 23; h++) {
            const label = `${String(h).padStart(2, "0")}:00`;
            const hourStart = new Date(start);
            hourStart.setHours(h, 0, 0, 0);
            const hourEnd = new Date(hourStart);
            hourEnd.setHours(h + 1, 0, 0, 0);

            const revenue = allOrders
                .filter(o => o.createdAt >= hourStart && o.createdAt < hourEnd)
                .reduce((sum, o) => sum + o.totalAmount, 0);

            const users = allUsers.filter(
                u => u.createdAt >= hourStart && u.createdAt < hourEnd
            ).length;

            data.push({ month: label, revenue, users });
        }
    } else if (interval === "daily") {
        const currentDate = new Date(start);
        currentDate.setHours(0, 0, 0, 0);
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        while (currentDate <= todayStart) {
            const label = currentDate.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
            const dayStart = new Date(currentDate);
            const dayEnd = new Date(currentDate);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const revenue = allOrders
                .filter(o => o.createdAt >= dayStart && o.createdAt < dayEnd)
                .reduce((sum, o) => sum + o.totalAmount, 0);

            const users = allUsers.filter(
                u => u.createdAt >= dayStart && u.createdAt < dayEnd
            ).length;

            data.push({ month: label, revenue, users });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    } else {
        const currentDate = new Date(start.getFullYear(), start.getMonth(), 1);
        const endMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        while (currentDate <= endMonth) {
            const label = currentDate.toLocaleDateString("tr-TR", { month: "short" });
            const monthKey = currentDate.toISOString().slice(0, 7);

            const revenue = allOrders
                .filter(o => o.createdAt.toISOString().slice(0, 7) === monthKey)
                .reduce((sum, o) => sum + o.totalAmount, 0);

            const users = allUsers.filter(
                u => u.createdAt.toISOString().slice(0, 7) === monthKey
            ).length;

            data.push({ month: label, revenue, users });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }

    return data;
}

async function getDashboardData(range: string) {
    const now = new Date();
    let bounds = getDateRangeBounds(range);
    
    // Fetch all successful orders and student users to process range filters
    const [allOrders, allUsers, totalCoursesCount, activeCourseAccesses, couponOrders] = await Promise.all([
        prisma.order.findMany({
            where: { status: "PAID" },
            include: {
                items: {
                    include: {
                        course: {
                            select: { type: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: "asc" }
        }),
        prisma.user.findMany({
            where: { role: "STUDENT" },
            select: { createdAt: true },
            orderBy: { createdAt: "asc" }
        }),
        prisma.course.count({ where: { isActive: true } }),
        prisma.courseAccess.findMany({
            include: { course: { select: { title: true, category: true } } }
        }),
        prisma.order.findMany({
            where: { 
                status: "PAID",
                couponId: { not: null },
                createdAt: { gte: bounds.start }
            },
            include: {
                coupon: { select: { code: true } }
            }
        })
    ]);

    // Handle oldest dynamic range logic for 'all'
    let start = bounds.start;
    if (range === "all") {
        const oldestOrder = allOrders.length > 0 ? allOrders[0].createdAt : now;
        const oldestUser = allUsers.length > 0 ? allUsers[0].createdAt : now;
        const oldestDate = oldestOrder < oldestUser ? oldestOrder : oldestUser;
        start = new Date(oldestDate.getFullYear(), oldestDate.getMonth(), 1);
    }

    // Dynamic Period Calculation bounds (Comparison ranges)
    const diffMs = now.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - diffMs);
    const prevEnd = start;

    const currentPeriodOrders = allOrders.filter(o => o.createdAt >= start);
    const prevPeriodOrders = allOrders.filter(o => o.createdAt >= prevStart && o.createdAt < prevEnd);

    const currentRevenue = currentPeriodOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const prevRevenue = prevPeriodOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const currentStudents = allUsers.filter(u => u.createdAt >= start).length;
    const prevStudents = allUsers.filter(u => u.createdAt >= prevStart && u.createdAt < prevEnd).length;
    const totalStudents = allUsers.length;

    // 1. Repeat Purchase Rate (Tekrarlı Alışveriş Yapan Öğrenci Oranı)
    // We analyze the entire customer base (allOrders) to determine loyalty metrics
    const userOrderCounts: Record<string, number> = {};
    allOrders.forEach(o => {
        userOrderCounts[o.userId] = (userOrderCounts[o.userId] || 0) + 1;
    });
    const totalBuyers = Object.keys(userOrderCounts).length;
    const repeatBuyers = Object.values(userOrderCounts).filter(count => count >= 2).length;
    const repeatPurchaseRate = totalBuyers > 0 ? Math.round((repeatBuyers / totalBuyers) * 100) : 0;

    const kpis = {
        currentMonthRevenue: currentRevenue,
        lastMonthRevenue: prevRevenue,
        currentMonthOrders: currentPeriodOrders.length,
        lastMonthOrders: prevPeriodOrders.length,
        totalStudents,
        currentMonthStudents: currentStudents,
        lastMonthStudents: prevStudents,
        totalCourses: totalCoursesCount,
        couponCount: couponOrders.length,
        couponDiscountTotal: couponOrders.reduce((sum, o) => sum + (o.totalAmount * 0.1), 0), // estimation
        repeatPurchaseRate,
        repeatBuyersCount: repeatBuyers
    };

    // Calculate Payment Method Breakdown in current period
    let cardRevenue = 0;
    let cardCount = 0;
    let transferRevenue = 0;
    let transferCount = 0;

    currentPeriodOrders.forEach(o => {
        const isTransfer = o.notes?.toLowerCase().includes("eft") || o.notes?.toLowerCase().includes("havale");
        if (isTransfer) {
            transferRevenue += o.totalAmount;
            transferCount++;
        } else {
            cardRevenue += o.totalAmount;
            cardCount++;
        }
    });

    const paymentMethodDistribution = [
        { name: "Kredi Kartı (POS)", value: cardCount, revenue: cardRevenue },
        { name: "EFT / Havale", value: transferCount, revenue: transferRevenue }
    ];

    // 3. Course Type Distribution Breakdown (Kurs vs Kamp vs Flix) in current period
    let kursRevenue = 0;
    let kampRevenue = 0;
    let flixRevenue = 0;

    currentPeriodOrders.forEach(o => {
        o.items.forEach(item => {
            const type = item.course?.type;
            const itemRevenue = item.price * item.quantity;
            if (type === "KAMP") {
                kampRevenue += itemRevenue;
            } else if (type === "FLIX") {
                flixRevenue += itemRevenue;
            } else {
                kursRevenue += itemRevenue;
            }
        });
    });

    const courseTypeDistribution = [
        { name: "Kurs", value: kursRevenue },
        { name: "Kamp", value: kampRevenue },
        { name: "Flix", value: flixRevenue }
    ];

    // Generate Trend Data
    const monthlyData = generateTrendData(bounds.interval, start, allOrders, allUsers);

    // Top Courses
    const topCourseStats = await prisma.course.findMany({
        where: { isActive: true },
        include: { _count: { select: { courseAccess: true, orderItems: true } } },
        orderBy: { courseAccess: { _count: "desc" } },
        take: 5,
    });
    const topCourses = topCourseStats.map(c => ({
        id: c.id,
        title: c.title,
        category: c.category || "Genel",
        studentCount: c._count.courseAccess,
        orderCount: c._count.orderItems
    }));

    // Category Distribution logic via course accesses
    const categoryMap: Record<string, number> = {};
    activeCourseAccesses.forEach(access => {
        const cat = access.course.category || "Genel";
        if (!categoryMap[cat]) categoryMap[cat] = 0;
        categoryMap[cat]++;
    });
    
    const categoryDistribution = Object.keys(categoryMap).map(c => ({
        name: c,
        value: categoryMap[c]
    }));

    return {
        kpis,
        monthlyData,
        topCourses,
        categoryDistribution,
        paymentMethodDistribution,
        courseTypeDistribution,
        rangeLabel: bounds.label
    };
}

interface PageProps {
    searchParams: Promise<{
        range?: string;
    }>;
}

export default async function IstatistiklerPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const data = await getDashboardData(params.range || "6m");
    return <DashboardClient initialData={data} activeRange={params.range || "6m"} />;
}
