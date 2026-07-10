"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    MagnifyingGlassIcon, 
    FunnelIcon, 
    ArrowsUpDownIcon 
} from "@heroicons/react/24/outline";
import { 
    ChevronDownIcon, 
    CheckIcon,
    CreditCardIcon
} from "@heroicons/react/24/solid";

interface DropdownSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    icon?: React.ReactNode;
    placeholder?: string;
}

function DropdownSelect({ value, onChange, options, icon, placeholder }: DropdownSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-between w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-bold bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[150px]"
            >
                <div className="flex items-center gap-1.5">
                    {icon}
                    <span>{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDownIcon className={`w-3.5 h-3.5 ml-1 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 ring-1 ring-black/5 animate-fade-in">
                    <div className="space-y-0.5">
                        {options.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
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
    );
}

export default function OrdersFilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read initial states from URL
    const [q, setQ] = useState(searchParams.get("q") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [method, setMethod] = useState(searchParams.get("method") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "");

    // Trigger URL update on state change
    useEffect(() => {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (status) params.set("status", status);
        if (method) params.set("method", method);
        if (sort) params.set("sort", sort);

        const queryString = params.toString();
        router.push(queryString ? `?${queryString}` : "?");
    }, [status, method, sort, router]);

    // Handle search form submit
    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (q.trim()) {
            params.set("q", q.trim());
        } else {
            params.delete("q");
        }
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4 shadow-sm">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <MagnifyingGlassIcon className="w-4 h-4" />
                </span>
                <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Müşteri adı, e-posta veya sipariş ID ara..."
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
            </form>

            <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <DropdownSelect
                    value={status}
                    onChange={setStatus}
                    icon={<FunnelIcon className="w-3.5 h-3.5 text-gray-400" />}
                    options={[
                        { value: "", label: "Tüm Durumlar" },
                        { value: "PAID", label: "Ödendi" },
                        { value: "PENDING", label: "Bekliyor" },
                        { value: "FAILED", label: "Başarısız" },
                        { value: "REFUNDED", label: "İade Edildi" },
                        { value: "CANCELLED", label: "İptal Edildi" }
                    ]}
                />

                {/* Payment Method Filter */}
                <DropdownSelect
                    value={method}
                    onChange={setMethod}
                    icon={<CreditCardIcon className="w-3.5 h-3.5 text-gray-400" />}
                    options={[
                        { value: "", label: "Tüm Ödemeler" },
                        { value: "CC", label: "Kredi Kartı" },
                        { value: "EFT", label: "Havale / EFT" }
                    ]}
                />

                {/* Sort Order */}
                <DropdownSelect
                    value={sort}
                    onChange={setSort}
                    icon={<ArrowsUpDownIcon className="w-3.5 h-3.5 text-gray-400" />}
                    options={[
                        { value: "", label: "Tarih: En Yeni" },
                        { value: "date_asc", label: "Tarih: En Eski" },
                        { value: "amount_desc", label: "Tutar: Azalan" },
                        { value: "amount_asc", label: "Tutar: Artan" }
                    ]}
                />
            </div>
        </div>
    );
}
