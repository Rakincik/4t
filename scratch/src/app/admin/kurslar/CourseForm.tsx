"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeftIcon,
    PhotoIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { createCourse, updateCourse } from "./actions";

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    oldPrice: number | null;
    imageUrl: string | null;
    category: string | null;
    isActive: boolean;
}

interface CourseFormProps {
    mode: "create" | "edit";
    course?: Course;
}

const CATEGORIES = [
    { value: "kaymakamlik", label: "Kaymakamlık" },
    { value: "kpss-a", label: "KPSS A" },
    { value: "hakimlik", label: "Hakimlik" },
    { value: "sayistay", label: "Sayıştay" },
    { value: "osym", label: "ÖSYM" },
    { value: "flix", label: "FLIX" },
];

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export default function CourseForm({ mode, course }: CourseFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState(course?.title || "");
    const [slug, setSlug] = useState(course?.slug || "");
    const [description, setDescription] = useState(course?.description || "");
    const [price, setPrice] = useState(course?.price?.toString() || "");
    const [oldPrice, setOldPrice] = useState(course?.oldPrice?.toString() || "");
    const [imageUrl, setImageUrl] = useState(course?.imageUrl || "");
    const [category, setCategory] = useState(course?.category || "");
    const [isActive, setIsActive] = useState(course?.isActive ?? true);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (mode === "create") {
            setSlug(slugify(value));
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("slug", slug);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("oldPrice", oldPrice);
            formData.append("imageUrl", imageUrl);
            formData.append("category", category);
            formData.append("isActive", isActive.toString());

            if (mode === "create") {
                await createCourse(formData);
            } else if (course) {
                await updateCourse(course.id, formData);
            }

            router.push("/admin/kurslar");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Bir hata oluştu");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Back link */}
            <Link
                href="/admin/kurslar"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Kurslara Dön
            </Link>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Main form card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kurs Adı *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Kaymakamlık Komple Paket 2024"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug *
                    </label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            /kurs/
                        </span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="flex-1 rounded-r-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="kaymakamlik-paketi-2024"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Kurs hakkında kısa açıklama..."
                    />
                </div>

                {/* Price Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fiyat (₺) *
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            min="0"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="12500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Eski Fiyat (₺)
                        </label>
                        <input
                            type="number"
                            value={oldPrice}
                            onChange={(e) => setOldPrice(e.target.value)}
                            min="0"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="18000 (İndirim göstermek için)"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <option value="">Kategori Seçin</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Görsel URL
                    </label>
                    <div className="space-y-3">
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="https://..."
                        />
                        {imageUrl ? (
                            <div className="relative w-48 h-32 rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-48 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                <PhotoIcon className="w-8 h-8" />
                            </div>
                        )}
                        <p className="text-xs text-gray-500">
                            Görsel URL girin. Cloudinary, Unsplash vb. kullanabilirsiniz.
                        </p>
                    </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? "bg-primary" : "bg-gray-200"
                            }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        {isActive ? "Aktif (Sitede görünür)" : "Pasif (Sitede görünmez)"}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
                >
                    {saving ? (
                        "Kaydediliyor..."
                    ) : (
                        <>
                            <CheckIcon className="h-5 w-5" />
                            {mode === "create" ? "Kurs Oluştur" : "Kaydet"}
                        </>
                    )}
                </button>
                <Link
                    href="/admin/kurslar"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                >
                    <XMarkIcon className="h-5 w-5" />
                    İptal
                </Link>
            </div>
        </form>
    );
}
