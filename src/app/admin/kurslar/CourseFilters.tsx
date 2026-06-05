"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function CourseFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");

    // Debounce is ideal, but for simplicity we will just push on Enter or button click, 
    // or just use a small delay. We'll use a standard onChange for select and onSubmit for form.
    
    const applyFilters = (newQuery: string, newSort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newQuery) {
            params.set("q", newQuery);
        } else {
            params.delete("q");
        }
        
        if (newSort !== "newest") {
            params.set("sort", newSort);
        } else {
            params.delete("sort");
        }

        router.push(pathname + "?" + params.toString());
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(query, sort);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSort = e.target.value;
        setSort(selectedSort);
        applyFilters(query, selectedSort);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Kurs adı ile ara..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
            </form>
            
            <select
                value={sort}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none sm:w-48 bg-white cursor-pointer"
            >
                <option value="newest">En Yeni Eklenenler</option>
                <option value="oldest">En Eski Eklenenler</option>
                <option value="title-asc">İsme Göre (A-Z)</option>
                <option value="title-desc">İsme Göre (Z-A)</option>
                <option value="price-asc">Fiyata Göre (Artan)</option>
                <option value="price-desc">Fiyata Göre (Azalan)</option>
            </select>
        </div>
    );
}
