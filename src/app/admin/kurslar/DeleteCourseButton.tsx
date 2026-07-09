"use client";

import { useState } from "react";
import { TrashIcon, ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { deleteCourse } from "./actions";
import { useRouter } from "next/navigation";

interface Props {
    id: string;
    title: string;
}

export default function DeleteCourseButton({ id, title }: Props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleDelete() {
        setDeleting(true);
        setErrorMsg(null);
        try {
            const res = await deleteCourse(id);
            if (res.success) {
                setIsOpen(false);
                router.refresh();
            } else {
                setErrorMsg(res.error || "Silme işlemi başarısız oldu.");
            }
        } catch (error) {
            setErrorMsg("Silme işlemi sırasında sunucu bağlantı hatası oluştu.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <button
                onClick={() => {
                    setErrorMsg(null);
                    setIsOpen(true);
                }}
                className="p-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
                title="Kursa Ait Tüm Bilgileri Sil"
            >
                <TrashIcon className="h-4 w-4" />
            </button>

            {/* Premium Deletion Confirmation Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !deleting && setIsOpen(false)}
                    />

                    {/* Modal Content Card */}
                    <div className="relative bg-white rounded-3xl border border-black/10 shadow-2xl p-6 max-w-md w-full z-10 transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
                        
                        {/* Close button */}
                        <button
                            onClick={() => !deleting && setIsOpen(false)}
                            disabled={deleting}
                            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            {/* Warning Icon Badge */}
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4 border border-red-100">
                                <ExclamationTriangleIcon className="h-6 w-6" />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Kursu Silmek İstediğinize Emin misiniz?
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
                                <strong className="text-gray-900">"{title}"</strong> isimli kurs kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                            </p>

                            {/* Dynamically Display Error messages */}
                            {errorMsg && (
                                <div className="w-full mb-6 p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-100 leading-relaxed text-left">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    disabled={deleting}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition active:scale-98 disabled:opacity-50"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    {deleting ? (
                                        <>
                                            <span className="w-4.5 h-4.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Siliniyor...
                                        </>
                                    ) : (
                                        "Evet, Sil"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
