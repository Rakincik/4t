"use client";

import { useState } from "react";
import { PlusIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import { createPost } from "./actions";
import { useRouter } from "next/navigation";

export default function CreateBlogForm() {
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);
    const router = useRouter();

    const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
    const labelCls = "block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5";

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!content.trim()) {
            setToast({ message: "Yazı içeriği boş olamaz!", type: "error" });
            setTimeout(() => setToast(null), 3000);
            return;
        }
        setSaving(true);
        try {
            const fd = new FormData(e.currentTarget);
            fd.set("content", content);
            await createPost(fd);
            setToast({ message: "Blog yazısı başarıyla eklendi! Yönlendiriliyorsunuz...", type: "success" });
            setTimeout(() => {
                router.push("/admin/blog");
                router.refresh();
            }, 1500);
        } catch (err: any) {
            setToast({ message: "Kaydedilirken hata oluştu.", type: "error" });
            setTimeout(() => setToast(null), 3000);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 relative">
            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Yeni Yazı Oluştur</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <input type="hidden" name="content" value={content} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelCls}>Yazı Başlığı *</label>
                        <input name="title" placeholder="Örn: 2026 KPSS Hazırlık Rehberi" required className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Kategori</label>
                        <input name="category" placeholder="Örn: KPSS, Genel, Rehberlik" className={inputCls} />
                    </div>
                </div>

                <div>
                    <label className={labelCls}>Kısa Açıklama (Özet)</label>
                    <input name="excerpt" placeholder="Blog listesinde ve arama motorlarında görünecek kısa özet" className={inputCls} />
                </div>

                <div>
                    <label className={labelCls}>Kapak Görseli</label>
                    <div className="flex items-center gap-4 border border-gray-200 px-4 py-3 bg-gray-50/50 rounded-lg">
                        <div className="w-full">
                            <input type="file" name="imageFile" required accept="image/*" className="text-sm focus:outline-none w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            <p className="text-[10px] text-gray-400 mt-1.5">16:9 Oran • Maks 5MB (Önerilen 1200x675)</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className={labelCls}>Yazı İçeriği *</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <RichTextEditor 
                            value={content} 
                            onChange={setContent} 
                            placeholder="Okuyucularınız için harika bir içerik hazırlayın..." 
                            minRows={12} 
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer group">
                        <input type="checkbox" name="isPublished" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        <span className="group-hover:text-blue-600 transition-colors">Hemen Yayınla</span>
                    </label>
                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1221] text-white rounded-lg text-sm font-bold hover:bg-[#1a2744] transition-colors shadow-md disabled:opacity-50">
                        <PlusIcon className="w-5 h-5" /> {saving ? "Kaydediliyor..." : "Yazıyı Kaydet"}
                    </button>
                </div>
            </form>

            {toast && (
                <div className={`fixed bottom-20 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up-fade ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.type === "success" ? <CheckIcon className="w-6 h-6" /> : <XMarkIcon className="w-6 h-6" />}
                    <div>
                        <div className="font-bold text-sm">{toast.type === "success" ? "Başarılı!" : "Hata!"}</div>
                        <div className="text-xs opacity-90">{toast.message}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
