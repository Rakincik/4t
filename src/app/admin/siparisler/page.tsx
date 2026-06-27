import prisma from "@/lib/prisma";
import Link from "next/link";
import OrdersFilterBar from "./OrdersFilterBar";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

export const dynamic = "force-dynamic";

async function getOrders(filters: { q?: string; status?: string; method?: string; sort?: string }) {
    const { q, status, method, sort } = filters;
    const where: any = {};
    const andConditions: any[] = [];

    // 1. Status Filter
    if (status) {
        andConditions.push({ status });
    }

    // 2. Search Query (name, email, orderId)
    if (q) {
        andConditions.push({
            OR: [
                { id: { contains: q, mode: "insensitive" } },
                { user: { name: { contains: q, mode: "insensitive" } } },
                { user: { email: { contains: q, mode: "insensitive" } } },
            ]
        });
    }

    // 3. Payment Method Filter (check notes)
    if (method) {
        if (method === "EFT") {
            andConditions.push({
                OR: [
                    { notes: { contains: "EFT", mode: "insensitive" } },
                    { notes: { contains: "Havale", mode: "insensitive" } },
                ]
            });
        } else if (method === "CC") {
            andConditions.push({
                notes: { contains: "Kredi Kartı", mode: "insensitive" }
            });
        }
    }

    if (andConditions.length > 0) {
        where.AND = andConditions;
    }

    // 4. Sorting
    let orderBy: any = { createdAt: "desc" }; // default
    if (sort === "date_asc") {
        orderBy = { createdAt: "asc" };
    } else if (sort === "amount_desc") {
        orderBy = { totalAmount: "desc" };
    } else if (sort === "amount_asc") {
        orderBy = { totalAmount: "asc" };
    }

    return prisma.order.findMany({
        where,
        orderBy,
        include: {
            user: { select: { name: true, email: true } },
            items: {
                include: { course: { select: { title: true } } },
            },
        },
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
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function getSortLink(currentSort: string | undefined, targetType: 'amount' | 'date', searchParams: any) {
    const params = new URLSearchParams();
    
    // Copy existing search, status, and method filters
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.method) params.set("method", searchParams.method);

    if (targetType === 'amount') {
        if (currentSort === 'amount_desc') {
            params.set('sort', 'amount_asc');
        } else if (currentSort === 'amount_asc') {
            params.delete('sort');
        } else {
            params.set('sort', 'amount_desc');
        }
    } else if (targetType === 'date') {
        if (currentSort === 'date_asc') {
            params.delete('sort'); // reverts to default date desc
        } else {
            params.set('sort', 'date_asc');
        }
    }
    
    const qs = params.toString();
    return qs ? `?${qs}` : '?';
}

const statusConfig = {
    PENDING: { label: "Bekliyor", class: "bg-amber-100 text-amber-700" },
    PAID: { label: "Ödendi", class: "bg-green-100 text-green-700" },
    FAILED: { label: "Başarısız", class: "bg-red-100 text-red-700" },
    REFUNDED: { label: "İade", class: "bg-gray-100 text-gray-700" },
};

interface PageProps {
    searchParams: Promise<{
        q?: string;
        status?: string;
        method?: string;
        sort?: string;
    }>;
}

export default async function SiparislerPage({ searchParams }: PageProps) {
    const filters = (await searchParams) || {};
    const orders = await getOrders(filters);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
                    <p className="text-gray-500">Tüm satın alma işlemlerini görüntüleyin, filtreleyin ve sıralayın.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <OrdersFilterBar />

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Sipariş
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Müşteri
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Ürünler
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <Link 
                                        href={getSortLink(filters.sort, 'amount', filters)}
                                        className="inline-flex items-center gap-1 hover:text-gray-800 transition select-none"
                                    >
                                        Tutar
                                        {filters.sort === 'amount_desc' && <ArrowDownIcon className="w-3 h-3 text-[#DC2626]" />}
                                        {filters.sort === 'amount_asc' && <ArrowUpIcon className="w-3 h-3 text-[#DC2626]" />}
                                    </Link>
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <Link 
                                        href={getSortLink(filters.sort, 'date', filters)}
                                        className="inline-flex items-center gap-1 hover:text-gray-800 transition select-none"
                                    >
                                        Tarih
                                        {filters.sort === 'date_asc' && <ArrowUpIcon className="w-3 h-3 text-[#DC2626]" />}
                                        {(!filters.sort || filters.sort === 'date_desc') && <ArrowDownIcon className="w-3 h-3 text-[#DC2626]" />}
                                    </Link>
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    İşlem
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        Filtrelere uygun sipariş bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const status = statusConfig[order.status] || { label: order.status, class: "bg-gray-100 text-gray-700" };
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-gray-600 font-bold">
                                                    #{order.id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">
                                                    {order.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">{order.user.email}</p>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="text-sm text-gray-600 truncate font-medium">
                                                    {order.items.map((i) => stripHtml(i.course.title)).join(", ")}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">
                                                    {formatTRY(order.totalAmount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${status.class}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/siparisler/${order.id}`}
                                                    className="text-primary hover:text-primary/95 text-sm font-bold hover:underline"
                                                >
                                                    Detay
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

