"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    SparklesIcon,
    HomeIcon,
    ChartBarIcon,
    RectangleGroupIcon,
    FilmIcon,
    NewspaperIcon,
    PlusIcon,
    TrashIcon,
    PhotoIcon,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    ChevronDownIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ArrowPathIcon,
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import SortableList from "@/app/admin/components/SortableList";
import VersionHistory from "@/app/admin/components/VersionHistory";
import ResizableSplitter from "@/app/components/ResizableSplitter";
import AdminBackButton from "@/app/admin/components/AdminBackButton";

type SectionId = "heroSlides" | "stats" | "categories" | "flixRibbon" | "flix" | "blog";
const SECTION_META: Record<SectionId, { label: string; icon: any; color: string }> = {
    heroSlides: { label: "Slider (Afiş)", icon: PhotoIcon, color: "text-amber-500 bg-amber-50" },
    stats: { label: "İstatistikler", icon: ChartBarIcon, color: "text-blue-500 bg-blue-50" },
    categories: { label: "Kategoriler", icon: RectangleGroupIcon, color: "text-red-500 bg-red-50" },
    flixRibbon: { label: "FLIX Yönlendirme Şeridi", icon: SparklesIcon, color: "text-rose-500 bg-rose-50" },
    flix: { label: "FLIX Bölümü", icon: FilmIcon, color: "text-purple-500 bg-purple-50" },
    blog: { label: "Blog Başlığı", icon: NewspaperIcon, color: "text-green-500 bg-green-50" },
};

export default function AnasayfaEditorPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [hasChanges, setHasChanges] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionId>("heroSlides");
    const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(new Set(["heroSlides"]));
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
    const [previewZoom, setPreviewZoom] = useState(65);
    const [previewFullscreen, setPreviewFullscreen] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [reloadKey, setReloadKey] = useState(0);

    // Data
    const [slides, setSlides] = useState<any[]>([
        { id: 1, image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop", subtitle: "2026 ERKEN KAYIT DÖNEMİ", title: "Geleceğin Bürokratları Burada Yetişiyor.", description: "Kaymakamlık, Sayıştay ve KPSS A grubu sınavlarına, Türkiye'nin en köklü kurumuyla hazırlanın.", cta: "Eğitimleri İncele", href: "#kurslar", btnBg: "#DC2626", btnColor: "#FFFFFF", btnPosition: "left" }
    ]);
    const [stats, setStats] = useState([
        { value: "20+", label: "Yıllık Tecrübe" },
        { value: "25.000+", label: "Mezun Sayısı" },
        { value: "50+", label: "Eğitmen Kadrosu" },
        { value: "100+", label: "Türkiye Derecesi" },
    ]);
    const [catTitle, setCatTitle] = useState("Hedefine Odaklan.");
    const [catDesc, setCatDesc] = useState("4T Akademi'nin 20 yıllık tecrübesiyle hazırlanan, sınav formatına %100 uyumlu eğitim programları.");
    const [catItems, setCatItems] = useState([
        { title: "Kaymakamlık", desc: "Mülki İdare Amirliği sınavına özel, stratejik ve kapsamlı hazırlık seti.", href: "/kurs-kategori/kaymakamlik" },
        { title: "KPSS A Grubu", desc: "Uzman, Müfettiş ve Denetçi kadroları için eksiksiz konu anlatımları.", href: "/kurs-kategori/kpss-a" },
        { title: "Sayıştay", desc: "Denetçi Yardımcılığı sınavının zorlu müfredatına tam hakimiyet.", href: "/kurs-kategori/sayistay" },
        { title: "Adli & İdari Yargı", desc: "Hakimlik ve Savcılık sınavlarına yönelik derinlemesine hukuk eğitimi.", href: "/kurs-kategori/hakimlik" },
    ]);
    const [catAllLinkText, setCatAllLinkText] = useState("Tüm Programlar");
    const [catAllLinkUrl, setCatAllLinkUrl] = useState("/kurslar");
    const [catInspectText, setCatInspectText] = useState("Programı İncele");
    
    // FLIX Ribbon
    const [flixRibbonActive, setFlixRibbonActive] = useState(true);
    const [flixRibbonBadge, setFlixRibbonBadge] = useState("SINIRSIZ ÖĞRENME");
    const [flixRibbonTitle, setFlixRibbonTitle] = useState("Tüm Eğitimlere Tek Pakette Sınırsız Erişin: 4T FLIX");
    const [flixRibbonDesc, setFlixRibbonDesc] = useState("4T FLIX ile 10.000+ saatlik dev arşive 7/24 kesintisiz ulaşın.");
    const [flixRibbonBtn, setFlixRibbonBtn] = useState("FLIX'i Keşfet");
    const [flixRibbonUrl, setFlixRibbonUrl] = useState("/flix");
    const [flixRibbonGradient, setFlixRibbonGradient] = useState("from-purple-900 via-red-900 to-red-600");
    const [flixRibbonColor1, setFlixRibbonColor1] = useState("");
    const [flixRibbonColor2, setFlixRibbonColor2] = useState("");

    const [flixTitle, setFlixTitle] = useState("4T FLIX ile Özgürce Öğren.");
    const [flixDesc, setFlixDesc] = useState("Mesaiden sonra, yolda veya evde. 10.000 saati aşkın video ders arşivine 7/24 kesintisiz erişim.");
    const [flixBadge, setFlixBadge] = useState("Sınırsız Video Kütüphanesi");
    const [flixBtn1Text, setFlixBtn1Text] = useState("Hemen Başla");
    const [flixBtn1Url, setFlixBtn1Url] = useState("/flix");
    const [flixBtn2Text, setFlixBtn2Text] = useState("Detaylı Bilgi");
    const [flixBtn2Url, setFlixBtn2Url] = useState("/flix");
    const [flixBtnBg, setFlixBtnBg] = useState("#FFFFFF");
    const [flixBtnColor, setFlixBtnColor] = useState("#0B1221");
    const [flixBtnPosition, setFlixBtnPosition] = useState("left");
    const [flixBg, setFlixBg] = useState("https://images.unsplash.com/photo-1531297461136-82lw33a4c8f0f?q=80&w=1600&auto=format&fit=crop");
    const [flixDevice, setFlixDevice] = useState("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop");
    const [blogTitle, setBlogTitle] = useState("Güncel Rehberlik Yazıları");
    const [blogSubtitle, setBlogSubtitle] = useState("Akademi Güncesi");

    const loadData = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/page-content?page=home");
            const data = await res.json();
            if (data.heroSlides?.metadata?.items?.length > 0) { setSlides(data.heroSlides.metadata.items); }
            if (data.stats?.metadata) { if (data.stats.metadata.items) setStats(data.stats.metadata.items); }
            if (data.categories?.metadata) {
                if (data.categories.title) setCatTitle(data.categories.title);
                if (data.categories.content) setCatDesc(data.categories.content);
                if (data.categories.metadata.items) setCatItems(data.categories.metadata.items);
                if (data.categories.metadata.allLinkText) setCatAllLinkText(data.categories.metadata.allLinkText);
                if (data.categories.metadata.allLinkUrl) setCatAllLinkUrl(data.categories.metadata.allLinkUrl);
                if (data.categories.metadata.inspectText) setCatInspectText(data.categories.metadata.inspectText);
            }
            if (data.flixRibbon?.metadata) {
                if (typeof data.flixRibbon.metadata.isActive === 'boolean') setFlixRibbonActive(data.flixRibbon.metadata.isActive);
                if (data.flixRibbon.title) setFlixRibbonBadge(data.flixRibbon.title);
                if (data.flixRibbon.content) setFlixRibbonTitle(data.flixRibbon.content);
                if (data.flixRibbon.metadata.desc) setFlixRibbonDesc(data.flixRibbon.metadata.desc);
                if (data.flixRibbon.metadata.btn) setFlixRibbonBtn(data.flixRibbon.metadata.btn);
                if (data.flixRibbon.metadata.url) setFlixRibbonUrl(data.flixRibbon.metadata.url);
                if (data.flixRibbon.metadata.gradient) setFlixRibbonGradient(data.flixRibbon.metadata.gradient);
                if (data.flixRibbon.metadata.color1) setFlixRibbonColor1(data.flixRibbon.metadata.color1);
                if (data.flixRibbon.metadata.color2) setFlixRibbonColor2(data.flixRibbon.metadata.color2);
            }
            if (data.flix?.metadata) {
                if (data.flix.title) setFlixTitle(data.flix.title);
                if (data.flix.content) setFlixDesc(data.flix.content);
                if (data.flix.metadata.badgeText) setFlixBadge(data.flix.metadata.badgeText);
                if (data.flix.metadata.btn1Text) setFlixBtn1Text(data.flix.metadata.btn1Text);
                if (data.flix.metadata.btn1Url) setFlixBtn1Url(data.flix.metadata.btn1Url);
                if (data.flix.metadata.btn2Text) setFlixBtn2Text(data.flix.metadata.btn2Text);
                if (data.flix.metadata.btn2Url) setFlixBtn2Url(data.flix.metadata.btn2Url);
                if (data.flix.metadata.btnBg) setFlixBtnBg(data.flix.metadata.btnBg);
                if (data.flix.metadata.btnColor) setFlixBtnColor(data.flix.metadata.btnColor);
                if (data.flix.metadata.btnPosition) setFlixBtnPosition(data.flix.metadata.btnPosition);
                if (data.flix.metadata.bgImage) setFlixBg(data.flix.metadata.bgImage);
                if (data.flix.metadata.deviceImage) setFlixDevice(data.flix.metadata.deviceImage);
            }
            if (data.blog?.metadata) {
                if (data.blog.title) setBlogTitle(data.blog.title);
                if (data.blog.content) setBlogSubtitle(data.blog.content);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); setHasChanges(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData, reloadKey]);

    useEffect(() => { if (!loading) setHasChanges(true); }, [slides, stats, catTitle, catDesc, catItems, catAllLinkText, catAllLinkUrl, catInspectText, flixRibbonActive, flixRibbonBadge, flixRibbonTitle, flixRibbonDesc, flixRibbonBtn, flixRibbonUrl, flixRibbonGradient, flixRibbonColor1, flixRibbonColor2, flixTitle, flixDesc, flixBadge, flixBtn1Text, flixBtn1Url, flixBtn2Text, flixBtn2Url, flixBtnBg, flixBtnColor, flixBtnPosition, flixBg, flixDevice, blogTitle, blogSubtitle]);

    const handleSave = useCallback(async () => {
        setSaving(true); setSaveStatus("saving");
        try {
            await fetch("/api/admin/page-content", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageSlug: "home",
                    sections: {
                        heroSlides: { title: "Ana Sayfa Slider", content: null, metadata: { items: slides } },
                        stats: { title: "İstatistikler", content: null, metadata: { items: stats } },
                        categories: { title: catTitle, content: catDesc, metadata: { items: catItems, allLinkText: catAllLinkText, allLinkUrl: catAllLinkUrl, inspectText: catInspectText } },
                        flixRibbon: { title: flixRibbonBadge, content: flixRibbonTitle, metadata: { isActive: flixRibbonActive, desc: flixRibbonDesc, btn: flixRibbonBtn, url: flixRibbonUrl, gradient: flixRibbonGradient, color1: flixRibbonColor1, color2: flixRibbonColor2 } },
                        flix: { title: flixTitle, content: flixDesc, metadata: { btnBg: flixBtnBg, btnColor: flixBtnColor, btnPosition: flixBtnPosition, bgImage: flixBg, deviceImage: flixDevice, badgeText: flixBadge, btn1Text: flixBtn1Text, btn1Url: flixBtn1Url, btn2Text: flixBtn2Text, btn2Url: flixBtn2Url } },
                        blog: { title: blogTitle, content: blogSubtitle, metadata: {} },
                    },
                }),
            });
            setSaveStatus("saved"); setHasChanges(false);
            setTimeout(() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }, 300);
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
        finally { setSaving(false); }
    }, [slides, stats, catTitle, catDesc, catItems, catAllLinkText, catAllLinkUrl, catInspectText, flixRibbonActive, flixRibbonBadge, flixRibbonTitle, flixRibbonDesc, flixRibbonBtn, flixRibbonUrl, flixRibbonGradient, flixRibbonColor1, flixRibbonColor2, flixTitle, flixDesc, flixBadge, flixBtn1Text, flixBtn1Url, flixBtn2Text, flixBtn2Url, flixBtnBg, flixBtnColor, flixBtnPosition, blogTitle, blogSubtitle]);

    async function uploadFile(file: File): Promise<string | null> {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        return data.url || null;
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
                        <div className="mb-4">
                            <AdminBackButton fallbackUrl="/admin/sayfalar" fullWidth={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-900">Ana Sayfa</h2>
                            <VersionHistory pageSlug="home" onRestore={() => { setReloadKey(k => k + 1); setLoading(true); }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Sayfa İçerik Editörü</p>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        {(Object.keys(SECTION_META) as SectionId[]).map((id) => {
                            const m = SECTION_META[id]; const Icon = m.icon; const isActive = activeSection === id;
                            return (
                                <button key={id} onClick={() => toggleSection(id)} className={`w-full px-4 py-3 flex items-center gap-3 text-left transition group ${isActive ? "bg-white border-r-2 border-blue-600 shadow-sm" : "hover:bg-white/60"}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? m.color : "bg-gray-100 text-gray-400"}`}><Icon className="w-4 h-4" /></div>
                                    <p className={`text-xs font-semibold truncate ${isActive ? "text-gray-900" : "text-gray-600"}`}>{m.label}</p>
                                </button>
                            );
                        })}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200">
                        <button onClick={handleSave} disabled={saving || !hasChanges} className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${saveStatus === "saved" ? "bg-emerald-500 text-white" : saveStatus === "error" ? "bg-red-500 text-white" : hasChanges ? "bg-[#0B1221] text-white hover:bg-[#1a2744]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                            {saveStatus === "saving" && <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />}
                            {saveStatus === "saving" ? "Kaydediliyor..." : saveStatus === "saved" ? "✓ Kaydedildi!" : saveStatus === "error" ? "Hata!" : hasChanges ? "💾 Kaydet" : "Değişiklik Yok"}
                        </button>
                        {hasChanges && saveStatus === "idle" && <p className="text-[9px] text-amber-600 text-center mt-1.5 font-medium">● Kaydedilmemiş değişiklik var</p>}
                    </div>
                </div>

                {/* CENTER + RIGHT: EDITOR & LIVE PREVIEW */}
                <ResizableSplitter minWidth={360} maxWidth={900} defaultWidth={480}>
                {/* CENTER EDITOR */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50" style={{ minWidth: 0 }}>
                    <div className="p-5 space-y-4 max-w-2xl">
                        {/* HERO SLIDES */}
                        <SectionAccordion id="heroSlides" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <label className={labelCls}>Slaytlar</label>
                                <SortableList
                                    items={slides}
                                    onChange={setSlides}
                                    renderItem={(s, i) => (
                                        <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-2 relative group">
                                            <button onClick={() => setSlides(slides.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1 text-red-300 hover:text-red-600 transition-colors bg-white rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                            <div className="flex gap-3">
                                                <div className="w-24 shrink-0 space-y-1">
                                                    {s.image ? (
                                                        <div className="relative group/img aspect-video rounded overflow-hidden border border-gray-200">
                                                            <img src={s.image} alt="" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button onClick={() => { const ns = [...slides]; ns[i].image = ""; setSlides(ns); }} className="text-[10px] text-white font-bold bg-red-500 px-2 py-0.5 rounded">Sil</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <label className="flex aspect-video rounded border-2 border-dashed border-gray-200 hover:border-blue-400 items-center justify-center text-gray-400 cursor-pointer">
                                                            <PhotoIcon className="w-5 h-5" />
                                                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                                const file = e.target.files?.[0]; if (!file) return;
                                                                const url = await uploadFile(file);
                                                                if (url) { const ns = [...slides]; ns[i].image = url; setSlides(ns); }
                                                            }} />
                                                        </label>
                                                    )}
                                                    <p className="text-[8px] text-gray-400 text-center leading-tight">16:9 • Maks 5MB<br/>(Önerilen 3MB)</p>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <input className={inputCls} placeholder="Üst Etiket (rn: 2026 ERKEN KAYIT DÖNEMİ)" value={s.subtitle} onChange={e => { const ns = [...slides]; ns[i].subtitle = e.target.value; setSlides(ns); }} />
                                                    <input className={inputCls + " font-bold"} placeholder="Ana Başlık" value={s.title} onChange={e => { const ns = [...slides]; ns[i].title = e.target.value; setSlides(ns); }} />
                                                    <textarea className={inputCls + " resize-none text-xs"} placeholder="Açıklama" rows={2} value={s.description} onChange={e => { const ns = [...slides]; ns[i].description = e.target.value; setSlides(ns); }} />
                                                    <div className="flex gap-2">
                                                        <input className={inputCls + " text-xs"} placeholder="Buton Yazısı" value={s.cta} onChange={e => { const ns = [...slides]; ns[i].cta = e.target.value; setSlides(ns); }} />
                                                        <input className={inputCls + " text-xs"} placeholder="Buton Linki" value={s.href} onChange={e => { const ns = [...slides]; ns[i].href = e.target.value; setSlides(ns); }} />
                                                    </div>
                                                    
                                                    {/* BUTON STİL AYARLARI */}
                                                    <div className="pt-2 mt-2 border-t border-gray-100 flex flex-wrap gap-2 items-center">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase w-full">Buton Stili:</span>
                                                        <label className="flex items-center gap-1 text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                            Zemin: <input type="color" className="w-5 h-5 rounded cursor-pointer border-none bg-transparent" value={s.btnBg || "#DC2626"} onChange={e => { const ns = [...slides]; ns[i].btnBg = e.target.value; setSlides(ns); }} />
                                                        </label>
                                                        <label className="flex items-center gap-1 text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                            Yazı: <input type="color" className="w-5 h-5 rounded cursor-pointer border-none bg-transparent" value={s.btnColor || "#FFFFFF"} onChange={e => { const ns = [...slides]; ns[i].btnColor = e.target.value; setSlides(ns); }} />
                                                        </label>
                                                        <select className="text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-1.5 rounded border border-gray-200 focus:outline-none" value={s.btnPosition || "left"} onChange={e => { const ns = [...slides]; ns[i].btnPosition = e.target.value; setSlides(ns); }}>
                                                            <option value="left">Sola Yasla</option>
                                                            <option value="center">Ortala</option>
                                                            <option value="right">Sağa Yasla</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                                <button onClick={() => setSlides([...slides, { id: Date.now(), image: "", subtitle: "", title: "", description: "", cta: "", href: "", btnBg: "#DC2626", btnColor: "#FFFFFF", btnPosition: "left" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Yeni Slayt Ekle</button>
                            </div>
                        </SectionAccordion>

                        {/* STATS */}
                        <SectionAccordion id="stats" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-2">
                                <label className={labelCls}>İstatistik Kartları (4 adet önerilir)</label>
                                <SortableList
                                    items={stats}
                                    onChange={setStats}
                                    renderItem={(s, i) => (
                                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 p-2">
                                            <input className="w-24 px-2 py-1.5 rounded border border-gray-200 text-sm text-center font-bold focus:outline-none focus:border-blue-400" value={s.value} onChange={e => { const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; setStats(n); }} />
                                            <input className="flex-1 px-2 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:border-blue-400" value={s.label} onChange={e => { const n = [...stats]; n[i] = { ...n[i], label: e.target.value }; setStats(n); }} />
                                            {stats.length > 1 && <button onClick={() => setStats(stats.filter((_, idx) => idx !== i))} className="p-1 text-red-400 hover:text-red-600"><TrashIcon className="w-3.5 h-3.5" /></button>}
                                        </div>
                                    )}
                                />
                                <button onClick={() => setStats([...stats, { value: "", label: "" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> İstatistik Ekle</button>
                            </div>
                        </SectionAccordion>

                        {/* CATEGORIES */}
                        <SectionAccordion id="categories" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className={labelCls}>Bölüm Başlığı</label><input className={inputCls} value={catTitle} onChange={e => setCatTitle(e.target.value)} /></div>
                                    <div><label className={labelCls}>Bölüm Açıklaması</label><input className={inputCls} value={catDesc} onChange={e => setCatDesc(e.target.value)} /></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div><label className={labelCls}>Tümü Link Yazısı</label><input className={inputCls} value={catAllLinkText} onChange={e => setCatAllLinkText(e.target.value)} /></div>
                                    <div><label className={labelCls}>Tümü Link URL</label><input className={inputCls} value={catAllLinkUrl} onChange={e => setCatAllLinkUrl(e.target.value)} /></div>
                                    <div><label className={labelCls}>Kart Hover Yazısı</label><input className={inputCls} value={catInspectText} onChange={e => setCatInspectText(e.target.value)} /></div>
                                </div>
                                <label className={labelCls}>Kategori Kartları</label>
                                <SortableList
                                    items={catItems}
                                    onChange={setCatItems}
                                    renderItem={(item, i) => (
                                        <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-[10px] font-bold shrink-0">{i + 1}</span>
                                                <input className="flex-1 px-2 py-1 rounded border border-gray-200 text-sm font-medium focus:outline-none focus:border-blue-400" value={item.title} onChange={e => { const n = [...catItems]; n[i] = { ...n[i], title: e.target.value }; setCatItems(n); }} placeholder="Kategori adı" />
                                                <button onClick={() => setCatItems(catItems.filter((_, idx) => idx !== i))} className="p-1 text-red-400 hover:text-red-600"><TrashIcon className="w-3.5 h-3.5" /></button>
                                            </div>
                                            <input className={inputCls} value={item.desc} onChange={e => { const n = [...catItems]; n[i] = { ...n[i], desc: e.target.value }; setCatItems(n); }} placeholder="Açıklama" />
                                            <input className={inputCls} value={item.href} onChange={e => { const n = [...catItems]; n[i] = { ...n[i], href: e.target.value }; setCatItems(n); }} placeholder="Link (ör: /kurs-kategori/kaymakamlik)" />
                                        </div>
                                    )}
                                />
                                <button onClick={() => setCatItems([...catItems, { title: "", desc: "", href: "" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Kategori Ekle</button>
                            </div>
                        </SectionAccordion>

                        {/* FLIX RIBBON */}
                        <SectionAccordion id="flixRibbon" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer mb-4">
                                    <div className="relative inline-block w-10 h-6 select-none transition duration-200 ease-in">
                                        <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer top-1 left-1 checked:right-1 checked:left-auto checked:border-blue-500 transition-all z-10" checked={flixRibbonActive} onChange={e => setFlixRibbonActive(e.target.checked)} />
                                        <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${flixRibbonActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{flixRibbonActive ? "Şerit Açık (Anasayfada Görünür)" : "Şerit Kapalı (Gizli)"}</span>
                                </label>
                                
                                {flixRibbonActive && (
                                    <>
                                        <div><label className={labelCls}>Rozet (Badge)</label><input className={inputCls} value={flixRibbonBadge} onChange={e => setFlixRibbonBadge(e.target.value)} /></div>
                                        <div><label className={labelCls}>Ana Başlık</label><input className={inputCls + " font-bold"} value={flixRibbonTitle} onChange={e => setFlixRibbonTitle(e.target.value)} /></div>
                                        <div><label className={labelCls}>Kısa Açıklama</label><input className={inputCls} value={flixRibbonDesc} onChange={e => setFlixRibbonDesc(e.target.value)} /></div>
                                        <div>
                                            <label className={labelCls}>Tema (Arka Plan Gradienti)</label>
                                            <select className={inputCls} value={flixRibbonGradient} onChange={e => setFlixRibbonGradient(e.target.value)}>
                                                <option value="from-purple-900 via-red-900 to-red-600">Varsayılan (Mor - Kırmızı - Kırmızı)</option>
                                                <option value="from-blue-900 via-blue-800 to-blue-600">Okyanus (Koyu Mavi - Açık Mavi)</option>
                                                <option value="from-emerald-900 via-emerald-800 to-emerald-600">Zümrüt (Koyu Yeşil - Açık Yeşil)</option>
                                                <option value="from-[#0B1221] via-gray-900 to-gray-800">Gece Modu (Siyah - Koyu Gri)</option>
                                                <option value="from-orange-600 via-amber-500 to-yellow-400">Gün Batımı (Turuncu - Sarı)</option>
                                                <option value="from-slate-100 via-gray-100 to-white">Sade (Açık Gri - Beyaz)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Özel Renk Geçişi (Opsiyonel)</label>
                                            <p className="text-[10px] text-gray-500 mb-2">Yukarıdaki temalardan bağımsız olarak kendi renklerinizi seçmek isterseniz burayı kullanın.</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <input type="color" value={flixRibbonColor1 || "#4c1d95"} onChange={e => setFlixRibbonColor1(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                                                    <span className="text-xs text-gray-600">Başlangıç</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" value={flixRibbonColor2 || "#dc2626"} onChange={e => setFlixRibbonColor2(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                                                    <span className="text-xs text-gray-600">Bitiş</span>
                                                </div>
                                                {(flixRibbonColor1 || flixRibbonColor2) && (
                                                    <button onClick={() => { setFlixRibbonColor1(""); setFlixRibbonColor2(""); }} className="ml-auto text-xs text-red-500 hover:text-red-700">Özel Rengi Sıfırla</button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className={labelCls}>Buton Yazısı</label><input className={inputCls} value={flixRibbonBtn} onChange={e => setFlixRibbonBtn(e.target.value)} /></div>
                                            <div><label className={labelCls}>Buton Linki</label><input className={inputCls} value={flixRibbonUrl} onChange={e => setFlixRibbonUrl(e.target.value)} /></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </SectionAccordion>

                        {/* FLIX */}
                        <SectionAccordion id="flix" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div><label className={labelCls}>Başlık</label><input className={inputCls} value={flixTitle} onChange={e => setFlixTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>Açıklama</label><RichTextEditor value={flixDesc} onChange={setFlixDesc} placeholder="FLIX açıklaması..." minRows={3} /></div>
                                <div><label className={labelCls}>Üst Rozet Yazısı</label><input className={inputCls} value={flixBadge} onChange={e => setFlixBadge(e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className={labelCls}>Buton 1 Yazısı</label><input className={inputCls} value={flixBtn1Text} onChange={e => setFlixBtn1Text(e.target.value)} /></div>
                                    <div><label className={labelCls}>Buton 1 URL</label><input className={inputCls} value={flixBtn1Url} onChange={e => setFlixBtn1Url(e.target.value)} /></div>
                                    <div><label className={labelCls}>Buton 2 Yazısı</label><input className={inputCls} value={flixBtn2Text} onChange={e => setFlixBtn2Text(e.target.value)} /></div>
                                    <div><label className={labelCls}>Buton 2 URL</label><input className={inputCls} value={flixBtn2Url} onChange={e => setFlixBtn2Url(e.target.value)} /></div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Arka Plan Görseli</label>
                                        {flixBg ? (
                                            <div className="relative group/img aspect-video rounded overflow-hidden border border-gray-200 mb-2">
                                                <img src={flixBg} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => setFlixBg("")} className="text-[10px] text-white font-bold bg-red-500 px-2 py-0.5 rounded">Sil</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex aspect-video rounded border-2 border-dashed border-gray-200 hover:border-blue-400 items-center justify-center text-gray-400 cursor-pointer mb-2">
                                                <PhotoIcon className="w-5 h-5" />
                                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                    const file = e.target.files?.[0]; if (!file) return;
                                                    const url = await uploadFile(file);
                                                    if (url) setFlixBg(url);
                                                }} />
                                            </label>
                                        )}
                                        <p className="text-[8px] text-gray-400 text-center leading-tight">Maks 5MB • (Önerilen 1600x900)</p>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Mock Cihaz Görseli</label>
                                        {flixDevice ? (
                                            <div className="relative group/img aspect-video rounded overflow-hidden border border-gray-200 mb-2">
                                                <img src={flixDevice} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => setFlixDevice("")} className="text-[10px] text-white font-bold bg-red-500 px-2 py-0.5 rounded">Sil</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex aspect-video rounded border-2 border-dashed border-gray-200 hover:border-blue-400 items-center justify-center text-gray-400 cursor-pointer mb-2">
                                                <PhotoIcon className="w-5 h-5" />
                                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                    const file = e.target.files?.[0]; if (!file) return;
                                                    const url = await uploadFile(file);
                                                    if (url) setFlixDevice(url);
                                                }} />
                                            </label>
                                        )}
                                        <p className="text-[8px] text-gray-400 text-center leading-tight">Maks 5MB • (Önerilen 600x400)</p>
                                    </div>
                                </div>

                                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50 flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Dinamik Buton Stili:</span>
                                    <label className="flex items-center gap-1 text-[10px] font-medium text-gray-600">
                                        Zemin: <input type="color" className="w-5 h-5 rounded cursor-pointer" value={flixBtnBg} onChange={e => setFlixBtnBg(e.target.value)} />
                                    </label>
                                    <label className="flex items-center gap-1 text-[10px] font-medium text-gray-600">
                                        Yazı: <input type="color" className="w-5 h-5 rounded cursor-pointer" value={flixBtnColor} onChange={e => setFlixBtnColor(e.target.value)} />
                                    </label>
                                    <select className="text-[10px] font-medium text-gray-600 px-2 py-1.5 rounded border border-gray-200" value={flixBtnPosition} onChange={e => setFlixBtnPosition(e.target.value)}>
                                        <option value="left">Sola Yasla</option>
                                        <option value="center">Ortala</option>
                                        <option value="right">Sağa Yasla</option>
                                    </select>
                                </div>
                            </div>
                        </SectionAccordion>

                        {/* BLOG */}
                        <SectionAccordion id="blog" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div><label className={labelCls}>Üst Etiket</label><input className={inputCls} value={blogSubtitle} onChange={e => setBlogSubtitle(e.target.value)} /></div>
                                <div><label className={labelCls}>Ana Başlık</label><input className={inputCls} value={blogTitle} onChange={e => setBlogTitle(e.target.value)} /></div>
                            </div>
                        </SectionAccordion>
                    </div>
                </div>

                {/* RIGHT PREVIEW */}
                <div className={`border-l border-gray-200 flex flex-col bg-gray-100 ${previewFullscreen ? "flex-[2]" : ""}`} style={{ width: previewFullscreen ? undefined : 480 }}>
                    <div className="px-3 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-2">Önizleme</span>
                            <button onClick={() => setPreviewDevice("desktop")} className={`p-1.5 rounded transition ${previewDevice === "desktop" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}><ComputerDesktopIcon className="w-4 h-4" /></button>
                            <button onClick={() => setPreviewDevice("mobile")} className={`p-1.5 rounded transition ${previewDevice === "mobile" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}><DevicePhoneMobileIcon className="w-4 h-4" /></button>
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
                        {(() => {
                            const iframeW = previewDevice === "mobile" ? 375 : 1440;
                            const iframeH = previewDevice === "mobile" ? 812 : 900;
                            const scale = previewZoom / 100;
                            return (
                                <div style={{ width: iframeW * scale, height: iframeH * scale, flexShrink: 0, position: "relative" }}>
                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200" style={{ width: iframeW, height: iframeH, position: "absolute", top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                                        <iframe ref={iframeRef} src="/" className="border-0 bg-white" style={{ width: iframeW, height: iframeH }} />
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
                </ResizableSplitter>
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
