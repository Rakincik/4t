import Link from "next/link";
import { PlusIcon, PencilIcon, FilmIcon } from "@heroicons/react/24/outline";
import { getFlixPackages } from "./actions";
import { stripHtml } from "@/lib/htmlUtils";

export const dynamic = "force-dynamic";

function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default async function AdminFlixPage() {
    const packages = await getFlixPackages() as any[];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">FLIX Paketleri</h1>
                    <p className="text-gray-500 text-sm">Video eğitim paketlerini yönetin — her paketin bölümleri, eğitmenleri ve fiyatları.</p>
                </div>
                <Link
                    href="/admin/flix/ekle"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition shadow-lg"
                >
                    <PlusIcon className="w-4 h-4" />
                    Yeni FLIX Paketi
                </Link>
            </div>

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
                                <th className="text-left px-5 py-3 font-medium">Durum</th>
                                <th className="text-right px-5 py-3 font-medium">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {packages.map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-gray-50/50">
                                    <td className="px-5 py-3">
                                        <p className="font-bold text-gray-900 text-sm">{stripHtml(pkg.title)}</p>
                                        {pkg.badge && <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded mt-0.5">{pkg.badge}</span>}
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
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {pkg.isActive ? "Aktif" : "Pasif"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Link href={`/admin/flix/${pkg.id}`} className="inline-flex p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
