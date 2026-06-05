"use client";

import { useState, useCallback, useEffect } from "react";
import { DocumentTextIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import RichTextEditor from "@/app/admin/components/RichTextEditor";

type TabId = "kvkk" | "gizlilik-politikasi" | "iade-sartlari" | "mesafeli-satis";

const TABS: Record<TabId, string> = {
    "kvkk": "KVKK",
    "gizlilik-politikasi": "Gizlilik",
    "iade-sartlari": "İptal ve İade",
    "mesafeli-satis": "Mesafeli Satış",
};

export default function SozlesmelerEditor() {
    const [activeTab, setActiveTab] = useState<TabId>("kvkk");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [hasChanges, setHasChanges] = useState(false);

    // Data State
    const [data, setData] = useState<Record<TabId, string>>({
        "kvkk": "",
        "gizlilik-politikasi": "",
        "iade-sartlari": "",
        "mesafeli-satis": "",
    });

    // Load from DB
    const loadData = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/page-content?page=sozlesmeler");
            const result = await res.json();
            
            // Result is expected to be an object with keys matching TabId
            if (result && Object.keys(result).length > 0) {
                setData(prev => ({
                    ...prev,
                    "kvkk": result["kvkk"]?.content || "",
                    "gizlilik-politikasi": result["gizlilik-politikasi"]?.content || "",
                    "iade-sartlari": result["iade-sartlari"]?.content || "",
                    "mesafeli-satis": result["mesafeli-satis"]?.content || "",
                }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setTimeout(() => setHasChanges(false), 500); // give time for state to settle
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleDataChange = (val: string) => {
        setData(prev => ({ ...prev, [activeTab]: val }));
        if (!loading) setHasChanges(true); // Don't track before initial load
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveStatus("saving");
        try {
            const payload = {
                pageSlug: "sozlesmeler",
                sections: {
                    "kvkk": { content: data["kvkk"] },
                    "gizlilik-politikasi": { content: data["gizlilik-politikasi"] },
                    "iade-sartlari": { content: data["iade-sartlari"] },
                    "mesafeli-satis": { content: data["mesafeli-satis"] },
                }
            };
            
            await fetch("/api/admin/page-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            setSaveStatus("saved");
            setHasChanges(false);
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (e) {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Yükleniyor...</div>;
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Header */}
            <header className="shrink-0 bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#0B1221] tracking-tight">Yasal Metinler & Sözleşmeler</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Sitenin alt kısmında yer alan yasal uyarı sayfalarının metinlerini düzenleyin.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {saveStatus === "saved" && <span className="text-sm font-bold text-green-600 flex items-center gap-1"><CheckIcon className="w-4 h-4" /> Kaydedildi</span>}
                    {saveStatus === "error" && <span className="text-sm font-bold text-red-600 flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4" /> Hata oluştu</span>}
                    {hasChanges && saveStatus === "idle" && <span className="text-xs font-bold text-amber-500 uppercase tracking-widest animate-pulse">Kaydedilmemiş Değişiklikler</span>}
                    
                    <button
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1221] px-6 py-2.5 font-bold text-white shadow-lg hover:shadow-xl hover:bg-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">
                {/* Tabs / Menu Sidebar */}
                <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 space-y-2 shrink-0">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-4">Sözleşmeler</div>
                    {(Object.keys(TABS) as TabId[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                activeTab === tab 
                                ? "bg-white font-bold text-blue-800 shadow-sm border border-blue-100" 
                                : "text-gray-600 hover:bg-gray-200/50 font-medium"
                            }`}
                        >
                            <DocumentTextIcon className={`w-5 h-5 ${activeTab === tab ? "text-blue-600" : "text-gray-400"}`} />
                            {TABS[tab]}
                        </button>
                    ))}
                </div>

                {/* Editor Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-4xl">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{TABS[activeTab]} Metni</h2>
                            <p className="text-sm text-gray-500 mt-1">Bu metin <code>/yasal/{activeTab}</code> adresinde ziyaretçilere gösterilecektir.</p>
                        </div>
                        
                        <div className="bg-white border text-black border-gray-200 rounded-2xl p-4 shadow-sm min-h-[500px]">
                            <RichTextEditor 
                                value={data[activeTab]} 
                                onChange={handleDataChange} 
                                placeholder={`${TABS[activeTab]} metnini buraya girin...`}
                                minRows={20}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
