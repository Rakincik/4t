"use client";

import { useState } from "react";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import CourseSortModal from "./CourseSortModal";
import { useRouter } from "next/navigation";

export default function CourseSortButton({ type = "STANDARD" }: { type?: "STANDARD" | "FLIX" }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm"
            >
                <Bars3BottomLeftIcon className="h-5 w-5" />
                Sıralamayı Düzenle
            </button>

            <CourseSortModal 
                isOpen={isModalOpen} 
                type={type}
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => {
                    setIsModalOpen(false);
                    // Refresh the page to show new order
                    router.refresh();
                }} 
            />
        </>
    );
}
