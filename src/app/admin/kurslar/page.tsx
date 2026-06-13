import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import DeleteCourseButton from "./DeleteCourseButton";
import { stripHtml } from "@/lib/htmlUtils";
import Image from "next/image";

import CourseFilters from "./CourseFilters";
import CourseSortButton from "./CourseSortButton";
import ViewToggle from "../components/ViewToggle";

export const dynamic = "force-dynamic";

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getCoursesData(
    q?: string, sort?: string, page: number = 1, limit: number = 10,
    category?: string, status?: string, type?: string
) {
    const where: any = { type: { not: "FLIX" } };
    if (q) where.title = { contains: q, mode: "insensitive" };
    if (category) where.category = category;
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (type) where.type = type;
    
    let orderBy: any = [{ sortOrder: "asc" }, { createdAt: "desc" }]; // default
    if (sort === "oldest") orderBy = [{ sortOrder: "asc" }, { createdAt: "asc" }];
    else if (sort === "title-asc") orderBy = { title: "asc" };
    else if (sort === "title-desc") orderBy = { title: "desc" };
    else if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };

    const [courses, totalCount, dbCategories] = await Promise.all([
        prisma.course.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                _count: { select: { courseAccess: true, orderItems: true } },
            },
        }),
        prisma.course.count({ where }),
        prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { order: 'asc' } })
    ]);

    return { courses, totalCount, categories: dbCategories.map(c => c.name), dbCategorySlugs: dbCategories.map(c => c.slug) };
}

function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    }).format(n);
}

export default async function KurslarPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const q = typeof params.q === "string" ? params.q : undefined;
    const sort = typeof params.sort === "string" ? params.sort : undefined;
    const category = typeof params.category === "string" ? params.category : undefined;
    const status = typeof params.status === "string" ? params.status : undefined;
    const type = typeof params.type === "string" ? params.type : undefined;
    const view = typeof params.view === "string" ? params.view : "grid";
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    
    const { courses, totalCount, categories, dbCategorySlugs } = await getCoursesData(q, sort, page, limit, category, status, type);
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kurslar</h1>
                    <p className="text-gray-500">Tüm kursları yönetin ve düzenleyin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ViewToggle defaultView="grid" />
                    <CourseSortButton />
                    <Link
                        href="/admin/kurslar/ekle"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1221] text-white font-bold rounded-xl hover:bg-[#1a2744] transition shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Yeni Kurs
                    </Link>
                </div>
            </div>

            {/* Arama ve Sıralama Filtreleri */}
            <CourseFilters categories={categories} />

            {/* Content Based on View Mode */}
            {view === "list" ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {courses.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">Henüz kurs eklenmemiş.</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="text-left px-5 py-3 font-medium">Kurs Adı</th>
                                    <th className="text-left px-5 py-3 font-medium">Sıra</th>
                                    <th className="text-left px-5 py-3 font-medium">Fiyat</th>
                                    <th className="text-left px-5 py-3 font-medium">Satış/Öğrenci</th>
                                    <th className="text-left px-5 py-3 font-medium">Durum</th>
                                    <th className="text-right px-5 py-3 font-medium">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {courses.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden">
                                                    {c.imageUrl ? (
                                                        <Image src={c.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                                                    ) : (
                                                        <span className="flex items-center justify-center w-full h-full text-[10px] font-bold text-gray-400">4T</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm line-clamp-1" dangerouslySetInnerHTML={{ __html: stripHtml(c.title) }} />
                                                    <p className="text-xs text-gray-500">
                                                        {c.category || "Genel"}
                                                        {c.category && !dbCategorySlugs.includes(c.category) && (
                                                            <span className="ml-1 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">(Hatalı/Eski)</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-600 font-medium">
                                            {c.sortOrder !== undefined && c.sortOrder !== null ? c.sortOrder : 999}
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="font-semibold text-gray-900 text-sm">{formatTRY(c.price)}</p>
                                            {c.oldPrice && <p className="text-xs text-gray-400 line-through">{formatTRY(c.oldPrice)}</p>}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-600">
                                            {c._count.orderItems} Satış / {c._count.courseAccess} Öğr.
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {c.isActive ? "Aktif" : "Pasif"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                                            <Link href={`/admin/kurslar/${c.id}`} className="inline-flex p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Düzenle">
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <DeleteCourseButton id={c.id} title={stripHtml(c.title)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.length === 0 ? (
                        <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                            Henüz kurs eklenmemiş.
                        </div>
                    ) : (
                        courses.map((c) => (
                            <div
                                key={c.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                            >
                                {/* Image */}
                                <div className="h-36 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                                    {c.imageUrl ? (
                                        <Image
                                            src={c.imageUrl}
                                            alt={stripHtml(c.title)}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-primary/30">4T</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 line-clamp-1" dangerouslySetInnerHTML={{ __html: stripHtml(c.title) }} />
                                            <p className="text-sm text-gray-500">
                                                {c.category || "Genel"}
                                                {c.category && !dbCategorySlugs.includes(c.category) && (
                                                    <span className="ml-1 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">(Hatalı/Eski)</span>
                                                )}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium ${c.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {c.isActive ? "Aktif" : "Pasif"}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-primary">
                                            {formatTRY(c.price)}
                                        </span>
                                        {c.oldPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                {formatTRY(c.oldPrice)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <span>{c._count.courseAccess} öğrenci</span>
                                            <span>{c._count.orderItems} satış</span>
                                        </div>
                                        {c.sortOrder !== undefined && (
                                            <span className="bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-400">
                                                Sıra: {c.sortOrder}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <Link
                                            href={`/admin/kurslar/${c.id}`}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                            Düzenle
                                        </Link>
                                        <DeleteCourseButton id={c.id} title={stripHtml(c.title)} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {totalCount > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 font-medium">
                        Toplam <strong className="text-gray-900">{totalCount}</strong> kurstan <strong className="text-gray-900">{((page - 1) * limit) + 1} - {Math.min(page * limit, totalCount)}</strong> arası gösteriliyor.
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* Sayfa Başına Gösterim Seçici */}
                        <div className="flex items-center gap-2 mr-4">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Göster:</span>
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-0.5">
                                {[10, 20, 30, 50].map((l) => (
                                    <Link
                                        key={l}
                                        href={{
                                            pathname: "/admin/kurslar",
                                            query: { ...params, limit: l, page: 1 }
                                        }}
                                        className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                                            limit === l 
                                                ? "bg-[#0B1221] text-white shadow-sm" 
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        {l}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-1.5">
                                {/* Önceki Butonu */}
                                <Link
                                    href={{
                                        pathname: "/admin/kurslar",
                                        query: { ...params, page: Math.max(1, page - 1) }
                                    }}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                        page === 1
                                            ? "pointer-events-none opacity-50 bg-gray-50 text-gray-400"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                                    }`}
                                >
                                    Önceki
                                </Link>

                                {/* Sayfa Numaraları */}
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const pNum = i + 1;
                                        return (
                                            <Link
                                                key={pNum}
                                                href={{
                                                    pathname: "/admin/kurslar",
                                                    query: { ...params, page: pNum }
                                                }}
                                                className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                                                    page === pNum
                                                        ? "bg-[#0B1221] text-white shadow-md"
                                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                                }`}
                                            >
                                                {pNum}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Sonraki Butonu */}
                                <Link
                                    href={{
                                        pathname: "/admin/kurslar",
                                        query: { ...params, page: Math.min(totalPages, page + 1) }
                                    }}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                        page === totalPages
                                            ? "pointer-events-none opacity-50 bg-gray-50 text-gray-400"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                                    }`}
                                >
                                    Sonraki
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
