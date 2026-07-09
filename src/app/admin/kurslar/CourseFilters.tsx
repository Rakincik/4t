"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function CourseFilters({ categories = [] }: { categories?: string[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [type, setType] = useState(searchParams.get("type") || "");

    const applyFilters = (newQuery: string, newSort: string, newCategory: string, newStatus: string, newType: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (newQuery) params.set("q", newQuery);
        else params.delete("q");
        
        if (newSort !== "newest") params.set("sort", newSort);
        else params.delete("sort");

        if (newCategory) params.set("category", newCategory);
        else params.delete("category");

        if (newStatus) params.set("status", newStatus);
        else params.delete("status");

        if (newType) params.set("type", newType);
        else params.delete("type");

        // Reset page on filter change
        params.delete("page");

        router.push(pathname + "?" + params.toString());
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(query, sort, category, status, type);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSort = e.target.value;
        setSort(selectedSort);
        applyFilters(query, selectedSort, category, status, type);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        applyFilters(query, sort, selectedCategory, status, type);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = e.target.value;
        setStatus(selectedStatus);
        applyFilters(query, sort, category, selectedStatus, type);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        setType(selectedType);
        applyFilters(query, sort, category, status, selectedType);
    };

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
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
                    <option value="views-desc">Ziyaret Sayısına Göre (Çok Tıklanan)</option>
                    <option value="oldest">En Eski Eklenenler</option>
                    <option value="title-asc">İsme Göre (A-Z)</option>
                    <option value="title-desc">İsme Göre (Z-A)</option>
                    <option value="price-asc">Fiyata Göre (Artan)</option>
                    <option value="price-desc">Fiyata Göre (Azalan)</option>
                </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white cursor-pointer"
                >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white cursor-pointer"
                >
                    <option value="">Tüm Durumlar</option>
                    <option value="active">Sadece Aktifler</option>
                    <option value="inactive">Sadece Pasifler</option>
                </select>

                <select
                    value={type}
                    onChange={handleTypeChange}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white cursor-pointer"
                >
                    <option value="">Tüm Türler</option>
                    <option value="VIDEO">Video Eğitim</option>
                    <option value="OFFLINE">Offline Eğitim</option>
                    <option value="ONLINE">Online Eğitim</option>
                </select>
            </div>
        </div>
    );
}
