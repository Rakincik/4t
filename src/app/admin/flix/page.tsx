import Link from "next/link";
import { PlusIcon, PencilIcon, FilmIcon } from "@heroicons/react/24/outline";
import { getFlixPackages } from "./actions";
import { stripHtml } from "@/lib/htmlUtils";
import Image from "next/image";
import DeleteFlixButton from "./DeleteFlixButton";
import CourseSortButton from "../kurslar/CourseSortButton";
import ViewToggle from "../components/ViewToggle";

export const dynamic = "force-dynamic";

function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default async function AdminFlixPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const view = typeof params.view === "string" ? params.view : "list";
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;
    
    const { packages, totalCount } = await getFlixPackages(page, limit) as any;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">FLIX Paketleri</h1>
                    <p className="text-gray-500 text-sm">Video eğitim paketlerini yönetin — her paketin bölümleri, eğitmenleri ve fiyatları.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ViewToggle defaultView="list" />
                    <CourseSortButton type="FLIX" />
                    <Link
                        href="/admin/flix/ekle"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition shadow-lg"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Yeni FLIX Paketi
                    </Link>
                </div>
            </div>

            {/* Content Based on View Mode */}
            {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.length === 0 ? (
                        <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                            Henüz FLIX paketi eklenmemiş.
                        </div>
                    ) : (
                        packages.map((pkg: any) => (
                            <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                                <div className="h-36 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative">
                                    {pkg.imageUrl ? (
                                        <img src={pkg.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <FilmIcon className="w-12 h-12 text-purple-300" />
                                    )}
                                    {pkg.badge && (
                                        <span className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-[10px] font-bold rounded shadow-sm">
                                            {pkg.badge}
                                        </span>
                                    )}
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: stripHtml(pkg.title) }} />
                                        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {pkg.isActive ? "Aktif" : "Pasif"}
                                        </span>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-lg font-bold text-gray-900">{formatTRY(pkg.price)}</span>
                                            {pkg.oldPrice && <span className="text-xs text-gray-400 line-through">{formatTRY(pkg.oldPrice)}</span>}
                                        </div>
                                        {/* Pazarlama ve Dönüşüm İstatistikleri */}
                                        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center text-[10px] text-gray-500 mb-4">
                                            <div>
                                                <div className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Ziyaret</div>
                                                <div className="font-extrabold text-gray-900 mt-0.5">{pkg.viewsCount || 0}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Sepet Ekle</div>
                                                <div className="font-extrabold text-gray-900 mt-0.5">{pkg.cartAddsCount || 0}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Dönüşüm</div>
                                                <div className="font-extrabold text-indigo-600 mt-0.5">
                                                    %{pkg.viewsCount && pkg.viewsCount > 0 ? ((pkg._count.orderItems / pkg.viewsCount) * 100).toFixed(1) : "0.0"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <div className="flex items-center gap-3">
                                                <span>Sıra: <b>{pkg.sortOrder !== undefined && pkg.sortOrder !== null ? pkg.sortOrder : 999}</b></span>
                                                <span>Sipariş: <b>{pkg._count.orderItems}</b></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/flix/${pkg.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                                <PencilIcon className="w-4 h-4" />
                                                Düzenle
                                            </Link>
                                            <DeleteFlixButton id={pkg.id} title={pkg.title} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {packages.length === 0 ? (
                        <div className="p-12 text-center">
                            <FilmIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz FLIX Paketi Yok</h3>
                            <p className="text-gray-400 text-sm mb-6">İlk FLIX paketinizi oluşturun.</p>
                            <Link href="/admin/flix/ekle" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
                                <PlusIcon className="w-4 h-4" /> Paket Ekle
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="text-left px-5 py-3 font-medium">Paket</th>
                                    <th className="text-left px-5 py-3 font-medium">Sıra</th>
                                    <th className="text-left px-5 py-3 font-medium">Fiyat</th>
                                    <th className="text-left px-5 py-3 font-medium">Kitap</th>
                                    <th className="text-left px-5 py-3 font-medium">Saat</th>
                                    <th className="text-left px-5 py-3 font-medium">Sipariş</th>
                                    <th className="text-left px-5 py-3 font-medium">Ziyaret</th>
                                    <th className="text-left px-5 py-3 font-medium">Sepet</th>
                                    <th className="text-left px-5 py-3 font-medium">Dönüşüm</th>
                                    <th className="text-left px-5 py-3 font-medium">Durum</th>
                                    <th className="text-right px-5 py-3 font-medium">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {packages.map((pkg: any) => (
                                    <tr key={pkg.id} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden">
                                                    {pkg.imageUrl ? (
                                                        <img src={pkg.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FilmIcon className="w-5 h-5 text-gray-400 m-2.5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm line-clamp-1" dangerouslySetInnerHTML={{ __html: stripHtml(pkg.title) }} />
                                                    {pkg.badge && <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded mt-0.5">{pkg.badge}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-600 font-medium">
                                            {pkg.sortOrder !== undefined && pkg.sortOrder !== null ? pkg.sortOrder : 999}
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="font-semibold text-gray-900 text-sm">{formatTRY(pkg.price)}</p>
                                            {pkg.oldPrice && <p className="text-xs text-gray-400 line-through">{formatTRY(pkg.oldPrice)}</p>}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-600">
                                            {pkg.bookPrice ? formatTRY(pkg.bookPrice) : "—"}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-600">{pkg.hours || "—"}</td>
                                        <td className="px-5 py-3 text-sm text-gray-600">{pkg._count.orderItems}</td>
                                        <td className="px-5 py-3 text-sm text-gray-600">{pkg.viewsCount || 0}</td>
                                        <td className="px-5 py-3 text-sm text-gray-600">{pkg.cartAddsCount || 0}</td>
                                        <td className="px-5 py-3 text-sm font-bold text-indigo-600">
                                            %{pkg.viewsCount && pkg.viewsCount > 0 ? ((pkg._count.orderItems / pkg.viewsCount) * 100).toFixed(1) : "0.0"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {pkg.isActive ? "Aktif" : "Pasif"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                                            <Link href={`/admin/flix/${pkg.id}`} className="inline-flex p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" title="Düzenle">
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <DeleteFlixButton id={pkg.id} title={pkg.title} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {totalCount > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 font-medium">
                        Toplam <strong className="text-gray-900">{totalCount}</strong> paketten <strong className="text-gray-900">{((page - 1) * limit) + 1} - {Math.min(page * limit, totalCount)}</strong> arası gösteriliyor.
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* Sayfa Başına Gösterim Seçici */}
                        <div className="flex items-center gap-2 mr-4">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Göster:</span>
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-0.5">
                                {[12, 24, 60].map((l) => (
                                    <Link
                                        key={l}
                                        href={{
                                            pathname: "/admin/flix",
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
                                <Link
                                    href={{
                                        pathname: "/admin/flix",
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

                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const pNum = i + 1;
                                        return (
                                            <Link
                                                key={pNum}
                                                href={{
                                                    pathname: "/admin/flix",
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

                                <Link
                                    href={{
                                        pathname: "/admin/flix",
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
