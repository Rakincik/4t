"use client";

import { useState } from "react";
import { revokeAdmin } from "./actions";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function RevokeAdminButton({ adminId, adminEmail }: { adminId: string, adminEmail: string }) {
    const [loading, setLoading] = useState(false);

    const handleRevoke = async () => {
        if (!confirm(`${adminEmail} yetkisini almak istediğinize emin misiniz? (Bu kişi artık sadece öğrenci olacak)`)) {
            return;
        }

        setLoading(true);
        try {
            await revokeAdmin(adminId);
        } catch (error: any) {
            alert(error.message || "Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRevoke}
            disabled={loading}
            className="inline-flex p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Yetkiyi Geri Al"
        >
            <TrashIcon className="w-5 h-5" />
        </button>
    );
}
