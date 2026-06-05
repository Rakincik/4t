import Link from "next/link";
import { PlusIcon, ShieldExclamationIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { getAdmins } from "./actions";
import RevokeAdminButton from "./RevokeAdminButton";

export const dynamic = "force-dynamic";

export default async function AdminYoneticilerPage() {
    const admins = await getAdmins();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Yöneticiler</h1>
                    <p className="text-gray-500 text-sm">Sisteme tam erişimi olan yönetici hesaplarını yönetin.</p>
                </div>
                <Link
                    href="/admin/yoneticiler/ekle"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg"
                >
                    <PlusIcon className="w-4 h-4" />
                    Yeni Yönetici Ekle
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {admins.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShieldExclamationIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz Yönetici Yok</h3>
                        <p className="text-gray-400 text-sm mb-6">Sistemde kayıtlı bir yönetici bulunamadı.</p>
                        <Link href="/admin/yoneticiler/ekle" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                            <PlusIcon className="w-4 h-4" /> Yönetici Ekle
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                <th className="px-6 py-4 font-semibold">Ad Soyad</th>
                                <th className="px-6 py-4 font-semibold">E-Posta</th>
                                <th className="px-6 py-4 font-semibold">Kayıt Tarihi</th>
                                <th className="px-6 py-4 font-semibold">Rol</th>
                                <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                                {admin.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-gray-900 text-sm">{admin.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600 text-sm">{admin.email}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(admin.createdAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
                                            Yönetici
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/yoneticiler/duzenle/${admin.id}`}
                                                className="inline-flex p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Düzenle"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <RevokeAdminButton adminId={admin.id} adminEmail={admin.email} />
                                        </div>
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
