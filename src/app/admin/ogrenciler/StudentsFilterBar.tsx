"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    MagnifyingGlassIcon, 
    FunnelIcon,
    ArrowDownTrayIcon,
    ArrowsUpDownIcon
} from "@heroicons/react/24/outline";
import { 
    ChevronDownIcon, 
    CheckIcon
} from "@heroicons/react/24/solid";

interface StudentsFilterBarProps {
    courses: { id: string; title: string }[];
}

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export default function StudentsFilterBar({ courses }: StudentsFilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States from URL
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [courseId, setCourseId] = useState(searchParams.get("courseId") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "");
    
    const [isCourseOpen, setIsCourseOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    
    const courseRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Click outside to close dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (courseRef.current && !courseRef.current.contains(event.target as Node)) {
                setIsCourseOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync filters with URL on change
    useEffect(() => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (courseId) params.set("courseId", courseId);
        if (sort) params.set("sort", sort);

        const qs = params.toString();
        router.push(qs ? `?${qs}` : "?");
    }, [courseId, sort, router]);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (search.trim()) {
            params.set("search", search.trim());
        } else {
            params.delete("search");
        }
        router.push(`?${params.toString()}`);
    }

    const cleanCourses = courses.map(c => ({ id: c.id, title: stripHtml(c.title) }));
    const selectedCourse = cleanCourses.find(c => c.id === courseId);

    const sortOptions = [
        { value: "", label: "Tarih: En Yeni" },
        { value: "date_asc", label: "Tarih: En Eski" },
        { value: "spent_desc", label: "Harcama: Azalan" },
        { value: "spent_asc", label: "Harcama: Artan" },
        { value: "courses_desc", label: "Kurs Sayısı: Azalan" },
        { value: "courses_asc", label: "Kurs Sayısı: Artan" }
    ];
    const selectedSort = sortOptions.find(o => o.value === sort) || sortOptions[0];

    // Construct Export Excel Link
    const exportUrl = `/api/admin/students/export-csv?search=${encodeURIComponent(search.trim())}&courseId=${encodeURIComponent(courseId)}`;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4 shadow-sm">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <MagnifyingGlassIcon className="w-4 h-4" />
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="İsim, e-posta veya telefon ile arayın..."
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
            </form>

            <div className="flex flex-wrap items-center gap-3">
                {/* Modern Course Filter Dropdown */}
                <div className="relative inline-block text-left" ref={courseRef}>
                    <button
                        type="button"
                        onClick={() => setIsCourseOpen(!isCourseOpen)}
                        className="inline-flex items-center justify-between w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-bold bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[170px]"
                    >
                        <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                            <FunnelIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{selectedCourse ? selectedCourse.title : "Tüm Kurslar"}</span>
                        </div>
                        <ChevronDownIcon className={`w-3.5 h-3.5 ml-1 text-gray-400 shrink-0 transition-transform duration-200 ${isCourseOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isCourseOpen && (
                        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 ring-1 ring-black/5 max-h-60 overflow-y-auto animate-fade-in">
                            <div className="space-y-0.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCourseId("");
                                        setIsCourseOpen(false);
                                    }}
                                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                        !courseId 
                                            ? "bg-[#DC2626]/5 text-[#DC2626]" 
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    Tüm Kurslar
                                    {!courseId && <CheckIcon className="w-3.5 h-3.5 text-[#DC2626]" />}
                                </button>
                                {cleanCourses.map((c) => {
                                    const isSelected = c.id === courseId;
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                                setCourseId(c.id);
                                                setIsCourseOpen(false);
                                            }}
                                            className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                                isSelected 
                                                    ? "bg-[#DC2626]/5 text-[#DC2626]" 
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        >
                                            <span className="truncate pr-2">{c.title}</span>
                                            {isSelected && <CheckIcon className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modern Sort Dropdown */}
                <div className="relative inline-block text-left" ref={sortRef}>
                    <button
                        type="button"
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="inline-flex items-center justify-between w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-bold bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[160px]"
                    >
                        <div className="flex items-center gap-1.5">
                            <ArrowsUpDownIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{selectedSort.label}</span>
                        </div>
                        <ChevronDownIcon className={`w-3.5 h-3.5 ml-1 text-gray-400 shrink-0 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isSortOpen && (
                        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 ring-1 ring-black/5 animate-fade-in">
                            <div className="space-y-0.5">
                                {sortOptions.map((opt) => {
                                    const isSelected = opt.value === sort;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                setSort(opt.value);
                                                setIsSortOpen(false);
                                            }}
                                            className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                                isSelected 
                                                    ? "bg-[#DC2626]/5 text-[#DC2626]" 
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        >
                                            {opt.label}
                                            {isSelected && <CheckIcon className="w-3.5 h-3.5 text-[#DC2626]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Export Excel Button */}
                <a
                    href={exportUrl}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition shadow-sm cursor-pointer whitespace-nowrap"
                    title="Öğrenci Listesini Excel Olarak İndir"
                >
                    <ArrowDownTrayIcon className="w-4 h-4 shrink-0" />
                    Excel İndir
                </a>
            </div>
        </div>
    );
}
