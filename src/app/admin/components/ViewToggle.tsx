"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";

interface ViewToggleProps {
    defaultView?: "grid" | "list";
}

export default function ViewToggle({ defaultView = "grid" }: ViewToggleProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    // Convert to URLSearchParams to modify
    const params = new URLSearchParams(searchParams.toString());
    
    // Get current view or fallback to default
    const currentView = params.get("view") || defaultView;

    // Create hrefs for toggles
    const createHref = (viewMode: "grid" | "list") => {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("view", viewMode);
        return `${pathname}?${newParams.toString()}`;
    };

    return (
        <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
            <Link
                href={createHref("grid")}
                className={`p-1.5 rounded-md transition ${
                    currentView === "grid" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                }`}
                title="Kart Görünümü"
            >
                <Squares2X2Icon className="w-5 h-5" />
            </Link>
            <Link
                href={createHref("list")}
                className={`p-1.5 rounded-md transition ${
                    currentView === "list" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                }`}
                title="Liste Görünümü"
            >
                <ListBulletIcon className="w-5 h-5" />
            </Link>
        </div>
    );
}
