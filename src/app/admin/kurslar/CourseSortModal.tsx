"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { XMarkIcon, Bars3Icon, ArrowPathIcon, CheckIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

type CourseItem = {
    id: string;
    title: string;
    category: string | null;
    imageUrl: string | null;
    sortOrder: number;
};

interface CourseSortModalProps {
    isOpen: boolean;
    type?: "STANDARD" | "FLIX";
    onClose: () => void;
    onSuccess: () => void;
}

export default function CourseSortModal({ isOpen, type = "STANDARD", onClose, onSuccess }: CourseSortModalProps) {
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("TÜMÜ");
    
    // Original state is used for the smart-sort algorithm
    const [originalCourses, setOriginalCourses] = useState<CourseItem[]>([]);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
        }
    }, [isOpen]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            // Fetch courses based on type
            const res = await fetch(`/api/admin/courses?limit=1000&type=${type}`);
            const data = await res.json();
            
            const coursesArray = Array.isArray(data) ? data : (data.courses || []);
            
            if (coursesArray.length >= 0) {
                const sorted = coursesArray.sort((a: CourseItem, b: CourseItem) => (a.sortOrder || 999) - (b.sortOrder || 999));
                setCourses(sorted);
                setOriginalCourses(sorted);

                // Extract unique categories
                const cats = new Set<string>();
                sorted.forEach((c: CourseItem) => {
                    if (c.category) cats.add(c.category);
                });
                setCategories(Array.from(cats));
                setSelectedCategory("TÜMÜ");
            }
        } catch (e) {
            console.error("Failed to fetch courses for sorting", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        
        let _courses = [...courses];
        // Get the dragged item
        const draggedItemContent = _courses.splice(dragItem.current, 1)[0];
        // Insert it at the new position
        _courses.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        
        setCourses(_courses);
    };

    const moveToTop = (index: number) => {
        if (index === 0) return;
        let _courses = [...courses];
        const item = _courses.splice(index, 1)[0];
        _courses.unshift(item);
        setCourses(_courses);
    };

    const moveToBottom = (index: number) => {
        if (index === courses.length - 1) return;
        let _courses = [...courses];
        const item = _courses.splice(index, 1)[0];
        _courses.push(item);
        setCourses(_courses);
    };

    const handleSave = async () => {
        setSaving(true);
        
        try {
            // Simply map the entire `courses` array to update their sortOrder
            // based on their current visual order. The first item becomes 1, second 2, etc.
            const updates = courses.map((item, index) => ({
                id: item.id,
                sortOrder: index + 1
            }));

            // 5. Send to API
            const res = await fetch("/api/admin/courses/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert("Sıralama kaydedilirken bir hata oluştu.");
            }
        } catch (e) {
            console.error(e);
            alert("Sıralama kaydedilirken bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    // Filter courses for display
    const displayedCourses = courses.filter(c => selectedCategory === "TÜMÜ" || c.category === selectedCategory);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Sıralamayı Düzenle</h2>
                        <p className="text-xs text-gray-500">Ürünleri farenizle sürükleyip bırakarak sıralayabilirsiniz.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-100 bg-white">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Kategori Filtresi</label>
                    <select 
                        className="w-full sm:w-1/2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="TÜMÜ">Tüm Kurslar (Global Sıralama)</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {selectedCategory !== "TÜMÜ" && (
                        <p className="mt-2 text-xs text-blue-600 font-medium">
                            Not: Sadece {selectedCategory} kategorisindeki ürünleri sıralıyorsunuz. Bu işlem diğer kategorilerdeki ürünlerin sırasını bozmaz.
                        </p>
                    )}
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-sm font-medium">Kurslar yükleniyor...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayedCourses.map((course, index) => {
                                // Find the index in the MAIN array to correctly splice it
                                const mainIndex = courses.findIndex(c => c.id === course.id);
                                
                                return (
                                    <div 
                                        key={course.id}
                                        draggable
                                        onDragStart={() => (dragItem.current = mainIndex)}
                                        onDragEnter={() => (dragOverItem.current = mainIndex)}
                                        onDragEnd={handleSort}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="group flex items-center gap-4 bg-white p-3 pr-4 rounded-xl border border-gray-200 shadow-sm cursor-move hover:shadow-md hover:border-blue-300 transition-all"
                                    >
                                        <div className="cursor-move p-2 text-gray-400 group-hover:text-blue-500">
                                            <Bars3Icon className="w-6 h-6" />
                                        </div>
                                        
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                                            {course.imageUrl ? (
                                                <Image src={course.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-300">4T</div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-gray-900 truncate" dangerouslySetInnerHTML={{ __html: course.title }} />
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 font-bold uppercase tracking-wider rounded">
                                                    {course.category || "Genel"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quick Move Buttons */}
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => moveToTop(mainIndex)}
                                                className="px-2 py-1 bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 rounded text-[10px] font-bold flex items-center gap-1 transition"
                                                title="En Başa Taşı"
                                            >
                                                <ChevronUpIcon className="w-3 h-3" />
                                            </button>
                                            <button 
                                                onClick={() => moveToBottom(mainIndex)}
                                                className="px-2 py-1 bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 rounded text-[10px] font-bold flex items-center gap-1 transition"
                                                title="En Sona Taşı"
                                            >
                                                <ChevronDownIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition"
                    >
                        İptal
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0B1221] text-white text-sm font-bold rounded-xl hover:bg-[#1a2744] shadow-lg transition disabled:opacity-50"
                    >
                        {saving ? (
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        ) : (
                            <CheckIcon className="w-5 h-5" />
                        )}
                        Sıralamayı Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}
