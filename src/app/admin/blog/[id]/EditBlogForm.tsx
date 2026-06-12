"use client";

import { useState } from "react";
import { CheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import { updatePost } from "../actions";
import Link from "next/link";

export default function EditBlogForm({ post }: { post: any }) {
    const [content, setContent] = useState(post.content || "");
    const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
    const labelCls = "block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Yazıyı Düzenle</h1>
                    <p className="text-gray-500 text-sm">{post.title}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <form action={updatePost} className="space-y-6">
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="currentImageUrl" value={post.imageUrl || ""} />
                    <input type="hidden" name="content" value={content} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelCls}>Yazı Başlığı *</label>
                            <input name="title" defaultValue={post.title} placeholder="Yazı Başlığı *" required className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Kategori</label>
                            <input name="category" defaultValue={post.category || ""} placeholder="Kategori (örn: KPSS, Genel)" className={inputCls} />
                        </div>
                    </div>
                    
                    <div>
                        <label className={labelCls}>Kısa Açıklama (Özet)</label>
                        <input name="excerpt" defaultValue={post.excerpt || ""} placeholder="Kısa Açıklama (Özet)" className={inputCls} />
                    </div>

                    <div>
                        <label className={labelCls}>Kapak Görseli</label>
                        <div className="flex items-center gap-4 border border-gray-200 px-4 py-3 bg-gray-50/50 rounded-lg">
                            <div className="w-full">
                                <input type="file" name="imageFile" accept="image/*" className="text-sm focus:outline-none w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                <p className="text-[10px] text-gray-400 mt-1.5">16:9 Oran • Maks 5MB (Önerilen 1200x675)</p>
                            </div>
                            {post.imageUrl && (
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded font-bold whitespace-nowrap border border-emerald-100">
                                    Mevcut görsel yüklü
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label className={labelCls}>Yazı İçeriği *</label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <RichTextEditor 
                                value={content} 
                                onChange={setContent} 
                                placeholder="Okuyucularınız için harika bir içerik hazırlayın..." 
                                minRows={16} 
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1221] text-white rounded-lg font-bold hover:bg-[#1a2744] transition-colors shadow-md">
                            <CheckIcon className="w-5 h-5" /> Değişiklikleri Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
