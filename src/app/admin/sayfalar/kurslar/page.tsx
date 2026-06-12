"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    ArrowPathIcon,
    ComputerDesktopIcon, DevicePhoneMobileIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon,
    MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon
} from "@heroicons/react/24/outline";
import VersionHistory from "@/app/admin/components/VersionHistory";
import RichTextEditor from "@/app/admin/components/RichTextEditor";

export default function KurslarEditorPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [hasChanges, setHasChanges] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
    const [previewZoom, setPreviewZoom] = useState(65);
    const [previewFullscreen, setPreviewFullscreen] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [reloadKey, setReloadKey] = useState(0);

    // HERO
    const [heroBadge, setHeroBadge] = useState("2026 Erken Kayıt Dönemi");
    const [heroTitle, setHeroTitle] = useState("Geleceğinizi Şansa Bırakmayın.");
    const [heroDesc, setHeroDesc] = useState("Türkiye'nin en seçkin eğitmen kadrosu ve yapay zeka destekli öğrenme sistemiyle, hedefinize en kısa ve sağlam yoldan ulaşın.");

    // STATS
    const [stat1Label, setStat1Label] = useState("Öğrenci");
    const [stat1Value, setStat1Value] = useState("25K+");
    const [stat2Label, setStat2Label] = useState("Video Saati");
    const [stat2Value, setStat2Value] = useState("10K+");
    const [stat3Label, setStat3Label] = useState("Başarı Oranı");
    const [stat3Value, setStat3Value] = useState("%95");
    const [stat4Text, setStat4Text] = useState("%100 Memnuniyet Garantisi");

    // CATEGORY SECTION
    const [catTitle, setCatTitle] = useState("Sınavlara Özel Eğitim Programları");
    const [catDesc, setCatDesc] = useState("Sana en uygun alanı seç ve hemen çalışmaya başla.");

    // CTA SECTION
    const [ctaTitle, setCtaTitle] = useState("Kararsız mı kaldınız?");
    const [ctaDesc, setCtaDesc] = useState("Ücretsiz eğitim danışmanlarımızla hemen WhatsApp'tan görüşün!");
    const [ctaBtnText, setCtaBtnText] = useState("Danışmana Bağlan");
    const [ctaBtnUrl, setCtaBtnUrl] = useState("https://wa.me/905555555555");

    const loadData = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/page-content?page=kurslar");
            const data = await res.json();
            if (data.hero?.metadata) {
                const m = data.hero.metadata;
                if (m.badge) setHeroBadge(m.badge);
                if (m.title) setHeroTitle(m.title);
                if (m.desc) setHeroDesc(m.desc);
            }
            if (data.stats?.metadata) {
                const s = data.stats.metadata;
                if (s.s1Label) setStat1Label(s.s1Label);
                if (s.s1Value) setStat1Value(s.s1Value);
                if (s.s2Label) setStat2Label(s.s2Label);
                if (s.s2Value) setStat2Value(s.s2Value);
                if (s.s3Label) setStat3Label(s.s3Label);
                if (s.s3Value) setStat3Value(s.s3Value);
                if (s.s4Text) setStat4Text(s.s4Text);
            }
            if (data.categorySection?.metadata) {
                const c = data.categorySection.metadata;
                if (c.title) setCatTitle(c.title);
                if (c.desc) setCatDesc(c.desc);
            }
            if (data.ctaSection?.metadata) {
                const cta = data.ctaSection.metadata;
                if (cta.title) setCtaTitle(cta.title);
                if (cta.desc) setCtaDesc(cta.desc);
                if (cta.btnText) setCtaBtnText(cta.btnText);
                if (cta.btnUrl) setCtaBtnUrl(cta.btnUrl);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); setHasChanges(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData, reloadKey]);

    useEffect(() => {
        if (!loading) setHasChanges(true);
    }, [heroBadge, heroTitle, heroDesc, stat1Label, stat1Value, stat2Label, stat2Value, stat3Label, stat3Value, stat4Text, catTitle, catDesc, ctaTitle, ctaDesc, ctaBtnText, ctaBtnUrl]);

    const handleSave = useCallback(async () => {
        setSaving(true); setSaveStatus("saving");
        try {
            await fetch("/api/admin/page-content", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageSlug: "kurslar",
                    sections: {
                        hero: {
                            title: "Kurslar Hero", content: null, metadata: {
                                badge: heroBadge, title: heroTitle, desc: heroDesc
                            }
                        },
                        stats: {
                            title: "İstatistikler", content: null, metadata: {
                                s1Label: stat1Label, s1Value: stat1Value,
                                s2Label: stat2Label, s2Value: stat2Value,
                                s3Label: stat3Label, s3Value: stat3Value,
                                s4Text: stat4Text
                            }
                        },
                        categorySection: {
                            title: "Kategori Alanı", content: null, metadata: {
                                title: catTitle, desc: catDesc
                            }
                        },
                        ctaSection: {
                            title: "Alt CTA", content: null, metadata: {
                                title: ctaTitle, desc: ctaDesc, btnText: ctaBtnText, btnUrl: ctaBtnUrl
                            }
                        }
                    },
                }),
            });
            setSaveStatus("saved"); setHasChanges(false);
            setTimeout(() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }, 300);
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
        finally { setSaving(false); }
    }, [heroBadge, heroTitle, heroDesc, stat1Label, stat1Value, stat2Label, stat2Value, stat3Label, stat3Value, stat4Text, catTitle, catDesc, ctaTitle, ctaDesc, ctaBtnText, ctaBtnUrl]);

    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white";
    const labelCls = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1";

    if (loading) return <div className="flex items-center justify-center h-[calc(100vh-120px)]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" /></div>;

    return (
        <div className={previewFullscreen ? "fixed inset-0 z-50 bg-gray-100" : ""} style={{ height: previewFullscreen ? "100vh" : "calc(100vh - 120px)" }}>
            <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                
                {/* LEFT SIDE: EDITOR */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col min-w-[320px]">
                    <div className="px-5 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Kurslar Sayfası</h2>
                            <p className="text-xs text-gray-400">Üst bölüm ve istatistikleri düzenleyin</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <VersionHistory pageSlug="kurslar" onRestore={() => { setReloadKey(k => k + 1); setLoading(true); }} />
                            <button onClick={handleSave} disabled={saving || !hasChanges} className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${saveStatus === "saved" ? "bg-emerald-500 text-white" : hasChanges ? "bg-[#0B1221] text-white hover:bg-[#1a2744]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                                {saveStatus === "saving" && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                {saveStatus === "saving" ? "Kaydediliyor..." : saveStatus === "saved" ? "Kaydedildi" : "Değişiklikleri Kaydet"}
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6 max-w-3xl">
                        
                        {/* HERO */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
                            <h3 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-2">Hero Alanı (Üst Kısım)</h3>
                            <div><label className={labelCls}>Üst Rozet Metni</label><input className={inputCls} value={heroBadge} onChange={e => setHeroBadge(e.target.value)} /></div>
                            <div><label className={labelCls}>Ana Başlık</label><input className={inputCls} value={heroTitle} onChange={e => setHeroTitle(e.target.value)} /></div>
                            <div><label className={labelCls}>Alt Açıklama</label><textarea className={inputCls} value={heroDesc} onChange={e => setHeroDesc(e.target.value)} rows={2} /></div>
                        </div>

                        {/* STATS */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
                            <h3 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-2">İstatistik Bandı</h3>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div><label className={labelCls}>İstatistik 1 (Değer)</label><input className={inputCls} value={stat1Value} onChange={e => setStat1Value(e.target.value)} placeholder="25K+" /></div>
                                <div><label className={labelCls}>İstatistik 1 (Başlık)</label><input className={inputCls} value={stat1Label} onChange={e => setStat1Label(e.target.value)} placeholder="Öğrenci" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div><label className={labelCls}>İstatistik 2 (Değer)</label><input className={inputCls} value={stat2Value} onChange={e => setStat2Value(e.target.value)} placeholder="10K+" /></div>
                                <div><label className={labelCls}>İstatistik 2 (Başlık)</label><input className={inputCls} value={stat2Label} onChange={e => setStat2Label(e.target.value)} placeholder="Video Saati" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div><label className={labelCls}>İstatistik 3 (Değer)</label><input className={inputCls} value={stat3Value} onChange={e => setStat3Value(e.target.value)} placeholder="%95" /></div>
                                <div><label className={labelCls}>İstatistik 3 (Başlık)</label><input className={inputCls} value={stat3Label} onChange={e => setStat3Label(e.target.value)} placeholder="Başarı Oranı" /></div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div><label className={labelCls}>İstatistik 4 (Tam Metin - Yeşil)</label><input className={inputCls} value={stat4Text} onChange={e => setStat4Text(e.target.value)} placeholder="%100 Memnuniyet Garantisi" /></div>
                            </div>
                        </div>
                        
                        {/* CATEGORY SECTION */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
                            <h3 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-2">Kategori Alanı Başlığı</h3>
                            <div><label className={labelCls}>Kategori Üst Başlık</label><input className={inputCls} value={catTitle} onChange={e => setCatTitle(e.target.value)} /></div>
                            <div><label className={labelCls}>Kategori Alt Açıklama</label><RichTextEditor value={catDesc} onChange={setCatDesc} minRows={2} placeholder="Kategori alanı alt açıklaması..." /></div>
                        </div>

                        {/* CTA SECTION */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
                            <h3 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-2">Alt Yönlendirme (CTA) Bandı</h3>
                            <div><label className={labelCls}>CTA Ana Başlık</label><input className={inputCls} value={ctaTitle} onChange={e => setCtaTitle(e.target.value)} /></div>
                            <div><label className={labelCls}>CTA Açıklama</label><RichTextEditor value={ctaDesc} onChange={setCtaDesc} minRows={3} placeholder="Müşterileri ikna edecek harekete geçirici mesaj..." /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelCls}>Buton Yazısı</label><input className={inputCls} value={ctaBtnText} onChange={e => setCtaBtnText(e.target.value)} /></div>
                                <div><label className={labelCls}>Buton Linki (URL)</label><input className={inputCls} value={ctaBtnUrl} onChange={e => setCtaBtnUrl(e.target.value)} /></div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE: PREVIEW */}
                <div className={`border-l border-gray-200 flex flex-col bg-gray-100 ${previewFullscreen ? "flex-[2]" : ""}`} style={{ width: previewFullscreen ? undefined : 600 }}>
                    <div className="px-3 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-2">Önizleme</span>
                            <button onClick={() => setPreviewDevice("desktop")} className={`p-1.5 rounded transition ${previewDevice === "desktop" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}><ComputerDesktopIcon className="w-4 h-4" /></button>
                            <button onClick={() => setPreviewDevice("mobile")} className={`p-1.5 rounded transition ${previewDevice === "mobile" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}><DevicePhoneMobileIcon className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPreviewZoom(Math.max(30, previewZoom - 10))} className="p-1 text-gray-400"><MagnifyingGlassMinusIcon className="w-4 h-4" /></button>
                            <span className="text-[10px] font-bold text-gray-500 w-8 text-center">{previewZoom}%</span>
                            <button onClick={() => setPreviewZoom(Math.min(100, previewZoom + 10))} className="p-1 text-gray-400"><MagnifyingGlassPlusIcon className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-gray-200 mx-1" />
                            <button onClick={() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }} className="p-1 text-gray-400"><ArrowPathIcon className="w-4 h-4" /></button>
                            <button onClick={() => setPreviewFullscreen(!previewFullscreen)} className="p-1 text-gray-400">{previewFullscreen ? <ArrowsPointingInIcon className="w-4 h-4" /> : <ArrowsPointingOutIcon className="w-4 h-4" />}</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto flex items-start justify-center p-4">
                        {(() => {
                            const iframeW = previewDevice === "mobile" ? 375 : 1440;
                            const iframeH = previewDevice === "mobile" ? 812 : 900;
                            const scale = previewZoom / 100;
                            return (
                                <div style={{ width: iframeW * scale, height: iframeH * scale, flexShrink: 0 }}>
                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200" style={{ width: iframeW, height: iframeH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                                        <iframe ref={iframeRef} src="/kurslar" className="border-0 bg-white" style={{ width: "100%", height: "100%" }} />
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>

            </div>
        </div>
    );
}
