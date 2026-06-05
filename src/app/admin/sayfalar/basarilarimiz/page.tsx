"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    TrophyIcon, PlusIcon, TrashIcon, PhotoIcon, ChevronDownIcon,
    ComputerDesktopIcon, DevicePhoneMobileIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon,
    ArrowPathIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, CheckCircleIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import SortableList from "@/app/admin/components/SortableList";
import VersionHistory from "@/app/admin/components/VersionHistory";

type SectionId = "hero" | "stories";
const SECTION_META: Record<SectionId, { label: string; icon: any; color: string }> = {
    hero: { label: "Hero Bölümü", icon: TrophyIcon, color: "text-yellow-500 bg-yellow-50" },
    stories: { label: "Başarı Hikayeleri", icon: UserGroupIcon, color: "text-blue-500 bg-blue-50" },
};

type StoryItem = { name: string; title: string; testimonial: string; imageUrl: string; category: string; year: number };

export default function BasarilarimizEditorPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [hasChanges, setHasChanges] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionId>("hero");
    const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(new Set(["hero"]));
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
    const [previewZoom, setPreviewZoom] = useState(65);
    const [previewFullscreen, setPreviewFullscreen] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const [heroTitle, setHeroTitle] = useState("Gurur Tablomuz");
    const [heroDesc, setHeroDesc] = useState("4T Akademi ailesi olarak, hayallerine ulaşan öğrencilerimizin başarılarını paylaşmaktan gurur duyarız.");
    const [stories, setStories] = useState<StoryItem[]>([
        { name: "Ahmet Yılmaz", title: "Kaymakam Adayı", testimonial: "4T Akademi'nin disiplinli programı ve Yüksel Hoca'nın İktisat dersleri olmasaydı başaramazdım.", imageUrl: "", category: "kaymakamlik", year: 2024 },
        { name: "Mehmet Öztürk", title: "Sayıştay Denetçisi", testimonial: "Hukuk derslerindeki detaylı anlatım sayesinde rakiplerimin önüne geçtim.", imageUrl: "", category: "sayistay", year: 2024 },
        { name: "Zeynep Demir", title: "Gelir Uzman Yrd.", testimonial: "Soru çözüm kampları, sınavdaki zaman yönetimimi mükemmel hale getirdi.", imageUrl: "", category: "guy", year: 2024 },
    ]);

    const loadData = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/page-content?page=basarilarimiz");
            const data = await res.json();
            if (data.hero) { if (data.hero.title) setHeroTitle(data.hero.title); if (data.hero.content) setHeroDesc(data.hero.content); }
            if (data.stories?.metadata?.items) setStories(data.stories.metadata.items);
        } catch (e) { console.error(e); }
        finally { setLoading(false); setHasChanges(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData, reloadKey]);

    useEffect(() => { if (!loading) setHasChanges(true); }, [heroTitle, heroDesc, stories]);

    const handleSave = useCallback(async () => {
        setSaving(true); setSaveStatus("saving");
        try {
            await fetch("/api/admin/page-content", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageSlug: "basarilarimiz",
                    sections: {
                        hero: { title: heroTitle, content: heroDesc, metadata: {} },
                        stories: { title: "Başarı Hikayeleri", content: null, metadata: { items: stories } },
                    },
                }),
            });
            setSaveStatus("saved"); setHasChanges(false);
            setTimeout(() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }, 300);
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
        finally { setSaving(false); }
    }, [heroTitle, heroDesc, stories]);

    async function uploadFile(file: File): Promise<string | null> {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json(); return data.url || null;
    }

    function toggleSection(id: SectionId) {
        setActiveSection(id);
        setExpandedSections(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
    }

    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white";
    const labelCls = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1";

    if (loading) return <div className="flex items-center justify-center h-[calc(100vh-120px)]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" /></div>;

    return (
        <div className={previewFullscreen ? "fixed inset-0 z-50 bg-gray-100" : ""} style={{ height: previewFullscreen ? "100vh" : "calc(100vh - 120px)" }}>
            <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* LEFT NAV */}
                <div className="w-52 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
                    <div className="px-4 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-900">Başarılarımız</h2>
                            <VersionHistory pageSlug="basarilarimiz" onRestore={() => { setReloadKey(k => k + 1); setLoading(true); }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Sayfa İçerik Editörü</p>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        {(Object.keys(SECTION_META) as SectionId[]).map(id => {
                            const m = SECTION_META[id]; const Icon = m.icon; const isActive = activeSection === id;
                            return (
                                <button key={id} onClick={() => toggleSection(id)} className={`w-full px-4 py-3 flex items-center gap-3 text-left transition ${isActive ? "bg-white border-r-2 border-blue-600 shadow-sm" : "hover:bg-white/60"}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? m.color : "bg-gray-100 text-gray-400"}`}><Icon className="w-4 h-4" /></div>
                                    <p className={`text-xs font-semibold truncate ${isActive ? "text-gray-900" : "text-gray-600"}`}>{m.label}</p>
                                </button>
                            );
                        })}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200">
                        <button onClick={handleSave} disabled={saving || !hasChanges} className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${saveStatus === "saved" ? "bg-emerald-500 text-white" : hasChanges ? "bg-[#0B1221] text-white hover:bg-[#1a2744]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                            {saveStatus === "saving" && <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />}
                            {saveStatus === "saving" ? "Kaydediliyor..." : saveStatus === "saved" ? "✓ Kaydedildi!" : hasChanges ? "💾 Kaydet" : "Değişiklik Yok"}
                        </button>
                    </div>
                </div>

                {/* CENTER EDITOR */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50" style={{ minWidth: 0 }}>
                    <div className="p-5 space-y-4 max-w-2xl">
                        <SectionAccordion id="hero" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div><label className={labelCls}>Ana Başlık</label><input className={inputCls} value={heroTitle} onChange={e => setHeroTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>Açıklama</label><RichTextEditor value={heroDesc} onChange={setHeroDesc} placeholder="Başarı sayfası açıklaması..." minRows={3} /></div>
                            </div>
                        </SectionAccordion>

                        <SectionAccordion id="stories" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <label className={labelCls}>Başarı Kartları</label>
                                <SortableList
                                    items={stories}
                                    onChange={setStories}
                                    renderItem={(s, i) => (
                                        <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-[10px] font-bold shrink-0">{i + 1}</span>
                                                <input className="flex-1 px-2 py-1 rounded border border-gray-200 text-sm font-medium focus:outline-none focus:border-blue-400" value={s.name} onChange={e => { const n = [...stories]; n[i] = { ...n[i], name: e.target.value }; setStories(n); }} placeholder="İsim" />
                                                <input className="w-32 px-2 py-1 rounded border border-gray-200 text-sm focus:outline-none focus:border-blue-400" value={s.title} onChange={e => { const n = [...stories]; n[i] = { ...n[i], title: e.target.value }; setStories(n); }} placeholder="Ünvan" />
                                                <button onClick={() => setStories(stories.filter((_, idx) => idx !== i))} className="p-1 text-red-400 hover:text-red-600"><TrashIcon className="w-3.5 h-3.5" /></button>
                                            </div>
                                            <RichTextEditor value={s.testimonial} onChange={val => { const n = [...stories]; n[i] = { ...n[i], testimonial: val }; setStories(n); }} placeholder="Yorum / Testimonial" minRows={2} />
                                            <div className="grid grid-cols-3 gap-2">
                                                <select className={inputCls} value={s.category} onChange={e => { const n = [...stories]; n[i] = { ...n[i], category: e.target.value }; setStories(n); }}>
                                                    <option value="kaymakamlik">Kaymakamlık</option>
                                                    <option value="sayistay">Sayıştay</option>
                                                    <option value="guy">GUY / Diğer</option>
                                                </select>
                                                <input type="number" className={inputCls} value={s.year} onChange={e => { const n = [...stories]; n[i] = { ...n[i], year: parseInt(e.target.value) || 2024 }; setStories(n); }} placeholder="Yıl" />
                                                <div className="flex items-center gap-1">
                                                    {s.imageUrl ? (
                                                        <div className="flex items-center gap-1 flex-1">
                                                            <img src={s.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                            <button onClick={() => { const n = [...stories]; n[i] = { ...n[i], imageUrl: "" }; setStories(n); }} className="text-[9px] text-red-500 font-bold">Kaldır</button>
                                                        </div>
                                                    ) : (
                                                        <label className="flex-1 h-8 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 transition flex items-center justify-center gap-1 text-gray-400 text-[9px] cursor-pointer">
                                                            <PhotoIcon className="w-3 h-3" /> Foto
                                                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                                const file = e.target.files?.[0]; if (!file) return;
                                                                const url = await uploadFile(file);
                                                                if (url) { const n = [...stories]; n[i] = { ...n[i], imageUrl: url }; setStories(n); }
                                                            }} />
                                                        </label>
                                                    )}
                                                </div>
                                                <p className="text-[8px] text-gray-400 text-center mt-1">1:1 Kare • Maks 5MB (Önerilen 3MB)</p>
                                            </div>
                                        </div>
                                    )}
                                />
                                <button onClick={() => setStories([...stories, { name: "", title: "", testimonial: "", imageUrl: "", category: "kaymakamlik", year: 2024 }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Yeni Başarı Hikayesi Ekle</button>
                            </div>
                        </SectionAccordion>
                    </div>
                </div>

                {/* RIGHT PREVIEW */}
                <div className={`border-l border-gray-200 flex flex-col bg-gray-100 ${previewFullscreen ? "flex-[2]" : ""}`} style={{ width: previewFullscreen ? undefined : 480 }}>
                    <div className="px-3 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-2">Önizleme</span>
                            <button onClick={() => setPreviewDevice("desktop")} className={`p-1.5 rounded transition ${previewDevice === "desktop" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}><ComputerDesktopIcon className="w-4 h-4" /></button>
                            <button onClick={() => setPreviewDevice("mobile")} className={`p-1.5 rounded transition ${previewDevice === "mobile" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}><DevicePhoneMobileIcon className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPreviewZoom(Math.max(30, previewZoom - 10))} className="p-1 text-gray-400 hover:text-gray-600"><MagnifyingGlassMinusIcon className="w-4 h-4" /></button>
                            <span className="text-[10px] font-bold text-gray-500 w-8 text-center">{previewZoom}%</span>
                            <button onClick={() => setPreviewZoom(Math.min(100, previewZoom + 10))} className="p-1 text-gray-400 hover:text-gray-600"><MagnifyingGlassPlusIcon className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-gray-200 mx-1" />
                            <button onClick={() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }} className="p-1 text-gray-400 hover:text-gray-600"><ArrowPathIcon className="w-4 h-4" /></button>
                            <button onClick={() => setPreviewFullscreen(!previewFullscreen)} className="p-1 text-gray-400 hover:text-gray-600">{previewFullscreen ? <ArrowsPointingInIcon className="w-4 h-4" /> : <ArrowsPointingOutIcon className="w-4 h-4" />}</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto flex items-start justify-center p-4">
                        {(() => { const iframeW = previewDevice === "mobile" ? 375 : 1440; const iframeH = previewDevice === "mobile" ? 812 : 900; const scale = previewZoom / 100; return (
                            <div style={{ width: iframeW * scale, height: iframeH * scale, flexShrink: 0 }}>
                                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200" style={{ width: iframeW, height: iframeH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                                    <iframe ref={iframeRef} src="/basarilarimiz" className="border-0 bg-white" style={{ width: "100%", height: "100%" }} />
                                </div>
                            </div>
                        ); })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionAccordion({ id, active, expanded, toggle, children }: { id: SectionId; active: SectionId; expanded: Set<SectionId>; toggle: (id: SectionId) => void; children: React.ReactNode }) {
    const meta = SECTION_META[id]; const Icon = meta.icon; const isActive = active === id; const isExpanded = expanded.has(id);
    return (
        <div className={`bg-white rounded-xl border transition-all ${isActive ? "border-blue-300 shadow-md shadow-blue-100/50 ring-1 ring-blue-200" : "border-gray-200"}`}>
            <button onClick={() => toggle(id)} className="w-full px-4 py-3 flex items-center gap-3 text-left">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.color}`}><Icon className="w-4 h-4" /></div>
                <span className="text-sm font-bold text-gray-800 flex-1">{meta.label}</span>
                {isActive && <span className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">Düzenleniyor</span>}
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            {isExpanded && <div className="px-4 pb-4 pt-1 border-t border-gray-100">{children}</div>}
        </div>
    );
}
