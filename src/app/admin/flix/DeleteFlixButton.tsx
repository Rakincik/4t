"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteFlixPackage } from "./actions";
import { useRouter } from "next/navigation";

interface Props {
    id: string;
    title: string;
}

export default function DeleteFlixButton({ id, title }: Props) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteFlixPackage(id);
            router.refresh();
            setShowModal(false);
        } catch (error) {
            alert("Silme işlemi başarısız oldu.");
        } finally {
            setDeleting(false);
        }
    }

    // Başlıktan HTML tag'lerini temizle
    const cleanTitle = title.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={deleting}
                className="inline-flex p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-2 disabled:opacity-50"
                title="Sil"
            >
                <TrashIcon className="w-4 h-4" />
            </button>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                                <TrashIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">FLIX Paketini Sil</h3>
                            <p className="text-gray-500 text-sm">
                                <strong className="text-gray-700">{cleanTitle}</strong> adlı paketi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                            </p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button 
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting ? "Siliniyor..." : "Evet, Sil"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
