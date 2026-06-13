"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
    slug: string;
}

export default function DeleteOrgunSubpageButton({ slug }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/page-content?page=orgun-egitim-${slug}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setIsModalOpen(false);
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Silinirken bir hata oluştu.");
            }
        } catch (error) {
            alert("Silinirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsModalOpen(true);
                }}
                className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-600 transition ml-auto"
                title="Sayfayı Sil"
            >
                <TrashIcon className="w-5 h-5" />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900">Alt Sayfayı Sil</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-5">
                            <p className="text-gray-600 text-sm">
                                <strong>/orgun-egitim/{slug}</strong> sayfasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm sayfa içeriği kalıcı olarak silinir.
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
                            >
                                İptal
                            </button>
                            <button 
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? "Siliniyor..." : "Evet, Sil"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
