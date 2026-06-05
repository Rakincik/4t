import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeftIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarDaysIcon,
    AcademicCapIcon,
    ShoppingCartIcon,
    KeyIcon,
    CurrencyDollarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    MapPinIcon,
    IdentificationIcon,
    UserIcon,
    BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

/* ===================================================== */
/* DATA                                                  */
/* ===================================================== */
async function getStudent(id: string): Promise<any> {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            courseAccess: {
                include: {
                    course: { select: { id: true, title: true, type: true, imageUrl: true, price: true } },
                },
                orderBy: { grantedAt: "desc" },
            },
            orders: {
                include: {
                    items: {
                        include: {
                            course: { select: { title: true, type: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!user || user.role !== "STUDENT") return null;
    return user;
}

/* ===================================================== */
/* HELPERS                                               */
/* ===================================================== */
function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency", currency: "TRY", maximumFractionDigits: 0,
    }).format(n);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
    }).format(new Date(date));
}

function formatDateTime(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(date));
}

function getInitialColor(name: string) {
    const colors = [
        "from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600", "from-violet-500 to-purple-600",
        "from-amber-500 to-orange-600", "from-rose-500 to-pink-600", "from-cyan-500 to-blue-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function maskTC(tc: string) {
    if (!tc || tc.length < 5) return tc || "—";
    return tc.slice(0, 3) + "****" + tc.slice(-2);
}

const statusMap: Record<string, { label: string; cls: string; Icon: any }> = {
    PAID: { label: "Ödendi", cls: "bg-emerald-100 text-emerald-700", Icon: CheckCircleIcon },
    PENDING: { label: "Bekliyor", cls: "bg-amber-100 text-amber-700", Icon: ClockIcon },
    FAILED: { label: "Başarısız", cls: "bg-red-100 text-red-700", Icon: XCircleIcon },
    REFUNDED: { label: "İade", cls: "bg-gray-100 text-gray-600", Icon: ArrowPathIcon },
};

const typeLabels: Record<string, { label: string; cls: string }> = {
    KURS: { label: "Kurs", cls: "bg-blue-100 text-blue-700" },
    FLIX: { label: "FLIX", cls: "bg-purple-100 text-purple-700" },
    KAMP: { label: "Kamp", cls: "bg-orange-100 text-orange-700" },
};

/* ===================================================== */
/* PAGE                                                  */
/* ===================================================== */
export default async function StudentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const student = await getStudent(id);
    if (!student) notFound();

    const totalSpent = student.orders
        .filter((o: any) => o.status === "PAID")
        .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    const avatarGradient = getInitialColor(student.name);
    const initials = student.name.split(" ").map((n: string) => n.charAt(0)).join("").slice(0, 2).toUpperCase();

    return (
        <div className="space-y-6 max-w-6xl">
            {/* ============ HEADER ============ */}
            <div className="flex items-center gap-4">
                <Link href="/admin/ogrenciler" className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
                    <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Öğrenci Detayı</h1>
                    <p className="text-sm text-gray-400">Öğrencinin tüm bilgileri, siparişleri ve erişimleri</p>
                </div>
            </div>

            {/* ============ PROFILE HERO ============ */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Avatar */}
                <div className={`w-24 h-24 bg-gradient-to-br ${avatarGradient} rounded-2xl flex items-center justify-center shadow-lg shrink-0`}>
                    <span className="text-white font-bold text-3xl drop-shadow">{initials}</span>
                </div>

                {/* Name & Quick Info */}
                <div className="flex-1">
                    <h2 className="text-2xl font-extrabold text-gray-900">{student.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400" /> {student.email}
                        </span>
                        {student.phone && (
                            <span className="text-sm text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                                <PhoneIcon className="w-4 h-4 text-gray-400" /> {student.phone}
                            </span>
                        )}
                        <span className="text-xs text-gray-400 flex items-center gap-1 ml-1">
                            <CalendarDaysIcon className="w-4 h-4" /> {formatDate(student.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <Link
                        href={`/admin/erisimler?userId=${student.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0B1221] text-white text-sm font-bold rounded-xl hover:bg-[#1a2744] transition shadow-md"
                    >
                        <KeyIcon className="w-4 h-4" /> Erişim Ver
                    </Link>
                </div>
            </div>

            {/* ============ KİŞİSEL BİLGİLER ============ */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        Kişisel Bilgiler
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    {[
                        { icon: IdentificationIcon, label: "TC Kimlik No", value: maskTC(student.tcNo), color: "text-blue-500" },
                        { icon: PhoneIcon, label: "Telefon", value: student.phone || "—", color: "text-emerald-500" },
                        { icon: BuildingOffice2Icon, label: "Şehir", value: student.city || "—", color: "text-violet-500" },
                        { icon: MapPinIcon, label: "Adres", value: student.address || "—", color: "text-amber-500" },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="px-6 py-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className={`w-4 h-4 ${item.color}`} />
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{item.label}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-800 truncate">{item.value}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ============ MINI STATS ============ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Kurs Erişimi", value: student.courseAccess.length, icon: AcademicCapIcon, gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
                    { label: "Toplam Sipariş", value: student.orders.length, icon: ShoppingCartIcon, gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
                    { label: "Ödenen Sipariş", value: student.orders.filter((o: any) => o.status === "PAID").length, icon: CheckCircleIcon, gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
                    { label: "Toplam Harcama", value: formatTRY(totalSpent), icon: CurrencyDollarIcon, gradient: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
                ].map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{s.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ============ MAIN GRID ============ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* ---- KURS ERİŞİMLERİ (2/5) ---- */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                            Eriştiği Kurslar
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{student.courseAccess.length}</span>
                        </h3>
                    </div>

                    {student.courseAccess.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <AcademicCapIcon className="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">Henüz kurs erişimi yok</p>
                            <Link href={`/admin/erisimler?userId=${student.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-2 hover:underline">
                                <KeyIcon className="w-3 h-3" /> Hemen Erişim Ver →
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {student.courseAccess.map((ca: any) => {
                                const t = typeLabels[ca.course.type] || typeLabels.KURS;
                                return (
                                    <div key={ca.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                            {ca.course.imageUrl ? (
                                                <img src={ca.course.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold">4T</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{ca.course.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.cls}`}>{t.label}</span>
                                                <span className="text-[10px] text-gray-400">{formatTRY(ca.course.price)}</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 shrink-0">{formatDateTime(ca.grantedAt)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ---- SİPARİŞ GEÇMİŞİ (3/5) ---- */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <ShoppingCartIcon className="w-4 h-4 text-gray-400" />
                            Sipariş Geçmişi
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{student.orders.length}</span>
                        </h3>
                    </div>

                    {student.orders.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <ShoppingCartIcon className="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">Henüz sipariş yok</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {student.orders.map((order: any) => {
                                const st = statusMap[order.status] || statusMap.PENDING;
                                const StIcon = st.Icon;
                                return (
                                    <div key={order.id} className="px-5 py-4 hover:bg-gray-50/50 transition">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${st.cls}`}>
                                                    <StIcon className="w-3 h-3" /> {st.label}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-gray-900">{formatTRY(order.totalAmount)}</span>
                                                <Link href={`/admin/siparisler/${order.id}`} className="text-[10px] text-blue-600 font-bold hover:underline">
                                                    Detay →
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {order.items.map((item: any) => {
                                                const tp = typeLabels[item.course.type] || typeLabels.KURS;
                                                return (
                                                    <div key={item.id} className="flex items-center gap-2 text-xs text-gray-600">
                                                        <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${tp.cls}`}>{tp.label}</span>
                                                        <span className="truncate">{item.course.title}</span>
                                                        <span className="ml-auto text-gray-400 shrink-0">{formatTRY(item.price)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-gray-300 mt-2 flex items-center gap-1">
                                            <ClockIcon className="w-3 h-3" /> {formatDateTime(order.createdAt)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
