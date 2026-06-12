"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface AdminBackButtonProps {
    fallbackUrl?: string;
    fullWidth?: boolean;
}

export default function AdminBackButton({ fallbackUrl = "/admin", fullWidth = false }: AdminBackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => {
                if (window.history.length > 2) {
                    router.back();
                } else {
                    router.push(fallbackUrl);
                }
            }}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition ${fullWidth ? "w-full" : "mr-4"}`}
        >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Geri Dön</span>
        </button>
    );
}
