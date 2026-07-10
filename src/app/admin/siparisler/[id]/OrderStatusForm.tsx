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
            <form onSubmit={handleUpdate} className="flex items-center gap-3">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none disabled:opacity-50"
                >
                    <option value="PENDING">Beklemede</option>
                    <option value="PAID">Ödendi</option>
                    <option value="FAILED">Başarısız</option>
                    <option value="REFUNDED">İade Edildi</option>
                    <option value="CANCELLED">İptal Edildi</option>
                </select>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                    {loading ? (
                        <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Güncelleniyor...
                        </>
                    ) : (
                        "Güncelle"
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
