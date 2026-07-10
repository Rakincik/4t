"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface OrderStatusFormProps {
    orderId: string;
    initialStatus: string;
}

export default function OrderStatusForm({ orderId, initialStatus }: OrderStatusFormProps) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId, status }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Güncelleme başarısız oldu.");
            }

            setToast({ message: "Durum başarıyla güncellendi!", type: "success" });
            router.refresh();
            setTimeout(() => {
                setToast(null);
            }, 3000);
        } catch (err: any) {
            setToast({ message: err.message || "Güncellenirken bir hata oluştu.", type: "error" });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-grow sm:max-w-xs">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={loading}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none disabled:opacity-50 font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                        <option value="PENDING">Beklemede</option>
                        <option value="PAID">Ödendi</option>
                        <option value="FAILED">Başarısız</option>
                        <option value="REFUNDED">İade Edildi</option>
                        <option value="CANCELLED">İptal Edildi</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading || status === initialStatus}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-sm ${
                        status === initialStatus
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#0B1221] hover:bg-[#1a2744] active:scale-95 text-white"
                    }`}
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <CheckIcon className="w-4 h-4" />
                            Değişiklikleri Kaydet
                        </>
                    )}
                </button>
            </form>

            {toast && (
                <div className={`fixed bottom-20 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up-fade ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.type === "success" ? <CheckIcon className="w-6 h-6 shrink-0" /> : <XMarkIcon className="w-6 h-6 shrink-0" />}
                    <div>
                        <div className="font-bold text-sm">{toast.type === "success" ? "Başarılı!" : "Hata!"}</div>
                        <div className="text-xs opacity-90">{toast.message}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
