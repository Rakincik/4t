"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface FaqItem {
    q: string;
    a: string;
}

interface DynamicFaqBlockProps {
    items: FaqItem[];
    title?: string;
    description?: string;
}

export default function DynamicFaqBlock({ 
    items, 
    title = "Sıkça Sorulan Sorular", 
    description = "Aklınıza takılan soruların cevaplarını burada bulabilirsiniz."
}: DynamicFaqBlockProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (!items || items.length === 0) return null;

    return (
        <section className="w-full bg-white py-20 border-t border-gray-100">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4">
                        <QuestionMarkCircleIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1221] tracking-tight mb-4">
                        {title}
                    </h2>
                    <div className="text-lg text-gray-500 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: description }} />
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {items.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                                    isOpen 
                                        ? "border-blue-200 bg-white shadow-lg shadow-blue-900/5 ring-4 ring-blue-50" 
                                        : "border-gray-200 bg-gray-50 hover:bg-gray-100/50 hover:border-gray-300"
                                }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <span className={`text-base sm:text-lg font-bold pr-8 ${isOpen ? "text-blue-900" : "text-gray-900"}`}>
                                        {item.q}
                                    </span>
                                    <ChevronDownIcon 
                                        className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                                            isOpen ? "rotate-180 text-blue-600" : "text-gray-400"
                                        }`} 
                                    />
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="px-6 pb-6 pt-0">
                                        <div className="w-full h-px bg-gray-100 mb-4" />
                                        <div 
                                            className="text-gray-600 leading-relaxed whitespace-pre-line text-base prose prose-sm max-w-none prose-p:my-1"
                                            dangerouslySetInnerHTML={{ __html: item.a }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
