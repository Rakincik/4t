import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

async function getDashboardData() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    // Limits for KPI month-over-month comparisons (this month vs last month)
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [allOrders, allUsers, totalCoursesCount, activeCourseAccesses] = await Promise.all([
        prisma.order.findMany({
            where: { status: "PAID" },
            select: { createdAt: true, totalAmount: true }
        }),
        prisma.user.findMany({
            where: { role: "STUDENT" },
            select: { createdAt: true }
        }),
        prisma.course.count({ where: { isActive: true } }),
        prisma.courseAccess.findMany({
            include: { course: { select: { title: true, category: true } } }
        })
    ]);

    // KPI Calculations
    const currentMonthOrders = allOrders.filter(o => o.createdAt >= currentMonthStart);
    const lastMonthOrders = allOrders.filter(o => o.createdAt >= lastMonthStart && o.createdAt < currentMonthStart);
    
    const currentMonthRevenue = currentMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const currentMonthStudents = allUsers.filter(u => u.createdAt >= currentMonthStart).length;
    const lastMonthStudents = allUsers.filter(u => u.createdAt >= lastMonthStart && u.createdAt < currentMonthStart).length;
    const totalStudents = allUsers.length;

    const kpis = {
        currentMonthRevenue,
        lastMonthRevenue,
        currentMonthOrders: currentMonthOrders.length,
        lastMonthOrders: lastMonthOrders.length,
        totalStudents,
        currentMonthStudents,
        lastMonthStudents,
        totalCourses: totalCoursesCount
    };

    // Monthly Data for charts (Last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
        const monthName = date.toLocaleDateString("tr-TR", { month: "short" });

        const monthRevenue = allOrders
            .filter((o) => o.createdAt.toISOString().slice(0, 7) === monthKey)
            .reduce((sum, o) => sum + o.totalAmount, 0);

        const monthUsers = allUsers.filter(
            (u) => u.createdAt.toISOString().slice(0, 7) === monthKey
        ).length;

        monthlyData.push({
            month: monthName,
            revenue: monthRevenue,
            users: monthUsers
        });
    }

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
        categoryDistribution
    };
}

export default async function IstatistiklerPage() {
    const data = await getDashboardData();
    return <DashboardClient initialData={data} />;
}
