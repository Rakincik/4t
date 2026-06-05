import prisma from "@/lib/prisma";
import Link from "next/link";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    UsersIcon,
    MagnifyingGlassIcon,
    AcademicCapIcon,
    ShoppingCartIcon,
    UserPlusIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    EnvelopeIcon,
    PhoneIcon,
    EyeIcon,
    KeyIcon,
    ChevronRightIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export async function addStudent(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const tcNo = formData.get("tcNo") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;

    if (!name || !email || !password) return;

    // Email check
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return; // İleride hata mesajı olarak eklenebilir

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            tcNo: tcNo || null,
            city: city || null,
            address: address || null,
            role: "STUDENT"
        }
    });

    revalidatePath("/admin/ogrenciler");
    redirect("/admin/ogrenciler");
}

/* ===================================================== */
/* DATA                                                  */
/* ===================================================== */
async function getStudents(search?: string) {
    return prisma.user.findMany({
        where: {
            role: "STUDENT",
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" as any } },
                    { email: { contains: search, mode: "insensitive" as any } },
                ],
            }),
        },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { courseAccess: true, orders: true } },
            orders: {
                select: { totalAmount: true, status: true },
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });
}

async function getStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const [total, today, thisWeek, withAccess] = await Promise.all([
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: todayStart } } }),
        prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: weekStart } } }),
        prisma.user.count({
            where: {
                role: "STUDENT",
                courseAccess: { some: {} },
            },
        }),
    ]);

    return { total, today, thisWeek, withAccess };
}

/* ===================================================== */
/* HELPERS                                               */
/* ===================================================== */
function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function formatDateTime(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

function getInitialColor(name: string) {
    const colors = [
        "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
        "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function timeAgo(date: Date) {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Az önce";
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} gün önce`;
    return formatDate(date);
}

/* ===================================================== */
/* PAGE                                                  */
/* ===================================================== */
export default async function OgrencilerPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; add?: string }>;
}) {
    const params = await searchParams;
    const isAdding = params.add === "true";
    const [students, stats] = await Promise.all([
        getStudents(params.search),
        getStats(),
    ]);

    const statCards = [
        {
            label: "Toplam Öğrenci",
            value: stats.total,
            icon: UsersIcon,
            color: "text-blue-600",
            bg: "bg-blue-50",
            change: null,
        },
        {
            label: "Bugün Kayıt",
            value: stats.today,
            icon: UserPlusIcon,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            change: stats.today > 0 ? `+${stats.today}` : null,
        },
        {
            label: "Bu Hafta",
            value: stats.thisWeek,
            icon: ArrowTrendingUpIcon,
            color: "text-violet-600",
            bg: "bg-violet-50",
            change: null,
        },
        {
            label: "Aktif Öğrenci",
            value: stats.withAccess,
            icon: AcademicCapIcon,
            color: "text-amber-600",
            bg: "bg-amber-50",
            change: stats.total > 0 ? `%${Math.round((stats.withAccess / stats.total) * 100)}` : null,
        },
    ];

    return (
        <div className="space-y-6">
            {/* ============ HEADER ============ */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Öğrenciler</h1>
                    <p className="text-gray-500 text-sm">
                        Siteye kayıt olan tüm öğrenciler otomatik olarak burada listelenir.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="?add=true"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B1221] text-white font-medium rounded-xl hover:bg-[#152340] transition text-sm shadow-md"
                    >
                        <UserPlusIcon className="h-4 w-4" />
                        Öğrenci Ekle
                    </Link>
                    <Link
                        href="/admin/erisimler"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition text-sm"
                    >
                        <KeyIcon className="h-4 w-4" />
                        Erişim Ver
                    </Link>
                </div>
            </div>

            {/* ============ STAT CARDS ============ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                {stat.change && (
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString("tr-TR")}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* ============ SEARCH & FILTERS ============ */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <form className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            name="search"
                            defaultValue={params.search || ""}
                            placeholder="İsim, e-posta veya telefon ile arayın..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                    </div>
                    <button type="submit" className="px-5 py-2.5 bg-[#0B1221] text-white font-semibold rounded-lg hover:bg-[#1a2744] transition text-sm shrink-0">
                        Ara
                    </button>
                </form>
                {params.search && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            &quot;<strong>{params.search}</strong>&quot; için <strong>{students.length}</strong> sonuç bulundu
                        </span>
                        <Link href="/admin/ogrenciler" className="text-xs text-red-500 hover:underline">Temizle ✕</Link>
                    </div>
                )}
            </div>

            {/* ============ STUDENT LIST ============ */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        Kayıtlı Öğrenciler
                        <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{students.length}</span>
                    </h2>
                </div>

                {students.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <UsersIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">
                            {params.search ? "Aramanızla eşleşen öğrenci bulunamadı." : "Henüz kayıtlı öğrenci yok."}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Sitedeki &quot;Kayıt Ol&quot; formu aracılığıyla kaydolan öğrenciler otomatik olarak burada görünecektir.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {students.map((s) => {
                            const avatarColor = getInitialColor(s.name);
                            const hasAccess = s._count.courseAccess > 0;
                            const hasOrders = s._count.orders > 0;

                            return (
                                <div key={s.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors group">
                                    {/* Avatar */}
                                    <div className={`w-11 h-11 ${avatarColor} rounded-full flex items-center justify-center shrink-0 shadow-sm`}>
                                        <span className="text-white font-bold text-sm">
                                            {s.name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{s.name}</p>
                                            {hasAccess && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700">
                                                    <AcademicCapIcon className="w-2.5 h-2.5" /> {s._count.courseAccess} Kurs
                                                </span>
                                            )}
                                            {hasOrders && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                                                    <ShoppingCartIcon className="w-2.5 h-2.5" /> {s._count.orders} Sipariş
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1 truncate">
                                                <EnvelopeIcon className="w-3 h-3 shrink-0" /> {s.email}
                                            </span>
                                            {s.phone && (
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <PhoneIcon className="w-3 h-3 shrink-0" /> {s.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Kayıt Tarihi */}
                                    <div className="hidden md:block text-right shrink-0">
                                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                                            <ClockIcon className="w-3 h-3" />
                                            {timeAgo(s.createdAt)}
                                        </p>
                                        <p className="text-[10px] text-gray-300 mt-0.5">{formatDate(s.createdAt)}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/admin/erisimler?userId=${s.id}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Erişim Ver"
                                        >
                                            <KeyIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/admin/ogrenciler/${s.id}`}
                                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                            title="Detay"
                                        >
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ============ ADD STUDENT MODAL ============ */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <UserPlusIcon className="w-5 h-5 text-blue-600" />
                                    Yeni Öğrenci Ekle
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Sisteme manuel olarak yeni bir öğrenci hesabı oluşturun.</p>
                            </div>
                            <Link href="/admin/ogrenciler" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                                <XCircleIcon className="w-6 h-6" />
                            </Link>
                        </div>
                        <div className="p-6">
                            <form action={addStudent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Ad Soyad</label>
                                    <input type="text" name="name" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">E-posta Adresi</label>
                                    <input type="email" name="email" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Telefon Numarası <span className="text-gray-400 font-normal">(Opsiyonel)</span></label>
                                    <input type="tel" name="phone" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">TC Kimlik No <span className="text-gray-400 font-normal">(Opsiyonel)</span></label>
                                        <input type="text" name="tcNo" maxLength={11} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Şehir <span className="text-gray-400 font-normal">(Opsiyonel)</span></label>
                                        <input type="text" name="city" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Açık Adres <span className="text-gray-400 font-normal">(Opsiyonel)</span></label>
                                    <textarea name="address" rows={2} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Giriş Şifresi</label>
                                    <input type="text" name="password" required defaultValue="4Takademi123*" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                                    <p className="text-[10px] text-gray-400 mt-1">Öğrenci giriş yaparken bu şifreyi kullanacaktır.</p>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <Link href="/admin/ogrenciler" className="px-5 py-2.5 bg-white text-gray-600 font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm">
                                        İptal
                                    </Link>
                                    <button type="submit" className="px-5 py-2.5 bg-[#0B1221] text-white font-semibold rounded-xl hover:bg-[#152340] transition text-sm shadow-md">
                                        Öğrenciyi Kaydet
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
