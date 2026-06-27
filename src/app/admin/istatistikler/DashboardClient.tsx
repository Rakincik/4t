"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell, Legend 
} from "recharts";
import { 
    CurrencyDollarIcon, UserGroupIcon, ShoppingCartIcon, AcademicCapIcon, 
    ArrowTrendingUpIcon, ArrowTrendingDownIcon, GiftIcon, SparklesIcon
} from "@heroicons/react/24/solid";

const COLORS = ['#DC2626', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
const PAYMENT_COLORS = ['#3B82F6', '#F59E0B'];
const TYPE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6']; // Blue: Kurs, Green: Kamp, Violet: Flix

function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

function StatCard({ title, value, previousValue, icon: Icon, color, rangeLabel }: { 
    title: string; 
    value: string | number; 
    previousValue?: number; 
    icon: any; 
    color: "blue" | "emerald" | "purple" | "amber" | "red";
    rangeLabel?: string;
}) {
    let trend = 0;
    const numValue = typeof value === 'number' ? value : 0;
    if (previousValue && previousValue > 0) {
        trend = ((numValue - previousValue) / previousValue) * 100;
    }

    const colorMap = {
        blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
        emerald: { bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        purple: { bg: "bg-purple-50", text: "text-purple-600", iconBg: "bg-purple-100" },
        amber: { bg: "bg-amber-50", text: "text-amber-600", iconBg: "bg-amber-100" },
        red: { bg: "bg-red-50", text: "text-red-600", iconBg: "bg-red-100" },
    };
    const cObj = colorMap[color];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${cObj.bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
                    <h3 className="text-3xl font-extrabold text-gray-900">{typeof value === 'number' && (title.includes("Gelir") || title.includes("Ciro")) ? formatTRY(numValue) : value}</h3>
                    {previousValue !== undefined && (
                        <div className="mt-2 flex items-center gap-1.5">
                            {trend >= 0 ? (
                                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><ArrowTrendingUpIcon className="w-3 h-3 mr-1 shrink-0" /> %{trend.toFixed(1)}</span>
                            ) : (
                                <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full"><ArrowTrendingDownIcon className="w-3 h-3 mr-1 shrink-0" /> %{Math.abs(trend).toFixed(1)}</span>
                            )}
                            <span className="text-[10px] text-gray-400">önceki döneme göre ({rangeLabel})</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cObj.iconBg} ${cObj.text} shrink-0`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

export default function DashboardClient({ initialData, activeRange }: { initialData: any; activeRange: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { kpis, monthlyData, topCourses, categoryDistribution, paymentMethodDistribution, courseTypeDistribution, rangeLabel } = initialData;

    const ranges = [
        { key: "today", label: "Bugün" },
        { key: "week", label: "Bu Hafta" },
        { key: "month", label: "Bu Ay" },
        { key: "30d", label: "Son 30 Gün" },
        { key: "3m", label: "Son 3 Ay" },
        { key: "6m", label: "Son 6 Ay" },
        { key: "1y", label: "Son 1 Yıl" },
        { key: "all", label: "Tüm Zamanlar" }
    ];

    function handleRangeChange(newRange: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", newRange);
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">İstatistikler</h1>
                    <p className="text-sm text-gray-500 mt-1">Sistem performansının detaylı analizleri.</p>
                </div>
                <div className="flex flex-wrap items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-0.5 animate-fade-in">
                    {ranges.map(r => (
                        <button 
                            key={r.key} 
                            onClick={() => handleRangeChange(r.key)} 
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                                activeRange === r.key 
                                    ? "bg-[#DC2626]/5 text-[#DC2626] shadow-sm font-extrabold" 
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title={`${rangeLabel} Ciro`} 
                    value={kpis.currentMonthRevenue} 
                    previousValue={kpis.lastMonthRevenue} 
                    icon={CurrencyDollarIcon} 
                    color="blue" 
                    rangeLabel={rangeLabel}
                />
                <StatCard 
                    title={`Yeni Üye (${rangeLabel})`} 
                    value={kpis.currentMonthStudents} 
                    previousValue={kpis.lastMonthStudents} 
                    icon={UserGroupIcon} 
                    color="emerald" 
                    rangeLabel={rangeLabel}
                />
                <StatCard 
                    title={`Başarılı Sipariş (${rangeLabel})`} 
                    value={kpis.currentMonthOrders} 
                    previousValue={kpis.lastMonthOrders} 
                    icon={ShoppingCartIcon} 
                    color="purple" 
                    rangeLabel={rangeLabel}
                />
                <StatCard 
                    title="Toplam Aktif Kurs" 
                    value={kpis.totalCourses} 
                    icon={AcademicCapIcon} 
                    color="amber" 
                />
            </div>

            {/* Charts Section 1: Revenue Area Chart & Course Type Revenue Doughnut Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Gelir Trendi ({rangeLabel})</h3>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₺${val/1000}k`} />
                                <Tooltip 
                                    formatter={(value: any) => [formatTRY(Number(value)), "Gelir"]} 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Course Type Revenue Breakdown (Kurs vs Kamp vs Flix) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Kurs Tipi Gelir Kırılımı</h3>
                    <p className="text-xs text-gray-500 mb-6">{rangeLabel} tiplere göre ciro paylaşımı</p>
                    <div className="flex-1 min-h-[200px]">
                        {courseTypeDistribution.some((entry: any) => entry.value > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={courseTypeDistribution} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={55} 
                                        outerRadius={75} 
                                        paddingAngle={4} 
                                        dataKey="value"
                                    >
                                        {courseTypeDistribution.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any, name: any, props: any) => [
                                        formatTRY(value), 
                                        props.payload.name
                                    ]} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-xs py-10 font-bold">Bu dönemde satın alma bulunamadı.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Section 2: Student Registrations Bar Chart & Payment Method Doughnut Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Users Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Yeni Kayıt Trendi ({rangeLabel})</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="users" name="Öğrenci" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Payment Method Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Ödeme Yöntemleri</h3>
                    <p className="text-xs text-gray-500 mb-6">{rangeLabel} başarılı ödemelerin kırılımı</p>
                    <div className="flex-1 min-h-[200px]">
                        {paymentMethodDistribution.some((entry: any) => entry.value > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={paymentMethodDistribution} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={55} 
                                        outerRadius={75} 
                                        paddingAngle={4} 
                                        dataKey="value"
                                    >
                                        {paymentMethodDistribution.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any, name: any, props: any) => [
                                        `${value} Adet (${formatTRY(props.payload.revenue)})`, 
                                        props.payload.name
                                    ]} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-xs py-10 font-bold">Bu dönemde ödeme kaydı bulunamadı.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Category Distribution, Top Courses & Campaign/Loyalty metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category Doughnut Chart (col-span-1) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Kategori Dağılımı</h3>
                        <p className="text-xs text-gray-500 mb-6">Aktif erişimlerin kategorilere göre kırılımı</p>
                    </div>
                    <div className="flex-1 min-h-[200px] flex items-center justify-center">
                        {categoryDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                                        {categoryDistribution.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => [value, "Aktif Erişim"]} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 text-xs font-bold">Erişim kaydı bulunamadı.</div>
                        )}
                    </div>
                </div>

                {/* Top Courses List */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">En Çok İlgi Gören 5 Kurs</h3>
                        
                        {topCourses.length === 0 ? (
                            <div className="flex h-40 items-center justify-center text-gray-500">Henüz kurs satışı veya verisi yok.</div>
                        ) : (
                            <div className="space-y-4">
                                {topCourses.map((course: any, index: number) => (
                                    <div key={course.id} className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 font-extrabold flex items-center justify-center shrink-0 border border-red-100 group-hover:bg-[#DC2626] group-hover:text-white transition-colors">
                                            #{index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate group-hover:text-[#DC2626] transition-colors">{course.title.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}</p>
                                            <p className="text-xs text-gray-500 font-medium">{course.category || "Kategorisiz"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-extrabold text-gray-900 text-xs">{course.studentCount} Kayıt</p>
                                            <p className="text-[10px] text-gray-400">{course.orderCount} Sipariş</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Campaign & Loyalty Overview Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Kampanya ve Sadakat Analizleri</h3>
                        <p className="text-xs text-gray-500 mb-6">Kupon satışı ve öğrenci geri dönüş oranları</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Kuponlu Siparişler</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <GiftIcon className="w-5 h-5 text-purple-500 shrink-0" />
                                    <span className="text-lg font-extrabold text-gray-900">{kpis.couponCount} Adet</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Kupon İndirim Tutarı</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <CurrencyDollarIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span className="text-lg font-extrabold text-gray-900">{formatTRY(kpis.couponDiscountTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Sadakat ve Finansal Sağlık</span>
                        <div className="text-xs space-y-2.5 text-gray-600">
                            <div className="flex justify-between items-center bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                                <span className="font-semibold text-emerald-800">
                                    Tekrarlı Alışveriş Oranı:
                                </span>
                                <span className="font-extrabold text-emerald-700 text-sm">%{kpis.repeatPurchaseRate}</span>
                            </div>
                            <div className="flex justify-between px-1">
                                <span>Tekrar Sipariş Veren Öğrenci:</span>
                                <span className="font-bold text-gray-900">{kpis.repeatBuyersCount} Üye</span>
                            </div>
                            <div className="flex justify-between px-1">
                                <span>Ortalama Sepet Tutarı:</span>
                                <span className="font-bold text-gray-900">
                                    {kpis.currentMonthOrders > 0
                                        ? formatTRY(Math.round(kpis.currentMonthRevenue / kpis.currentMonthOrders))
                                        : "₺0"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
