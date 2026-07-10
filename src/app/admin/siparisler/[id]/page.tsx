import prisma from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { sendMetaCAPI } from "@/lib/meta-capi";

export const dynamic = "force-dynamic";

async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    
    const order = await prisma.order.update({
        where: { id },
        data: { status: status as any },
        include: {
            user: { select: { email: true, name: true, phone: true } }
        }
    });

    if (status === "PAID" && order.user) {
        const names = order.user.name.trim().split(" ");
        const firstName = names[0];
        const lastName = names.slice(1).join(" ") || "";

        sendMetaCAPI({
            eventName: "Purchase",
            email: order.user.email,
            phone: order.user.phone,
            firstName,
            lastName,
            value: order.totalAmount,
            orderId: order.id
        }).catch(err => console.error("Failed to fire Meta CAPI on manual order approval:", err));
    }

    revalidatePath(`/admin/siparisler/${id}`);
}

async function updateNotes(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const notes = formData.get("notes") as string;
    await prisma.order.update({
        where: { id },
        data: { notes },
    });
    revalidatePath(`/admin/siparisler/${id}`);
}

function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    PENDING: { label: "Beklemede", class: "bg-amber-100 text-amber-700 border-amber-200", icon: ClockIcon },
    PAID: { label: "Ödendi", class: "bg-green-100 text-green-700 border-green-200", icon: CheckCircleIcon },
    FAILED: { label: "Başarısız", class: "bg-red-100 text-red-700 border-red-200", icon: XCircleIcon },
    REFUNDED: { label: "İade Edildi", class: "bg-gray-100 text-gray-600 border-gray-200", icon: XCircleIcon },
    CANCELLED: { label: "İptal Edildi", class: "bg-red-50 text-red-600 border-red-100", icon: XCircleIcon },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true, phone: true } },
            items: {
                include: {
                    course: { select: { title: true, slug: true, price: true } },
                    variant: { select: { title: true } },
                    addons: true
                }
            },
        },
    });

    if (!order) notFound();

    const status = statusConfig[order.status] || statusConfig.PENDING;
    const StatusIcon = status.icon;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/siparisler" className="p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sipariş Detayı</h1>
                    <p className="text-gray-500 text-sm font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol — Sipariş Bilgileri */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Durum */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-bold text-gray-700 mb-4">Sipariş Durumu</h2>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${status.class}`}>
                                <StatusIcon className="w-4 h-4" />
                                {status.label}
                            </div>
                            <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                        </div>
                        <form action={updateStatus} className="flex items-center gap-3">
                            <input type="hidden" name="id" value={order.id} />
                            <select name="status" defaultValue={order.status} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                                <option value="PENDING">Beklemede</option>
                                <option value="PAID">Ödendi</option>
                                <option value="FAILED">Başarısız</option>
                                <option value="REFUNDED">İade Edildi</option>
                                <option value="CANCELLED">İptal Edildi</option>
                            </select>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                                Güncelle
                            </button>
                        </form>
                    </div>

                    {/* Ürünler */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-700">Sipariş Kalemleri</h2>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="text-left px-5 py-3 font-medium">Ürün</th>
                                    <th className="text-center px-5 py-3 font-medium">Adet</th>
                                    <th className="text-right px-5 py-3 font-medium">Fiyat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-gray-900 text-sm">{stripHtml(item.course.title)}</p>
                                            {item.variant && (
                                                <p className="text-xs text-blue-600 font-semibold mt-0.5">Seçenek: {item.variant.title}</p>
                                            )}
                                            {item.addons && item.addons.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-2">
                                                    <span className="font-bold text-gray-600">Seçilen Eklentiler:</span>
                                                    {item.addons.map((a: any) => (
                                                        <div key={a.id} className="flex items-center gap-1">
                                                            <span>• {a.addonName}</span>
                                                            <span className="text-gray-400">(+{formatTRY(a.price)})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">/kurs/{item.course.slug}</p>
                                        </td>
                                        <td className="px-5 py-3 text-center text-sm text-gray-600">{item.quantity}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-gray-900 text-sm">{formatTRY(item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-gray-200 bg-gray-50">
                                    <td colSpan={2} className="px-5 py-3 text-right font-bold text-gray-700 text-sm">Toplam</td>
                                    <td className="px-5 py-3 text-right font-bold text-gray-900">{formatTRY(order.totalAmount)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Dekont (Havale Ödemesi ise) */}
                    {order.receiptUrl && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h2 className="text-sm font-bold text-gray-700 mb-3">Öğrenci Dekontu</h2>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <a 
                                    href={order.receiptUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition"
                                >
                                    Dekontu Yeni Sekmede Görüntüle
                                </a>
                                {order.receiptUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) && (
                                    <div className="border border-gray-100 rounded-lg overflow-hidden max-w-sm bg-gray-50 p-2">
                                        <img src={order.receiptUrl} alt="Dekont Önizleme" className="max-h-60 w-auto object-contain rounded" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notlar */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-bold text-gray-700 mb-3">Sipariş Notu</h2>
                        <form action={updateNotes} className="space-y-3">
                            <input type="hidden" name="id" value={order.id} />
                            <textarea
                                name="notes"
                                defaultValue={order.notes || ""}
                                placeholder="Sipariş hakkında not ekleyin..."
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none resize-none"
                            />
                            <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                                Notu Kaydet
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sağ — Müşteri Bilgileri */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-bold text-gray-700 mb-4">Müşteri Bilgileri</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-400">Ad Soyad</p>
                                <p className="font-medium text-gray-900 text-sm">{order.user.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">E-posta</p>
                                <p className="text-sm text-gray-700">{order.user.email}</p>
                            </div>
                            {order.user.phone && (
                                <div>
                                    <p className="text-xs text-gray-400">Telefon</p>
                                    <p className="text-sm text-gray-700">{order.user.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {order.customerName && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h2 className="text-sm font-bold text-gray-700 mb-4">Fatura Bilgileri</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-400">Ad Soyad</p>
                                    <p className="text-sm text-gray-700">{order.customerName}</p>
                                </div>
                                {order.customerEmail && (
                                    <div>
                                        <p className="text-xs text-gray-400">E-posta</p>
                                        <p className="text-sm text-gray-700">{order.customerEmail}</p>
                                    </div>
                                )}
                                {order.customerPhone && (
                                    <div>
                                        <p className="text-xs text-gray-400">Telefon</p>
                                        <p className="text-sm text-gray-700">{order.customerPhone}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Zaman bilgisi */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-bold text-gray-700 mb-3">Tarih Bilgisi</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Oluşturulma</span>
                                <span className="text-gray-700">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Güncelleme</span>
                                <span className="text-gray-700">{formatDate(order.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
