"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function CreateOrgunSubpageButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slugInput, setSlugInput] = useState("");

    const handleCreate = () => {
        if (!slugInput.trim()) {
            alert("Lütfen bir URL uzantısı girin.");
            return;
        }

        // Basit bir slug dönüştürücü (boşlukları tire yap, küçük harfe çevir)
        const slug = slugInput
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        if (!slug) {
            alert("Geçersiz bir isim girdiniz.");
            return;
        }

        setLoading(true);
        setIsModalOpen(false);
        // Yeni slug'a yönlendiriyoruz. Sayfa henüz veritabanında olmasa bile
        // editörde Kaydet butonuna basıldığında otomatik oluşturulacaktır.
        router.push(`/admin/sayfalar/orgun-egitim/${slug}`);
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
                className="group bg-blue-50/50 hover:bg-blue-50 border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition cursor-pointer min-h-[100px]"
            >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <PlusIcon className="w-5 h-5" />
                </div>
                <div className="text-center mt-2">
                    <h3 className="font-bold text-blue-900 text-sm">Yeni Alt Sayfa Ekle</h3>
                    <p className="text-[10px] text-blue-600/70 mt-1">Örn: KPSS-A, DGS vb.</p>
                </div>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900">Yeni Alt Sayfa Oluştur</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-5 space-y-4">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    URL Formatı Nasıl Olmalı?
                                </h4>
                                <ul className="text-sm text-yellow-700 space-y-1 ml-5 list-disc">
                                    <li>Sadece <strong>İngilizce karakterler</strong> ve <strong>rakamlar</strong> kullanın.</li>
                                    <li>Boşluk yerine <strong>tire (-)</strong> işareti kullanın.</li>
                                    <li>Örnek Doğru Kullanım: <strong>kpssa</strong>, <strong>dgs</strong>, <strong>kpss-a</strong></li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Sayfa URL Uzantısı (Slug)
                                </label>
                                <div className="flex items-center">
                                    <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm font-mono whitespace-nowrap">
                                        /orgun-egitim/
                                    </span>
                                    <input 
                                        type="text"
                                        value={slugInput}
                                        onChange={(e) => setSlugInput(e.target.value)}
                                        placeholder="ornek-kpssa"
                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-gray-900"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleCreate();
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
                            >
                                İptal
                            </button>
                            <button 
                                onClick={handleCreate}
                                disabled={!slugInput.trim() || loading}
                                className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? "Oluşturuluyor..." : "Oluştur ve Düzenle"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
