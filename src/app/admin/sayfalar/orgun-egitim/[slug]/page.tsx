"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    AcademicCapIcon, MapPinIcon, UserGroupIcon, SparklesIcon,
    PlusIcon, TrashIcon, PhotoIcon, ChevronDownIcon,
    ComputerDesktopIcon, DevicePhoneMobileIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon,
    ArrowPathIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon,
    BuildingLibraryIcon, ClockIcon,
} from "@heroicons/react/24/outline";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import SortableList from "@/app/admin/components/SortableList";
import VersionHistory from "@/app/admin/components/VersionHistory";
import ResizableSplitter from "@/app/components/ResizableSplitter";
import AdminBackButton from "@/app/admin/components/AdminBackButton";
import { useParams } from "next/navigation";

type SectionId = "heroSlides" | "gallery" | "location" | "programs" | "faculty" | "timeline" | "richContent";
const SECTION_META: Record<SectionId, { label: string; icon: any; color: string }> = {
    heroSlides: { label: "Slider (Afişler)", icon: PhotoIcon, color: "text-amber-500 bg-amber-50" },
    gallery: { label: "Kampüs Yaşamı (Galeri)", icon: SparklesIcon, color: "text-indigo-500 bg-indigo-50" },
    location: { label: "Lokasyon", icon: MapPinIcon, color: "text-red-500 bg-red-50" },
    programs: { label: "Eğitim Modeli", icon: AcademicCapIcon, color: "text-blue-500 bg-blue-50" },
    faculty: { label: "Eğitmen Kadrosu", icon: UserGroupIcon, color: "text-purple-500 bg-purple-50" },
    timeline: { label: "Başarı Adımları", icon: ClockIcon, color: "text-green-500 bg-green-50" },
    richContent: { label: "Detaylı İçerik ve Müfredat", icon: BuildingLibraryIcon, color: "text-teal-500 bg-teal-50" },
};

type ProgramItem = { title: string; desc: string };
type TeacherItem = { name: string; title: string; imgUrl: string };
type StepItem = { title: string; desc: string };

export default function OrgunEgitimEditorPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const dynamicPageSlug = `orgun-egitim-${slug}`;

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

    // Slides & Gallery
    const [slides, setSlides] = useState<any[]>([
        { id: 1, image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop", subtitle: "ANKARA MERKEZ KAMPÜSÜ", title: "Başarıyı Yerin'de Yaşa.", description: "Sadece ders dinlemeye değil, bir kültür kazanmaya geliyorsunuz. Kızılay'ın kalbinde, şampiyonlar ligi kadrosuyla buluşun.", cta: "Kampüsü Ziyaret Et", href: "#basvuru", btnBg: "#DC2626", btnColor: "#FFFFFF", btnPosition: "left" },
        { id: 2, image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop", subtitle: "MODERN SINIFLAR", title: "Ferah ve Donanımlı Eğitim Ortamı.", description: "Öğrenci odaklı tasarlanmış 15 kişilik VIP sınıflarımızda derslere tam konsantre olun.", cta: "Sınıfları İncele", href: "#detaylar", btnBg: "#DC2626", btnColor: "#FFFFFF", btnPosition: "left" },
        { id: 3, image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop", subtitle: "7/24 KÜTÜPHANE", title: "Sessiz, Nezih ve Verimli.", description: "Kendi masanızda, dikkatiniz dağılmadan saatlerce çalışabileceğiniz çalışma alanlarınız hazır.", cta: "Kütüphaneyi Gör", href: "#detaylar", btnBg: "#DC2626", btnColor: "#FFFFFF", btnPosition: "left" },
        { id: 4, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop", subtitle: "BİREBİR İLGİ", title: "Her Öğrenci Bizim İçin Özeldir.", description: "Rehberlik servisimiz ve etüt programlarımızla başarı yolculuğunuzda yalnız değilsiniz.", cta: "İletişime Geç", href: "/iletisim", btnBg: "#DC2626", btnColor: "#FFFFFF", btnPosition: "left" }
    ]);
    // Gallery
    const [galleryTitle, setGalleryTitle] = useState("Kampüs Yaşamı");
    const [galleryImages, setGalleryImages] = useState<string[]>([
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"
    ]);

    // Location
    const [locSubTitle, setLocSubTitle] = useState("Lokasyon");
    const [locTitle, setLocTitle] = useState("Ankara'nın Kalbinde, Ulaşımın Merkezinde.");
    const [locDesc, setLocDesc] = useState("Kızılay Metro istasyonuna 2 dakika yürüme mesafesinde.");
    const [locAddress, setLocAddress] = useState("Karanfil Sokak No: 44, Kızılay");
    const [locHours, setLocHours] = useState("09:00 - 23:00");
    const [locHoursLabel, setLocHoursLabel] = useState("Çalışma Saatleri");
    const [locMapUrl, setLocMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12239.529241517457!2d32.84444983088915!3d39.92131926615965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34faa85d58ad9%3A0x6b8d96bba622a5a5!2sKaranfil%20Sk.%20No%3A44%2C%20K%C4%B1z%C4%B1lay%2C%2006420%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1713454238531!5m2!1str!2str");
    
    // Programs
    const [progSubTitle, setProgSubTitle] = useState("Eğitim Modeli");
    const [progSectionTitle, setProgSectionTitle] = useState("Neden 4T Örgün Eğitim?");
    const [programs, setPrograms] = useState<ProgramItem[]>([
        { title: "Tam Kapsamlı Konu Anlatımı", desc: "Alanında uzman hocalarımızla tüm dersleri en ince ayrıntısına kadar işliyoruz." },
        { title: "Birebir Soru Çözüm & Etüt", desc: "Anlamadığınız konu veya çözemediğiniz soru kalmayacak." },
        { title: "Sınırsız Kaynak Desteği", desc: "4T Yayınevi'nin tüm kaynaklarına ücretsiz erişim." },
        { title: "Türkiye Geneli Denemeler", desc: "Gerçek sınav provası niteliğinde denemeler." },
    ]);
    const [facTitle, setFacTitle] = useState("Şampiyonlar Ligi.");
    const [facDesc, setFacDesc] = useState("Sınav kazandıran kadro, sadece Ankara kampüsünde sizlerle.");
    const [teachers, setTeachers] = useState<TeacherItem[]>([
        { name: "Prof. Dr. Yüksel Bilgili", title: "İktisat Duayeni", imgUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
        { name: "Ahmet Albayrak", title: "Anayasa Hukuku", imgUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" },
        { name: "Zeynep Yılmaz", title: "Muhasebe Uzmanı", imgUrl: "https://images.unsplash.com/photo-1573496359-136d475583dc?q=80&w=400&auto=format&fit=crop" },
        { name: "Mehmet Öztürk", title: "Tarih Bölüm Başkanı", imgUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
    ]);
    const [timelineTitle, setTimelineTitle] = useState("Kazanma Garantili Sistem.");
    const [timelineImage, setTimelineImage] = useState<string>("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop");
    const [badgeTitle, setBadgeTitle] = useState("Başarı Oranı");
    const [badgeValue, setBadgeValue] = useState("%85");
    const [steps, setSteps] = useState<StepItem[]>([
        { title: "Seviye Belirleme", desc: "İlk gün yapılan deneme ile size en uygun sınıfı belirliyoruz." },
        { title: "Kamp Programı", desc: "Eksiklerinizi kapatmak için yoğunlaştırılmış konu anlatım kampları." },
        { title: "Soru Çözüm Etütleri", desc: "Haftalık düzenli denemeler ve birebir soru çözüm saatleri." },
        { title: "Zirveye Yolculuk", desc: "Sınav provası niteliğinde Türkiye geneli denemeler ve son taktikler." },
    ]);

    // Visibilities
    const [heroSlidesActive, setHeroSlidesActive] = useState(true);
    const [galleryActive, setGalleryActive] = useState(true);
    const [locationActive, setLocationActive] = useState(true);
    const [programsActive, setProgramsActive] = useState(true);
    const [facultyActive, setFacultyActive] = useState(true);
    const [timelineActive, setTimelineActive] = useState(true);

    // Rich Content
    const [richContentActive, setRichContentActive] = useState(true);
    const [richContentTitle, setRichContentTitle] = useState("Detaylı İçerik ve Müfredat");
    const [richContentHtml, setRichContentHtml] = useState("<p>Eğitim programımızın detaylarını ve öğretmen kadromuzu aşağıdan inceleyebilirsiniz.</p><table><thead><tr><th>Ders Adı</th><th>Eğitmen</th><th>Saat</th></tr></thead><tbody><tr><td>İktisat</td><td>Prof. Dr. Yüksel Bilgili</td><td>210 Saat</td></tr><tr><td>Maliye</td><td>Doç. Dr. Arda Hakan Öğretir</td><td>80 Saat</td></tr></tbody></table>");

    const loadData = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/page-content?page=${dynamicPageSlug}`);
            const data = await res.json();
            if (data.heroSlides?.metadata?.items?.length > 0) { setSlides(data.heroSlides.metadata.items); }
            if (typeof data.heroSlides?.metadata?.isActive === 'boolean') setHeroSlidesActive(data.heroSlides.metadata.isActive);

            if (data.gallery?.metadata) {
                if (typeof data.gallery.metadata.isActive === 'boolean') setGalleryActive(data.gallery.metadata.isActive);
                if (data.gallery.title) setGalleryTitle(data.gallery.title);
                if (data.gallery.metadata.items?.length > 0) { setGalleryImages(data.gallery.metadata.items); }
            }
            if (data.location?.metadata) {
                if (typeof data.location.metadata.isActive === 'boolean') setLocationActive(data.location.metadata.isActive);
                if (data.location.title) setLocTitle(data.location.title);
                if (data.location.content) setLocDesc(data.location.content);
                if (data.location.metadata.address) setLocAddress(data.location.metadata.address);
                if (data.location.metadata.hours) setLocHours(data.location.metadata.hours);
                if (data.location.metadata.subTitle) setLocSubTitle(data.location.metadata.subTitle);
                if (data.location.metadata.hoursLabel) setLocHoursLabel(data.location.metadata.hoursLabel);
                if (data.location.metadata.mapUrl) setLocMapUrl(data.location.metadata.mapUrl);
            }
            if (data.programs?.metadata) {
                if (typeof data.programs.metadata.isActive === 'boolean') setProgramsActive(data.programs.metadata.isActive);
                if (data.programs.title) setProgSectionTitle(data.programs.title);
                if (data.programs.metadata.items) setPrograms(data.programs.metadata.items);
                if (data.programs.metadata.subTitle) setProgSubTitle(data.programs.metadata.subTitle);
            }
            if (data.faculty?.metadata) {
                if (typeof data.faculty.metadata.isActive === 'boolean') setFacultyActive(data.faculty.metadata.isActive);
                if (data.faculty.title) setFacTitle(data.faculty.title);
                if (data.faculty.content) setFacDesc(data.faculty.content);
                if (data.faculty.metadata.items) setTeachers(data.faculty.metadata.items);
            }
            if (data.timeline?.metadata) {
                if (typeof data.timeline.metadata.isActive === 'boolean') setTimelineActive(data.timeline.metadata.isActive);
                if (data.timeline.title) setTimelineTitle(data.timeline.title);
                if (data.timeline.metadata.items) setSteps(data.timeline.metadata.items);
                if (data.timeline.metadata.imageUrl) setTimelineImage(data.timeline.metadata.imageUrl);
                if (data.timeline.metadata.badgeTitle) setBadgeTitle(data.timeline.metadata.badgeTitle);
                if (data.timeline.metadata.badgeValue) setBadgeValue(data.timeline.metadata.badgeValue);
            }
            if (data.richContent?.metadata) {
                if (typeof data.richContent.metadata.isActive === 'boolean') setRichContentActive(data.richContent.metadata.isActive);
                if (data.richContent.title) setRichContentTitle(data.richContent.title);
                if (data.richContent.content) setRichContentHtml(data.richContent.content);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); setHasChanges(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData, reloadKey]);

    useEffect(() => { if (!loading) setHasChanges(true); }, [slides, galleryImages, galleryTitle, locTitle, locDesc, locAddress, locHours, locSubTitle, locHoursLabel, locMapUrl, progSectionTitle, programs, progSubTitle, facTitle, facDesc, teachers, timelineTitle, steps, timelineImage, badgeTitle, badgeValue, richContentActive, richContentTitle, richContentHtml, heroSlidesActive, galleryActive, locationActive, programsActive, facultyActive, timelineActive]);

    const handleSave = useCallback(async () => {
        setSaving(true); setSaveStatus("saving");
        try {
            await fetch("/api/admin/page-content", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageSlug: dynamicPageSlug,
                    sections: {
                        heroSlides: { title: "Örgün Eğitim Slider", content: null, metadata: { items: slides, isActive: heroSlidesActive } },
                        gallery: { title: galleryTitle || "Kampüs Galerisi", content: null, metadata: { items: galleryImages, isActive: galleryActive } },
                        location: { title: locTitle, content: locDesc, metadata: { address: locAddress, hours: locHours, subTitle: locSubTitle, hoursLabel: locHoursLabel, mapUrl: locMapUrl, isActive: locationActive } },
                        programs: { title: progSectionTitle, content: null, metadata: { items: programs, subTitle: progSubTitle, isActive: programsActive } },
                        faculty: { title: facTitle, content: facDesc, metadata: { items: teachers, isActive: facultyActive } },
                        timeline: { title: timelineTitle, content: null, metadata: { items: steps, imageUrl: timelineImage, badgeTitle: badgeTitle, badgeValue: badgeValue, isActive: timelineActive } },
                        richContent: { title: richContentTitle, content: richContentHtml, metadata: { isActive: richContentActive } }
                    },
                }),
            });
            setSaveStatus("saved"); setHasChanges(false);
            router.refresh();
            setTimeout(() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }, 300);
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
        finally { setSaving(false); }
    }, [slides, galleryTitle, galleryImages, locSubTitle, locTitle, locDesc, locAddress, locHours, locHoursLabel, locMapUrl, progSectionTitle, programs, progSubTitle, facTitle, facDesc, teachers, timelineTitle, timelineImage, badgeTitle, badgeValue, steps, richContentActive, richContentTitle, richContentHtml, dynamicPageSlug, heroSlidesActive, galleryActive, locationActive, programsActive, facultyActive, timelineActive]);

    async function uploadFile(file: File): Promise<string | null> {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        return data.url || null;
    }

    function toggleSection(id: SectionId) { setActiveSection(id); setExpandedSections(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }

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
                            <h2 className="text-sm font-bold text-gray-900 truncate">Örgün Eğitim ({slug?.toUpperCase()})</h2>
                            <VersionHistory pageSlug={dynamicPageSlug} onRestore={() => { setReloadKey(k => k + 1); setLoading(true); }} />
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

                {/* CENTER + RIGHT: EDITOR & LIVE PREVIEW */}
                <ResizableSplitter minWidth={360} maxWidth={900} defaultWidth={480}>
                {/* CENTER EDITOR */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50" style={{ minWidth: 0 }}>
                    <div className="p-5 space-y-4 max-w-2xl">
                        {/* HERO SLIDES */}
                        <SectionAccordion id="heroSlides" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4 relative pb-4 border-b border-gray-100">
                                    <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer top-1 left-1 checked:right-1 checked:left-auto checked:border-blue-500 transition-all z-10" checked={heroSlidesActive} onChange={e => setHeroSlidesActive(e.target.checked)} />
                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer w-10 ${heroSlidesActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                    <span className="text-sm font-bold text-gray-700">{heroSlidesActive ? "Açık (Sitede Görünür)" : "Kapalı (Gizli)"}</span>
                                </div>
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
                                                    <input className={inputCls} placeholder="Üst Etiket (rn: ANKARA MERKEZ KAMPÜSÜ)" value={s.subtitle} onChange={e => { const ns = [...slides]; ns[i].subtitle = e.target.value; setSlides(ns); }} />
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
                                <button onClick={() => setSlides([...slides, { id: Date.now(), image: "", subtitle: "", title: "", description: "", cta: "", href: "", btnBg: "#DC2626", btnColor: "#FFFFFF", btnPosition: "left" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Slayt Ekle</button>
                            </div>
                        </SectionAccordion>

                        {/* GALLERY */}
                        <SectionAccordion id="gallery" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4 relative pb-4 border-b border-gray-100">
                                    <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer top-1 left-1 checked:right-1 checked:left-auto checked:border-blue-500 transition-all z-10" checked={galleryActive} onChange={e => setGalleryActive(e.target.checked)} />
                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer w-10 ${galleryActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                    <span className="text-sm font-bold text-gray-700">{galleryActive ? "Açık (Sitede Görünür)" : "Kapalı (Gizli)"}</span>
                                </div>
                                <div><label className={labelCls}>Galeri Üst Başlığı (örn: Kampüs Yaşamı)</label><input className={inputCls} value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} /></div>
                                <label className={labelCls}>Kampüs Yaşamı Görselleri</label>
                                <SortableList
                                    items={galleryImages.map((img, idx) => ({ id: idx, url: img }))}
                                    onChange={(newItems) => setGalleryImages(newItems.map(item => item.url))}
                                    renderItem={(item, i) => (
                                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex gap-3 items-center relative group">
                                            <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold shrink-0">{i + 1}</span>
                                            <div className="w-24 shrink-0 relative aspect-video rounded overflow-hidden border border-gray-200">
                                                <img src={item.url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-xs text-gray-500 truncate flex-1">{item.url}</span>
                                            <button onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))} className="p-1 text-red-400 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                />
                                <div className="mt-2 flex items-center gap-2">
                                    <label className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline cursor-pointer">
                                        <PlusIcon className="w-3 h-3" /> Görsel Yükle ve Ekle
                                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0]; if (!file) return;
                                            const url = await uploadFile(file);
                                            if (url) setGalleryImages([...galleryImages, url]);
                                        }} />
                                    </label>
                                </div>
                            </div>
                        </SectionAccordion>

                        {/* LOCATION */}
                        <SectionAccordion id="location" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4 relative pb-4 border-b border-gray-100">
                                    <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer top-1 left-1 checked:right-1 checked:left-auto checked:border-blue-500 transition-all z-10" checked={locationActive} onChange={e => setLocationActive(e.target.checked)} />
                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer w-10 ${locationActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                    <span className="text-sm font-bold text-gray-700">{locationActive ? "Açık (Sitede Görünür)" : "Kapalı (Gizli)"}</span>
                                </div>
                                <div><label className={labelCls}>Kırmızı Üst Başlık (örn: Lokasyon)</label><input className={inputCls} value={locSubTitle} onChange={e => setLocSubTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>Başlık</label><input className={inputCls} value={locTitle} onChange={e => setLocTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>Açıklama</label><RichTextEditor value={locDesc} onChange={setLocDesc} placeholder="Lokasyon açıklaması..." minRows={3} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className={labelCls}>Adres</label><input className={inputCls} value={locAddress} onChange={e => setLocAddress(e.target.value)} /></div>
                                    <div><label className={labelCls}>Saatler Etiketi</label><input className={inputCls} value={locHoursLabel} onChange={e => setLocHoursLabel(e.target.value)} /></div>
                                    <div><label className={labelCls}>Çalışma Saatleri</label><input className={inputCls} value={locHours} onChange={e => setLocHours(e.target.value)} /></div>
                                </div>
                                <div><label className={labelCls}>Google Harita İframe URL'si</label><input className={inputCls} value={locMapUrl} onChange={e => setLocMapUrl(e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." /></div>
                            </div>
                        </SectionAccordion>

                        {/* PROGRAMS */}
                        <SectionAccordion id="programs" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4 relative pb-4 border-b border-gray-100">
                                    <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer top-1 left-1 checked:right-1 checked:left-auto checked:border-blue-500 transition-all z-10" checked={programsActive} onChange={e => setProgramsActive(e.target.checked)} />
                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer w-10 ${programsActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                    <span className="text-sm font-bold text-gray-700">{programsActive ? "Açık (Sitede Görünür)" : "Kapalı (Gizli)"}</span>
                                </div>
                                <div><label className={labelCls}>Kırmızı Üst Başlık (örn: Eğitim Modeli)</label><input className={inputCls} value={progSubTitle} onChange={e => setProgSubTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>Bölüm Başlığı</label><input className={inputCls} value={progSectionTitle} onChange={e => setProgSectionTitle(e.target.value)} /></div>
                                <label className={labelCls}>Program Kartları</label>
                                <SortableList
                                    items={programs}
                                    onChange={setPrograms}
                                    renderItem={(p, i) => (
                                        <div className="flex items-start gap-2 bg-white rounded-lg border border-gray-100 p-2">
                                            <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold shrink-0 mt-1">{i + 1}</span>
                                            <div className="flex-1 space-y-1">
                                                <input className={inputCls + " font-medium"} value={p.title} onChange={e => { const n = [...programs]; n[i] = { ...n[i], title: e.target.value }; setPrograms(n); }} placeholder="Başlık" />
                                                <input className={inputCls} value={p.desc} onChange={e => { const n = [...programs]; n[i] = { ...n[i], desc: e.target.value }; setPrograms(n); }} placeholder="Açıklama" />
                                            </div>
                                            <button onClick={() => setPrograms(programs.filter((_, idx) => idx !== i))} className="p-1 text-red-400 hover:text-red-600 mt-1"><TrashIcon className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                />
                                <button onClick={() => setPrograms([...programs, { title: "", desc: "" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Program Ekle</button>
                            </div>
                        </SectionAccordion>

                        {/* FACULTY */}
                        <SectionAccordion id="faculty" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4 relative pb-4 border-b border-gray-100">
                                    <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer top-1 left-1 checked:right-1 checked:left-auto checked:border-blue-500 transition-all z-10" checked={facultyActive} onChange={e => setFacultyActive(e.target.checked)} />
                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer w-10 ${facultyActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                    <span className="text-sm font-bold text-gray-700">{facultyActive ? "Açık (Sitede Görünür)" : "Kapalı (Gizli)"}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className={labelCls}>Başlık</label><input className={inputCls} value={facTitle} onChange={e => setFacTitle(e.target.value)} /></div>
                                    <div><label className={labelCls}>Açıklama</label><input className={inputCls} value={facDesc} onChange={e => setFacDesc(e.target.value)} /></div>
                                </div>
                                <label className={labelCls}>Eğitmenler</label>
                                <SortableList
                                    items={teachers}
                                    onChange={setTeachers}
                                    renderItem={(t, i) => (
                                        <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-2 relative group">
                                            <button onClick={() => setTeachers(teachers.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1 text-red-300 hover:text-red-600 transition-colors bg-white rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                            <div className="flex gap-3">
                                                <div className="w-16 h-16 shrink-0 relative">
                                                    {t.imgUrl ? (
                                                        <div className="relative group/img w-full h-full rounded-full overflow-hidden border border-gray-200">
                                                            <img src={t.imgUrl} alt="" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button onClick={() => { const n = [...teachers]; n[i].imgUrl = ""; setTeachers(n); }} className="text-[8px] text-white font-bold bg-red-500 px-1 py-0.5 rounded">Sil</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <label className="flex w-full h-full rounded-full border-2 border-dashed border-gray-200 hover:border-blue-400 items-center justify-center text-gray-400 cursor-pointer">
                                                            <PhotoIcon className="w-4 h-4" />
                                                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                                const file = e.target.files?.[0]; if (!file) return;
                                                                const url = await uploadFile(file);
                                                                if (url) { const n = [...teachers]; n[i].imgUrl = url; setTeachers(n); }
                                                            }} />
                                                        </label>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <input className={inputCls + " font-medium"} value={t.name} onChange={e => { const n = [...teachers]; n[i] = { ...n[i], name: e.target.value }; setTeachers(n); }} placeholder="İsim" />
                                                    <input className={inputCls} value={t.title} onChange={e => { const n = [...teachers]; n[i] = { ...n[i], title: e.target.value }; setTeachers(n); }} placeholder="Ünvan" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                                <button onClick={() => setTeachers([...teachers, { name: "", title: "", imgUrl: "" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Eğitmen Ekle</button>
                            </div>
                        </SectionAccordion>

                        {/* TIMELINE */}
                        <SectionAccordion id="timeline" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4 relative pb-4 border-b border-gray-100">
                                    <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer top-1 left-1 checked:right-1 checked:left-auto checked:border-blue-500 transition-all z-10" checked={timelineActive} onChange={e => setTimelineActive(e.target.checked)} />
                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer w-10 ${timelineActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                    <span className="text-sm font-bold text-gray-700">{timelineActive ? "Açık (Sitede Görünür)" : "Kapalı (Gizli)"}</span>
                                </div>
                                <div><label className={labelCls}>Bölüm Başlığı</label><input className={inputCls} value={timelineTitle} onChange={e => setTimelineTitle(e.target.value)} /></div>
                                
                                <div className="grid grid-cols-2 gap-3 p-3 bg-green-50/50 rounded-lg border border-green-100">
                                    <div className="col-span-2"><label className={labelCls}>Rozet Ayarları (Görselin Üstündeki Kutucuk)</label></div>
                                    <div><label className={labelCls}>Rozet Başlığı</label><input className={inputCls} value={badgeTitle} onChange={e => setBadgeTitle(e.target.value)} placeholder="Başarı Oranı" /></div>
                                    <div><label className={labelCls}>Rozet Değeri</label><input className={inputCls} value={badgeValue} onChange={e => setBadgeValue(e.target.value)} placeholder="%85" /></div>
                                </div>
                                
                                <div>
                                    <label className={labelCls}>Bölüm Görseli (Sağ Taraftaki Görsel)</label>
                                    {timelineImage ? (
                                        <div className="relative group/img aspect-video rounded overflow-hidden border border-gray-200 mb-2 max-w-sm">
                                            <img src={timelineImage} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => setTimelineImage("")} className="text-[10px] text-white font-bold bg-red-500 px-2 py-0.5 rounded">Sil</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex aspect-video rounded border-2 border-dashed border-gray-200 hover:border-blue-400 items-center justify-center text-gray-400 cursor-pointer mb-2 max-w-sm">
                                            <PhotoIcon className="w-5 h-5" />
                                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                const file = e.target.files?.[0]; if (!file) return;
                                                const url = await uploadFile(file);
                                                if (url) setTimelineImage(url);
                                            }} />
                                        </label>
                                    )}
                                    <p className="text-[8px] text-gray-400 leading-tight">Maks 5MB • (Önerilen 1000x750)</p>
                                </div>

                                <label className={labelCls}>Adımlar</label>
                                <SortableList
                                    items={steps}
                                    onChange={setSteps}
                                    renderItem={(s, i) => (
                                        <div className="flex items-start gap-2 bg-white rounded-lg border border-gray-100 p-2">
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-[10px] font-bold shrink-0 mt-1">{i + 1}</div>
                                            <div className="flex-1 space-y-1">
                                                <input className={inputCls + " font-medium"} value={s.title} onChange={e => { const n = [...steps]; n[i] = { ...n[i], title: e.target.value }; setSteps(n); }} placeholder="Adım başlığı" />
                                                <input className={inputCls} value={s.desc} onChange={e => { const n = [...steps]; n[i] = { ...n[i], desc: e.target.value }; setSteps(n); }} placeholder="Açıklama" />
                                            </div>
                                            <button onClick={() => setSteps(steps.filter((_, idx) => idx !== i))} className="p-1 text-red-400 hover:text-red-600 mt-1"><TrashIcon className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                />
                                <button onClick={() => setSteps([...steps, { title: "", desc: "" }])} className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline"><PlusIcon className="w-3 h-3" /> Adım Ekle</button>
                            </div>
                                </SectionAccordion>

                        {/* RICH CONTENT (TABLES) */}
                        <SectionAccordion id="richContent" active={activeSection} expanded={expandedSections} toggle={toggleSection}>
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm mb-4 border border-yellow-200">
                                    <strong>İpucu:</strong> Müfredat tabloları, ders saatleri veya eğitmen grupları gibi karmaşık listeleri/tabloları aşağıya kopyalayıp yapıştırabilirsiniz. Sitede otomatik olarak modern bir tasarımla gösterilecektir.
                                </div>
                                <div className="flex items-center gap-3 mb-4 relative">
                                    <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer top-1 left-1 checked:right-1 checked:left-auto checked:border-blue-500 transition-all z-10" checked={richContentActive} onChange={e => setRichContentActive(e.target.checked)} />
                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer w-10 ${richContentActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                    <span className="text-sm font-bold text-gray-700">{richContentActive ? "Açık (Sitede Görünür)" : "Kapalı (Gizli)"}</span>
                                </div>

                                {richContentActive && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Bölüm Başlığı</label>
                                            <input className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold" value={richContentTitle} onChange={e => setRichContentTitle(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tablolar ve İçerik</label>
                                            <RichTextEditor value={richContentHtml} onChange={setRichContentHtml} />
                                        </div>
                                    </>
                                )}
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
                            <button onClick={() => setPreviewZoom(Math.max(30, previewZoom - 10))} className="p-1 text-gray-400"><MagnifyingGlassMinusIcon className="w-4 h-4" /></button>
                            <span className="text-[10px] font-bold text-gray-500 w-8 text-center">{previewZoom}%</span>
                            <button onClick={() => setPreviewZoom(Math.min(100, previewZoom + 10))} className="p-1 text-gray-400"><MagnifyingGlassPlusIcon className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-gray-200 mx-1" />
                            <button onClick={() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }} className="p-1 text-gray-400"><ArrowPathIcon className="w-4 h-4" /></button>
                            <button onClick={() => setPreviewFullscreen(!previewFullscreen)} className="p-1 text-gray-400">{previewFullscreen ? <ArrowsPointingInIcon className="w-4 h-4" /> : <ArrowsPointingOutIcon className="w-4 h-4" />}</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto flex items-start justify-center p-4">
                        {(() => { const iframeW = previewDevice === "mobile" ? 375 : 1440; const iframeH = previewDevice === "mobile" ? 812 : 900; const scale = previewZoom / 100; return (
                            <div style={{ width: iframeW * scale, height: iframeH * scale, flexShrink: 0 }}>
                                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200" style={{ width: iframeW, height: iframeH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                                    <iframe ref={iframeRef} src="/orgun-egitim" className="border-0 bg-white" style={{ width: "100%", height: "100%" }} />
                                </div>
                            </div>
                        ); })()}
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
