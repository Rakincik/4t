"use client";

import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteStudent } from "./actions";

interface DeleteStudentButtonProps {
    studentId: string;
    studentName: string;
}

export default function DeleteStudentButton({ studentId, studentName }: DeleteStudentButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleDeleteClick(e: React.MouseEvent) {
        e.stopPropagation(); // Prevent triggering the outer Link click wrapper!
        
        const confirmed = window.confirm(
            `⚠️ DİKKAT: "${studentName}" isimli öğrenciyi kalıcı olarak silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz ve öğrenciye ait tüm sipariş geçmişi ile kurs tanımlamaları veritabanından kalıcı olarak silinecektir (Hard Delete).`
        );

        if (!confirmed) return;

        setLoading(true);
        try {
            const res = await deleteStudent(studentId);
            if (res.error) {
                alert(`Hata: ${res.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Öğrenci silinirken beklenmeyen bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDeleteClick}
            disabled={loading}
            className={`p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0 cursor-pointer ${
                loading ? "opacity-50 pointer-events-none" : ""
            }`}
            title="Öğrenciyi Kalıcı Olarak Sil (Hard Delete)"
        >
            <TrashIcon className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
        </button>
    );
}
