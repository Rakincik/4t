"use client";

import React, { useState } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell, Legend 
} from "recharts";
import { 
    CurrencyDollarIcon, UserGroupIcon, ShoppingCartIcon, AcademicCapIcon, 
    ArrowTrendingUpIcon, ArrowTrendingDownIcon 
} from "@heroicons/react/24/solid";

const COLORS = ['#DC2626', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

function StatCard({ title, value, previousValue, icon: Icon, color }: { title: string; value: string | number; previousValue?: number; icon: any; color: "blue" | "emerald" | "purple" | "amber" | "red" }) {
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
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
                    <h3 className="text-3xl font-extrabold text-gray-900">{typeof value === 'number' && title.includes("Gelir") ? formatTRY(value) : value}</h3>
                    {previousValue !== undefined && (
                        <div className="mt-2 flex items-center gap-1.5">
                            {trend >= 0 ? (
                                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><ArrowTrendingUpIcon className="w-3 h-3 mr-1" /> %{trend.toFixed(1)}</span>
                            ) : (
                                <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full"><ArrowTrendingDownIcon className="w-3 h-3 mr-1" /> %{Math.abs(trend).toFixed(1)}</span>
                            )}
                            <span className="text-xs text-gray-400">geçen aya göre</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cObj.iconBg} ${cObj.text}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

export default function DashboardClient({ initialData }: { initialData: any }) {
    const [timeRange, setTimeRange] = useState("6m");
    const { kpis, monthlyData, topCourses, categoryDistribution } = initialData;

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">İstatistikler</h1>
                    <p className="text-sm text-gray-500 mt-1">Sistem performansının detaylı analizleri.</p>
                </div>
                {/* Temporary static filter indicator since logic is SSR based */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    {["Bugüne Kadar", "Son 6 Ay"].map(r => (
                        <button key={r} onClick={() => setTimeRange(r)} className={`px-4 py-1.5 text-sm font-bold rounded-md transition ${timeRange === r ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Bu Ayki Ciro" value={kpis.currentMonthRevenue} previousValue={kpis.lastMonthRevenue} icon={CurrencyDollarIcon} color="blue" />
                <StatCard title="Toplam Öğrenci" value={kpis.totalStudents} previousValue={kpis.lastMonthStudents} icon={UserGroupIcon} color="emerald" />
                <StatCard title="Yeni Sipariş (Bu Ay)" value={kpis.currentMonthOrders} previousValue={kpis.lastMonthOrders} icon={ShoppingCartIcon} color="purple" />
                <StatCard title="Aktif Kurs Sayısı" value={kpis.totalCourses} icon={AcademicCapIcon} color="amber" />
            </div>

            {/* Charts Section 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Aylık Gelir Trendi</h3>
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

                {/* Category Doughnut Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Satış Dağılımı</h3>
                    <p className="text-xs text-gray-500 mb-6">En çok tercih edilen kategoriler</p>
                    <div className="flex-1 min-h-[240px]">
                        {categoryDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {categoryDistribution.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => [value, "Öğrenci Kyt."]} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">Veri bulunamadı.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Section 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Users Bar Chart */}
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Yeni Öğrenci Kayıtları</h3>
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

                {/* Top Courses List */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Bu Ay En Çok Satan 5 Kurs</h3>
                    
                    {topCourses.length === 0 ? (
                        <div className="flex h-40 items-center justify-center text-gray-500">Henüz kurs satışı veya verisi yok.</div>
                    ) : (
                        <div className="space-y-4">
                            {topCourses.map((course: any, index: number) => (
                                <div key={course.id} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 font-extrabold flex items-center justify-center shrink-0 border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">{course.title}</p>
                                        <p className="text-xs text-gray-500 font-medium">{course.category || "Kategorisiz"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-gray-900">{course.studentCount} Kayıt</p>
                                        <p className="text-xs text-gray-400">{course.orderCount} Başarılı Sipariş</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
