"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    SparklesIcon,
    LightBulbIcon,
    EyeIcon,
    CheckBadgeIcon,
    PhotoIcon,
    PlusIcon,
    TrashIcon,
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
    UsersIcon,
    QuestionMarkCircleIcon,
    ChevronLeftIcon
} from "@heroicons/react/24/outline";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import SortableList from "@/app/admin/components/SortableList";
import VersionHistory from "@/app/admin/components/VersionHistory";
import ResizableSplitter from "@/app/components/ResizableSplitter";
import AdminBackButton from "@/app/admin/components/AdminBackButton";

/* ======================================================= */
/* TYPES                                                   */
/* ======================================================= */
type Stat = { value: string; label: string };
type ValueItem = { name: string; description: string };
type TeamImage = { url: string };
type FaqItem = { q: string; a: string; id: string };

type SectionId = "hero" | "mission" | "vision" | "values" | "team" | "faq";

const SECTION_META: Record<SectionId, { label: string; icon: any; color: string }> = {
    hero: { label: "Hero Bölümü", icon: SparklesIcon, color: "text-yellow-500 bg-yellow-50" },
    mission: { label: "Misyon", icon: LightBulbIcon, color: "text-red-500 bg-red-50" },
    vision: { label: "Vizyon", icon: EyeIcon, color: "text-blue-500 bg-blue-50" },
    values: { label: "Değerlerimiz", icon: CheckBadgeIcon, color: "text-green-500 bg-green-50" },
    team: { label: "Ekip Bölümü", icon: UsersIcon, color: "text-purple-500 bg-purple-50" },
    faq: { label: "Sıkça Sorulan Sorular", icon: QuestionMarkCircleIcon, color: "text-blue-500 bg-blue-100" },
};

/* ======================================================= */
/* COMPONENT                                               */
/* ======================================================= */
export default function HakkimizdaPremiumEditor() {
    // ---- Data States ----
    const [heroTitle1, setHeroTitle1] = useState("Geleceğinizi");
    const [heroTitle2, setHeroTitle2] = useState("Şansa Bırakmayın");
    const [heroDesc, setHeroDesc] = useState("Türkiye'nin en köklü ve prestijli kamu sınavlarına hazırlık platformu. On binlerce başarı hikayesinin arkasındaki güç.");
    const [heroStats, setHeroStats] = useState<Stat[]>([
        { value: "25K+", label: "Atanan Öğrenci" },
        { value: "150+", label: "Uzman Eğitmen" },
        { value: "%98", label: "Memnuniyet" },
    ]);
    const [heroBgImage, setHeroBgImage] = useState("");
    const [heroBadge, setHeroBadge] = useState("4T AKADEMİ FARKI");

    const [missionSectionTitle, setMissionSectionTitle] = useState("Rotamız ve Hedefimiz");
    const [missionSectionDesc, setMissionSectionDesc] = useState("Başarıya giden yolda pusulamız belli.");
    const [missionTitle, setMissionTitle] = useState("Misyonumuz");
    const [missionContent, setMissionContent] = useState("Her bir öğrencinin potansiyelini en üst düzeye çıkarmak için kişiselleştirilmiş eğitim modelini benimsiyoruz. Sadece bilgi yüklemek değil, bilgiyi kullanma becerisi kazandırarak kariyer yolculuklarında onlara rehberlik ediyoruz.");

    const [visionTitle, setVisionTitle] = useState("Vizyonumuz");
    const [visionContent, setVisionContent] = useState("Eğitim teknolojilerindeki son gelişmeleri geleneksel öğretim metotlarıyla harmanlayarak, global standartlarda bir eğitim platformu oluşturmak. Türkiye'nin her köşesine fırsat eşitliği ilkesiyle kaliteli eğitimi ulaştırmak.");

    const [valuesSectionTitle, setValuesSectionTitle] = useState("Değerlerimiz");
    const [valuesSectionDesc, setValuesSectionDesc] = useState("Bizi biz yapan ve her gün daha iyisi için çalışmamızı sağlayan temel prensiplerimiz.");
    const [valuesItems, setValuesItems] = useState<ValueItem[]>([
        { name: "Uzmanlık", description: "Alanında otorite kabul edilen eğitmen kadrosu." },
        { name: "Kalite", description: "4K video çekimleri ve zengin içerik arşivi." },
        { name: "Disiplin", description: "Kişiye özel takip sistemi ve çalışma programları." },
        { name: "Güven", description: "Şeffaf süreç ve %98 öğrenci memnuniyeti." },
    ]);

    const [teamTitle1, setTeamTitle1] = useState("Türkiye'nin En İyi");
    const [teamTitle2, setTeamTitle2] = useState("Eğitmen Kadrosu");
    const [teamDesc, setTeamDesc] = useState("Sadece ders anlatan değil, sınav kazandıran bir kadro. Deneyim, bilgi ve rehberlik bir arada.");
    const [teamImages, setTeamImages] = useState<TeamImage[]>([]);
    const [teamStatValue, setTeamStatValue] = useState("150+");
    const [teamStatLabel, setTeamStatLabel] = useState("Uzman Eğitmen");
    const [teamTag1, setTeamTag1] = useState("Aktif Canlı Dersler");
    const [teamTag2, setTeamTag2] = useState("Soru Çözüm Kampları");
    const [teamBtnText, setTeamBtnText] = useState("Eğitmenlerimizi Tanıyın");
    
    // ---- FAQ ----
    const [faqTitle, setFaqTitle] = useState("Hakkımızda Sıkça Sorulanlar");
    const [faqDesc, setFaqDesc] = useState("Kurumumuzla ilgili merak edilenler");
    const [faqItems, setFaqItems] = useState<FaqItem[]>([]);

    // ---- UI States ----
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [hasChanges, setHasChanges] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionId>("hero");
    const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(new Set(["hero"]));
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
    const [previewZoom, setPreviewZoom] = useState(70);
    const [previewFullscreen, setPreviewFullscreen] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const teamImageRef = useRef<HTMLInputElement>(null);
    const heroBgRef = useRef<HTMLInputElement>(null);
    const [reloadKey, setReloadKey] = useState(0);

    // ---- Load from DB ----
    const loadData = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/page-content?page=hakkimizda");
            const data = await res.json();
            if (data.hero?.metadata) {
                const m = data.hero.metadata;
                if (m.title1) setHeroTitle1(m.title1);
                if (m.title2) setHeroTitle2(m.title2);
                if (data.hero.content) setHeroDesc(data.hero.content);
                if (m.stats) setHeroStats(m.stats);
                if (m.bgImage) setHeroBgImage(m.bgImage);
                if (m.badgeText) setHeroBadge(m.badgeText);
            }
            if (data.mission) {
                if (data.mission.title) setMissionTitle(data.mission.title);
                if (data.mission.content) setMissionContent(data.mission.content);
                if (data.mission.metadata?.sectionTitle) setMissionSectionTitle(data.mission.metadata.sectionTitle);
                if (data.mission.metadata?.sectionDesc) setMissionSectionDesc(data.mission.metadata.sectionDesc);
            }
            if (data.vision) {
                if (data.vision.title) setVisionTitle(data.vision.title);
                if (data.vision.content) setVisionContent(data.vision.content);
            }
            if (data.values?.metadata) {
                if (data.values.title) setValuesSectionTitle(data.values.title);
                if (data.values.content) setValuesSectionDesc(data.values.content);
                if (data.values.metadata.items) setValuesItems(data.values.metadata.items);
            }
            if (data.team?.metadata) {
                const m = data.team.metadata;
                if (m.title1) setTeamTitle1(m.title1);
                if (m.title2) setTeamTitle2(m.title2);
                if (data.team.content) setTeamDesc(data.team.content);
                if (m.images) setTeamImages(m.images);
                if (m.statValue) setTeamStatValue(m.statValue);
                if (m.statLabel) setTeamStatLabel(m.statLabel);
                if (m.tag1) setTeamTag1(m.tag1);
                if (m.tag2) setTeamTag2(m.tag2);
                if (m.btnText) setTeamBtnText(m.btnText);
            }
            if (data.faq) {
                if (data.faq.title) setFaqTitle(data.faq.title);
                if (data.faq.content) setFaqDesc(data.faq.content);
                if (data.faq.metadata?.items) setFaqItems(data.faq.metadata.items);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); setHasChanges(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData, reloadKey]);

    // Track changes
    useEffect(() => {
        if (!loading) setHasChanges(true);
    }, [heroTitle1, heroTitle2, heroDesc, heroStats, heroBgImage, heroBadge, missionSectionTitle, missionSectionDesc, missionTitle, missionContent, visionTitle, visionContent, valuesSectionTitle, valuesSectionDesc, valuesItems, teamTitle1, teamTitle2, teamDesc, teamImages, teamStatValue, teamStatLabel, teamTag1, teamTag2, teamBtnText, faqTitle, faqDesc, faqItems]);

    // ---- Save ----
    const handleSave = useCallback(async () => {
        setSaving(true);
        setSaveStatus("saving");
        try {
            await fetch("/api/admin/page-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageSlug: "hakkimizda",
                    sections: {
                        hero: { title: heroTitle1, content: heroDesc, metadata: { title1: heroTitle1, title2: heroTitle2, stats: heroStats, bgImage: heroBgImage, badgeText: heroBadge } },
                        mission: { title: missionTitle, content: missionContent, metadata: { sectionTitle: missionSectionTitle, sectionDesc: missionSectionDesc } },
                        vision: { title: visionTitle, content: visionContent, metadata: {} },
                        values: { title: valuesSectionTitle, content: valuesSectionDesc, metadata: { items: valuesItems } },
                        team: { title: teamTitle1, content: teamDesc, metadata: { title1: teamTitle1, title2: teamTitle2, images: teamImages, statValue: teamStatValue, statLabel: teamStatLabel, tag1: teamTag1, tag2: teamTag2, btnText: teamBtnText } },
                        faq: { title: faqTitle, content: faqDesc, metadata: { items: faqItems } },
                    },
                }),
            });
            setSaveStatus("saved");
            setHasChanges(false);
            // Refresh preview
            setTimeout(() => {
                if (iframeRef.current) {
                    iframeRef.current.src = iframeRef.current.src;
                }
            }, 300);
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally { setSaving(false); }
    }, [heroTitle1, heroTitle2, heroDesc, heroStats, heroBgImage, heroBadge, missionSectionTitle, missionSectionDesc, missionTitle, missionContent, visionTitle, visionContent, valuesSectionTitle, valuesSectionDesc, valuesItems, teamTitle1, teamTitle2, teamDesc, teamImages, teamStatValue, teamStatLabel, teamTag1, teamTag2, teamBtnText, faqTitle, faqDesc, faqItems]);

    // ---- Image Upload ----
    async function uploadFile(file: File): Promise<string | null> {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        return data.url || null;
    }

    async function handleTeamImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        for (const file of Array.from(e.target.files)) {
            const url = await uploadFile(file);
            if (url) setTeamImages(prev => [...prev, { url }]);
        }
        if (teamImageRef.current) teamImageRef.current.value = "";
    }

    async function handleHeroBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadFile(file);
        if (url) setHeroBgImage(url);
        if (heroBgRef.current) heroBgRef.current.value = "";
    }

    // ---- Toggle Section ----
    function toggleSection(id: SectionId) {
        setActiveSection(id);
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }

    // ---- Completion ----
    function getCompletion(): number {
        let filled = 0, total = 0;
        const check = (v: string) => { total++; if (v.trim()) filled++; };
        check(heroTitle1); check(heroTitle2); check(heroDesc);
        heroStats.forEach(s => { check(s.value); check(s.label); });
        check(missionTitle); check(missionContent);
        check(visionTitle); check(visionContent);
        check(valuesSectionTitle); check(valuesSectionDesc);
        valuesItems.forEach(v => { check(v.name); check(v.description); });
        check(teamTitle1); check(teamTitle2); check(teamDesc);
        check(teamStatValue); check(teamStatLabel);
        return Math.round((filled / total) * 100);
    }

    function getSectionCompletion(id: SectionId): { filled: number; total: number } {
        let filled = 0, total = 0;
        const check = (v: string) => { total++; if (v.trim()) filled++; };
        if (id === "hero") { check(heroTitle1); check(heroTitle2); check(heroDesc); heroStats.forEach(s => { check(s.value); check(s.label); }); }
        if (id === "mission") { check(missionTitle); check(missionContent); }
        if (id === "vision") { check(visionTitle); check(visionContent); }
        if (id === "values") { check(valuesSectionTitle); check(valuesSectionDesc); valuesItems.forEach(v => { check(v.name); check(v.description); }); }
        if (id === "team") { check(teamTitle1); check(teamTitle2); check(teamDesc); check(teamStatValue); check(teamStatLabel); }
        return { filled, total };
    }

    // ---- Styles ----
    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white";
    const labelCls = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
                    <p className="text-sm text-gray-400">Sayfa içerikleri yükleniyor...</p>
                </div>
            </div>
        );
    }

    const completion = getCompletion();

    return (
        <div className={`${previewFullscreen ? "fixed inset-0 z-50 bg-gray-100" : ""}`} style={{ height: previewFullscreen ? "100vh" : "calc(100vh - 120px)" }}>
            <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* ============================================== */}
                {/* LEFT: SECTION NAV                              */}
                {/* ============================================== */}
                <div className="w-52 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-gray-200">
                        <div className="mb-4">
                            <AdminBackButton fallbackUrl="/admin/sayfalar" fullWidth={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-900">Hakkımızda</h2>
                            <VersionHistory pageSlug="hakkimizda" onRestore={() => { setReloadKey(k => k + 1); setLoading(true); }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Sayfa İçerik Editörü</p>
                    </div>

                    {/* Sections */}
                    <div className="flex-1 overflow-y-auto py-2">
                        {(Object.keys(SECTION_META) as SectionId[]).map((id) => {
                            const meta = SECTION_META[id];
                            const Icon = meta.icon;
                            const sc = getSectionCompletion(id);
                            const isActive = activeSection === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => toggleSection(id)}
                                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition group ${isActive ? "bg-white border-r-2 border-blue-600 shadow-sm" : "hover:bg-white/60"}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? meta.color : "bg-gray-100 text-gray-400"}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold truncate ${isActive ? "text-gray-900" : "text-gray-600"}`}>{meta.label}</p>
                                        <p className="text-[9px] text-gray-400">{sc.filled}/{sc.total} alan</p>
                                    </div>
                                    {sc.filled === sc.total && <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Completion */}
                    <div className="px-4 py-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-gray-500">Tamamlanma</span>
                            <span className="text-[10px] font-bold text-gray-700">%{completion}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="px-4 py-3 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                                saveStatus === "saved" ? "bg-emerald-500 text-white" :
                                saveStatus === "error" ? "bg-red-500 text-white" :
                                hasChanges ? "bg-[#0B1221] text-white hover:bg-[#1a2744]" :
                                "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {saveStatus === "saving" && <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />}
                            {saveStatus === "saved" && <CheckCircleIcon className="w-3.5 h-3.5" />}
                            {saveStatus === "error" && <ExclamationCircleIcon className="w-3.5 h-3.5" />}
                            {saveStatus === "saving" ? "Kaydediliyor..." : saveStatus === "saved" ? "Kaydedildi!" : saveStatus === "error" ? "Hata!" : hasChanges ? "💾 Kaydet" : "Değişiklik Yok"}
                        </button>
                        {hasChanges && saveStatus === "idle" && (
                            <p className="text-[9px] text-amber-600 text-center mt-1.5 font-medium">● Kaydedilmemiş değişiklik var</p>
                        )}
                    </div>
                </div>

                {/* ============================================== */}
                {/* CENTER + RIGHT: EDITOR & LIVE PREVIEW          */}
                {/* ============================================== */}
                <ResizableSplitter minWidth={360} maxWidth={900} defaultWidth={480}>
                <div className="flex-1 overflow-y-auto bg-gray-50/50" style={{ minWidth: 0 }}>
                    <div className="p-5 space-y-4 max-w-2xl">

                        {/* ---- HERO ---- */}
                        <SectionAccordion id="hero" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div><label className={labelCls}>Üst Rozet Yazısı</label><input className={inputCls} value={heroBadge} onChange={e => setHeroBadge(e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className={labelCls}>Başlık Satır 1</label><input className={inputCls} value={heroTitle1} onChange={e => setHeroTitle1(e.target.value)} /></div>
                                    <div><label className={labelCls}>Başlık Satır 2 (Renkli)</label><input className={inputCls} value={heroTitle2} onChange={e => setHeroTitle2(e.target.value)} /></div>
                                </div>
                                <div><label className={labelCls}>Açıklama</label><RichTextEditor value={heroDesc} onChange={setHeroDesc} placeholder="Sayfa açıklaması..." minRows={3} /></div>

                                {/* Stats */}
                                <div>
                                    <label className={labelCls}>İstatistikler</label>
                                    <SortableList
                                        items={heroStats}
                                        onChange={setHeroStats}
                                        renderItem={(s, i) => (
                                            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 p-2">
                                                <input className="w-20 px-2 py-1.5 rounded border border-gray-200 text-sm text-center font-bold focus:outline-none focus:border-blue-400" value={s.value} onChange={e => { const ns = [...heroStats]; ns[i] = { ...ns[i], value: e.target.value }; setHeroStats(ns); }} />
                                                <input className="flex-1 px-2 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:border-blue-400" value={s.label} onChange={e => { const ns = [...heroStats]; ns[i] = { ...ns[i], label: e.target.value }; setHeroStats(ns); }} />
                                                {heroStats.length > 1 && <button onClick={() => setHeroStats(heroStats.filter((_, idx) => idx !== i))} className="p-1 text-red-400 hover:text-red-600"><TrashIcon className="w-3.5 h-3.5" /></button>}
                                            </div>
                                        )}
                                    />
                                    <button onClick={() => setHeroStats([...heroStats, { value: "", label: "" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> İstatistik Ekle</button>
                                </div>

                                {/* Hero BG Image */}
                                <div>
                                    <label className={labelCls}>Arka Plan Görseli (Opsiyonel)</label>
                                    <input type="file" ref={heroBgRef} onChange={handleHeroBgUpload} accept="image/*" className="hidden" />
                                    {heroBgImage ? (
                                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2">
                                            <img src={heroBgImage} alt="" className="w-16 h-10 object-cover rounded" />
                                            <span className="text-xs text-green-700 truncate flex-1">{heroBgImage.split('/').pop()}</span>
                                            <button onClick={() => heroBgRef.current?.click()} className="text-[10px] text-green-700 font-bold hover:underline">Değiştir</button>
                                            <button onClick={() => setHeroBgImage("")} className="text-[10px] text-red-500 font-bold hover:underline">Kaldır</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => heroBgRef.current?.click()} className="w-full h-14 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition flex items-center justify-center gap-2 text-gray-400 text-xs"><PhotoIcon className="w-4 h-4" /> Görsel Yükle</button>
                                    )}
                                    <p className="text-[10px] text-gray-400 mt-2">16:9 Oran • Maks 5MB (Önerilen: 3MB)</p>
                                </div>
                            </div>
                        </SectionAccordion>

                        {/* ---- MISSION ---- */}
                        <SectionAccordion id="mission" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 pb-3 mb-3 border-b border-gray-100">
                                    <div><label className={labelCls}>Üst Ana Başlık</label><input className={inputCls} value={missionSectionTitle} onChange={e => setMissionSectionTitle(e.target.value)} /></div>
                                    <div><label className={labelCls}>Üst Ana Açıklama</label><input className={inputCls} value={missionSectionDesc} onChange={e => setMissionSectionDesc(e.target.value)} /></div>
                                </div>
                                <div><label className={labelCls}>Misyon Kutu Başlığı</label><input className={inputCls} value={missionTitle} onChange={e => setMissionTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>İçerik</label><RichTextEditor value={missionContent} onChange={setMissionContent} placeholder="Misyon metni..." minRows={5} /></div>
                            </div>
                        </SectionAccordion>

                        {/* ---- VISION ---- */}
                        <SectionAccordion id="vision" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div><label className={labelCls}>Başlık</label><input className={inputCls} value={visionTitle} onChange={e => setVisionTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>İçerik</label><RichTextEditor value={visionContent} onChange={setVisionContent} placeholder="Vizyon metni..." minRows={5} /></div>
                            </div>
                        </SectionAccordion>

                        {/* ---- VALUES ---- */}
                        <SectionAccordion id="values" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-4">
                                <div><label className={labelCls}>Değerler Bölüm Başlığı</label><RichTextEditor value={valuesSectionTitle} onChange={setValuesSectionTitle} /></div>
                                <div><label className={labelCls}>Değerler Açıklaması</label><RichTextEditor value={valuesSectionDesc} onChange={setValuesSectionDesc} /></div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Değer Maddeleri</label>
                                    <SortableList
                                        items={valuesItems}
                                        onChange={setValuesItems}
                                        renderItem={(item, index) => (
                                            <div className="space-y-2 bg-white rounded-lg border border-gray-100 p-3 pt-2 group relative">
                                                <button onClick={() => setValuesItems(valuesItems.filter((_, idx) => idx !== index))} className="absolute top-2 right-2 p-1 text-red-300 hover:text-red-600 transition-colors bg-white rounded-full"><TrashIcon className="w-3.5 h-3.5" /></button>
                                                <input
                                                    value={item.name}
                                                    onChange={e => { const ni = [...valuesItems]; ni[index] = {...item, name: e.target.value}; setValuesItems(ni); }}
                                                    className="w-full text-sm font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                                                    placeholder="Değer Adı"
                                                />
                                                <textarea
                                                    value={item.description}
                                                    onChange={e => { const ni = [...valuesItems]; ni[index] = {...item, description: e.target.value}; setValuesItems(ni); }}
                                                    className="w-full text-sm text-gray-600 bg-transparent border-none p-0 focus:ring-0 resize-none h-16"
                                                    placeholder="Açıklama"
                                                />
                                            </div>
                                        )}
                                    />
                                    <button onClick={() => setValuesItems([...valuesItems, { name: "", description: "" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Yeni Değer Ekle</button>
                                </div>
                            </div>
                        </SectionAccordion>

                        {/* ---- TEAM ---- */}
                        <SectionAccordion id="team" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className={labelCls}>Başlık Satır 1</label><input className={inputCls} value={teamTitle1} onChange={e => setTeamTitle1(e.target.value)} /></div>
                                    <div><label className={labelCls}>Başlık Satır 2 (Renkli)</label><input className={inputCls} value={teamTitle2} onChange={e => setTeamTitle2(e.target.value)} /></div>
                                </div>
                                <div><label className={labelCls}>Açıklama</label><RichTextEditor value={teamDesc} onChange={setTeamDesc} placeholder="Ekip açıklaması..." minRows={2} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className={labelCls}>İstatistik Değer</label><input className={inputCls} value={teamStatValue} onChange={e => setTeamStatValue(e.target.value)} /></div>
                                    <div><label className={labelCls}>İstatistik Etiket</label><input className={inputCls} value={teamStatLabel} onChange={e => setTeamStatLabel(e.target.value)} /></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div><label className={labelCls}>Etiket 1</label><input className={inputCls} value={teamTag1} onChange={e => setTeamTag1(e.target.value)} /></div>
                                    <div><label className={labelCls}>Etiket 2</label><input className={inputCls} value={teamTag2} onChange={e => setTeamTag2(e.target.value)} /></div>
                                    <div><label className={labelCls}>Buton Yazısı</label><input className={inputCls} value={teamBtnText} onChange={e => setTeamBtnText(e.target.value)} /></div>
                                </div>
                                {/* Team Images */}
                                <div>
                                    <label className={labelCls}>Ekip Görselleri</label>
                                    <input type="file" ref={teamImageRef} onChange={handleTeamImageUpload} accept="image/*" multiple className="hidden" />
                                    <div className="grid grid-cols-4 gap-2">
                                        {teamImages.map((img, i) => (
                                            <div key={i} className="relative group h-20 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <button onClick={() => setTeamImages(teamImages.filter((_, idx) => idx !== i))} className="bg-red-500 text-white rounded-full p-1"><TrashIcon className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => teamImageRef.current?.click()} className="h-20 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-400 hover:bg-purple-50/30 transition flex flex-col items-center justify-center text-gray-400">
                                            <PhotoIcon className="w-5 h-5" />
                                            <span className="text-[8px] font-bold mt-0.5">Ekle</span>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2">1:1 Kare • Maks 5MB (Önerilen: 3MB)</p>
                                </div>
                            </div>
                        </SectionAccordion>

                        {/* ---- FAQ ---- */}
                        <SectionAccordion id="faq" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className={labelCls}>SSS Başlık</label><input className={inputCls} value={faqTitle} onChange={e => setFaqTitle(e.target.value)} /></div>
                                    <div><label className={labelCls}>SSS Açıklama</label><input className={inputCls} value={faqDesc} onChange={e => setFaqDesc(e.target.value)} /></div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Soru ve Cevaplar</label>
                                    <SortableList
                                        items={faqItems}
                                        onChange={setFaqItems}
                                        renderItem={(item, index) => (
                                            <div className="space-y-2 bg-white rounded-lg border border-gray-100 p-3 pt-2 group relative">
                                                <button onClick={() => setFaqItems(faqItems.filter((_, idx) => idx !== index))} className="absolute top-2 right-2 p-1 text-red-300 hover:text-red-600 transition-colors bg-white rounded-full"><TrashIcon className="w-3.5 h-3.5" /></button>
                                                <input
                                                    value={item.q}
                                                    onChange={e => { const ni = [...faqItems]; ni[index] = {...item, q: e.target.value}; setFaqItems(ni); }}
                                                    className="w-full text-sm font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                                                    placeholder="Soru"
                                                />
                                                <textarea
                                                    value={item.a}
                                                    onChange={e => { const ni = [...faqItems]; ni[index] = {...item, a: e.target.value}; setFaqItems(ni); }}
                                                    className="w-full text-sm text-gray-600 bg-transparent border-none p-0 focus:ring-0 resize-none h-16"
                                                    placeholder="Cevap detayları..."
                                                />
                                            </div>
                                        )}
                                    />
                                    <button onClick={() => setFaqItems([...faqItems, { id: Math.random().toString(36).substr(2, 9), q: "", a: "" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Yeni Soru Ekle</button>
                                </div>
                            </div>
                        </SectionAccordion>

                    </div>
                </div>

                {/* ============================================== */}
                {/* RIGHT: LIVE PREVIEW                            */}
                {/* ============================================== */}
                <div className={`border-l border-gray-200 flex flex-col bg-gray-100 w-full ${previewFullscreen ? "fixed inset-0 z-50" : ""}`}>
                    {/* Preview Toolbar */}
                    <div className="px-3 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-2">Önizleme</span>
                            <button onClick={() => setPreviewDevice("desktop")} className={`p-1.5 rounded transition ${previewDevice === "desktop" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                                <ComputerDesktopIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => setPreviewDevice("mobile")} className={`p-1.5 rounded transition ${previewDevice === "mobile" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                                <DevicePhoneMobileIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPreviewZoom(Math.max(30, previewZoom - 10))} className="p-1 text-gray-400 hover:text-gray-600"><MagnifyingGlassMinusIcon className="w-4 h-4" /></button>
                            <span className="text-[10px] font-bold text-gray-500 w-8 text-center">{previewZoom}%</span>
                            <button onClick={() => setPreviewZoom(Math.min(100, previewZoom + 10))} className="p-1 text-gray-400 hover:text-gray-600"><MagnifyingGlassPlusIcon className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-gray-200 mx-1" />
                            <button onClick={() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }} className="p-1 text-gray-400 hover:text-gray-600"><ArrowPathIcon className="w-4 h-4" /></button>
                            <button onClick={() => setPreviewFullscreen(!previewFullscreen)} className="p-1 text-gray-400 hover:text-gray-600">
                                {previewFullscreen ? <ArrowsPointingInIcon className="w-4 h-4" /> : <ArrowsPointingOutIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Preview Frame */}
                    <div className="flex-1 overflow-auto flex items-start justify-center p-4">
                        {(() => {
                            const iframeW = previewDevice === "mobile" ? 375 : 1440;
                            const iframeH = previewDevice === "mobile" ? 812 : 900;
                            const scale = previewZoom / 100;
                            return (
                                <div style={{ 
                                    width: iframeW * scale, 
                                    height: iframeH * scale,
                                    flexShrink: 0,
                                }}>
                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
                                        style={{ 
                                            width: iframeW, 
                                            height: iframeH,
                                            transform: `scale(${scale})`, 
                                            transformOrigin: "top left",
                                        }}>
                                        <iframe
                                            ref={iframeRef}
                                            src="/hakkimizda"
                                            className="border-0 bg-white"
                                            style={{ width: "100%", height: "100%" }}
                                        />
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

/* ======================================================= */
/* SECTION ACCORDION COMPONENT                             */
/* ======================================================= */
function SectionAccordion({ id, active, expanded, toggle, children }: {
    id: SectionId; active: SectionId; expanded: Set<SectionId>; toggle: (id: SectionId) => void; children: React.ReactNode;
}) {
    const meta = SECTION_META[id];
    const Icon = meta.icon;
    const isActive = active === id;
    const isExpanded = expanded.has(id);

    return (
        <div className={`bg-white rounded-xl border transition-all ${isActive ? "border-blue-300 shadow-md shadow-blue-100/50 ring-1 ring-blue-200" : "border-gray-200"}`}>
            <button
                onClick={() => toggle(id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left"
            >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.color}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-800 flex-1">{meta.label}</span>
                {isActive && <span className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">Düzenleniyor</span>}
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
}
