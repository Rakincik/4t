"use client";

import React, { useState } from "react";
import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { deleteStudent } from "./actions";

interface DeleteStudentButtonProps {
    studentId: string;
    studentName: string;
}

export default function DeleteStudentButton({ studentId, studentName }: DeleteStudentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    async function handleConfirmDelete(e: React.MouseEvent) {
        e.stopPropagation();
        setLoading(true);
        try {
            const res = await deleteStudent(studentId);
            if (res.error) {
                alert(`Hata: ${res.error}`);
            }
            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert("Öğrenci silinirken beklenmeyen bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowModal(true);
                }}
                disabled={loading}
                className={`p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0 cursor-pointer ${
                    loading ? "opacity-50 pointer-events-none" : ""
                }`}
                title="Öğrenciyi Kalıcı Olarak Sil"
            >
                <TrashIcon className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
            </button>

            {showModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Öğrenciyi Silmek İstediğinize Emin Misiniz?
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                <strong className="text-gray-900">{studentName}</strong> isimli öğrenciyi kalıcı olarak silmek üzeresiniz.
                                Bu işlem geri alınamaz ve öğrenciye ait tüm sipariş geçmişi ile kurs tanımlamaları veritabanından kalıcı olarak silinecektir.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModal(false);
                                }}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Siliniyor...
                                    </>
                                ) : (
                                    "Evet, Kalıcı Olarak Sil"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
