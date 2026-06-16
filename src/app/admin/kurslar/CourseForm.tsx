"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/app/components/RichTextEditor";
import {
    ArrowLeftIcon,
    PhotoIcon,
    CheckIcon,
    XMarkIcon,
    CloudArrowUpIcon,
    SparklesIcon,
    CurrencyDollarIcon,
    TagIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ClockIcon,
    UsersIcon,
    FireIcon,
    TrashIcon,
    ListBulletIcon,
    UserIcon,
    VideoCameraIcon,
    RectangleGroupIcon,
    PlusIcon,
    KeyIcon,
    TicketIcon,
    DocumentTextIcon,
    DevicePhoneMobileIcon,
    TrophyIcon,
    BuildingLibraryIcon
} from "@heroicons/react/24/outline";
import { createCourse, updateCourse, deleteCustomCategory } from "./actions";
import { createCategory } from "../kategoriler/actions";
import { stripHtml } from "@/lib/htmlUtils";

const BENTO_ICONS = [
    { value: "VideoCameraIcon", label: "Kamera / Video", icon: VideoCameraIcon },
    { value: "DocumentTextIcon", label: "Döküman / Kaynak", icon: DocumentTextIcon },
    { value: "DevicePhoneMobileIcon", label: "Mobil / Telefon", icon: DevicePhoneMobileIcon },
    { value: "AcademicCapIcon", label: "Sertifika / Başarı", icon: AcademicCapIcon },
    { value: "TrophyIcon", label: "Kupa / Ödül", icon: TrophyIcon },
    { value: "UsersIcon", label: "Kullanıcılar / Topluluk", icon: UsersIcon },
    { value: "ClockIcon", label: "Saat / Süre", icon: ClockIcon },
    { value: "BuildingLibraryIcon", label: "Kütüphane / Kurum", icon: BuildingLibraryIcon },
];

function IconPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [open, setOpen] = useState(false);
    const selected = BENTO_ICONS.find(i => i.value === value) || BENTO_ICONS[0];
    const SelectedIcon = selected.icon;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
                <div className="flex items-center gap-2">
                    <SelectedIcon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">{selected.label}</span>
                </div>
                <span className="text-gray-400 text-[10px]">▼</span>
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden py-1">
                        {BENTO_ICONS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => { onChange(item.value); setOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${value === item.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 font-medium'}`}
                                >
                                    <Icon className={`w-5 h-5 ${value === item.value ? 'text-blue-600' : 'text-gray-400'}`} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

interface Course {
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    description: string | null;
    price: number;
    oldPrice: number | null;
    imageUrl: string | null;
    videoUrl: string | null;
    category: string | null;
    type: string;
    isActive: boolean;
    hours: string | null;
    questions: string | null;
    bookPrice: number | null;
    badge: string | null;
    duration: string | null;
    studentCount: string | null;
    resources: string | null;
    features: any;
    bentoFeatures: any;
    learningOutcomes: any;
    curriculum: any;
    instructor: any;
    variants?: { title: string; price: number; oldPrice: number | null; order: number }[];
    addons?: { title: string; price: number; order: number }[];
    accessEndDate?: string | null;
    accessDurationDays?: number | null;
    color?: string | null;
    emoji?: string | null;
    sortOrder?: number;
    isCouponApplicable?: boolean;
    instructorList?: string | null;
    coupons?: { id: string; code: string; type: string; amount: number; maxUses: number | null; usedCount: number; expiresAt: string | null; isActive: boolean }[];
}

interface CourseFormProps {
    mode: "create" | "edit";
    course?: Course;
    existingCategories?: string[];
    dbCategories?: { id: string; slug: string; name: string }[];
}

const TYPES = [
    { value: "KURS", label: "Uzaktan Eğitim Kursu", icon: AcademicCapIcon, color: "border-blue-400 bg-blue-50 text-blue-700" },
    { value: "KAMP", label: "Kamp Programı", icon: UsersIcon, color: "border-orange-400 bg-orange-50 text-orange-700" },
];

const BADGES = [
    { value: "", label: "Yok" },
    { value: "En Popüler", label: "En Popüler" },
    { value: "Yeni", label: "Yeni" },
    { value: "Çok Satan", label: "Çok Satan" },
    { value: "Sınırlı", label: "Sınırlı" },
    { value: "Önerilen", label: "Önerilen" },
];


function slugify(text: string): string {
    const cleanText = stripHtml(text);
    const trMap: { [key: string]: string } = {
        'ç': 'c', 'ğ': 'g', 'ş': 's', 'ü': 'u', 'ı': 'i', 'ö': 'o',
        'Ç': 'C', 'Ğ': 'G', 'Ş': 'S', 'Ü': 'U', 'İ': 'i', 'Ö': 'O', 'I': 'i'
    };
    let tempSlug = cleanText;
    for (let key in trMap) {
        tempSlug = tempSlug.replace(new RegExp(key, 'g'), trMap[key]);
    }
    return tempSlug.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseJsonSafe(val: any, fallback: any) {
    if (Array.isArray(val) || (typeof val === "object" && val !== null)) return val;
    if (typeof val === "string") { try { return JSON.parse(val); } catch { return fallback; } }
    return fallback;
}

export default function CourseForm({ mode, course, existingCategories = [], dbCategories = [] }: CourseFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const introVideoInputRef = useRef<HTMLInputElement>(null);
    const instructorPhotoInputRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingIntroVideo, setUploadingIntroVideo] = useState(false);
    const [uploadingInstructorPhoto, setUploadingInstructorPhoto] = useState<number | null>(null);
    const videoFileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingVideoKey, setUploadingVideoKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState("temel");
    const [hasChanges, setHasChanges] = useState(false);
    const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);
    const initialUpsellText = (course as any)?.flixUpsellText || "";
    let parsedUpsell = { text: "", icon: "👑", bgColor: "#4c1d95", textColor: "#ffffff", animation: "animate-pulse" };
    try {
        if (initialUpsellText.startsWith("{")) {
            parsedUpsell = { ...parsedUpsell, ...JSON.parse(initialUpsellText) };
        } else {
            parsedUpsell.text = initialUpsellText;
        }
    } catch {}

    const [flixUpsellData, setFlixUpsellData] = useState(parsedUpsell);
    const [flixUpsellLink, setFlixUpsellLink] = useState((course as any)?.flixUpsellLink || "");

    // Temel
    const [title, setTitle] = useState(course?.title || "");
    const [slug, setSlug] = useState(course?.slug || "");
    const [subtitle, setSubtitle] = useState(course?.subtitle || "");
    const [description, setDescription] = useState(course?.description || "");
    const [price, setPrice] = useState(course?.price?.toString() || "");
    const [oldPrice, setOldPrice] = useState(course?.oldPrice?.toString() || "");
    const [imageUrl, setImageUrl] = useState(course?.imageUrl || "");
    const [videoUrl, setVideoUrl] = useState(course?.videoUrl || "");
    const [gallery, setGallery] = useState<string[]>(parseJsonSafe((course as any)?.gallery, []));
    const [categories, setCategories] = useState<string[]>(
        course?.category ? course.category.split(',').map(s => s.trim()).filter(Boolean) : []
    );
    const [dbCats, setDbCats] = useState(dbCategories);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [addingCatLoading, setAddingCatLoading] = useState(false);
    const [type, setType] = useState(course?.type || "KURS");
    const [isActive, setIsActive] = useState(course?.isActive ?? true);
    const [isCouponApplicable, setIsCouponApplicable] = useState(course?.isCouponApplicable ?? true);
    const [hours, setHours] = useState(course?.hours || "");
    const [questions, setQuestions] = useState(course?.questions || "");
    const [bookPrice, setBookPrice] = useState(course?.bookPrice?.toString() || "");
    const [badge, setBadge] = useState(course?.badge || "");
    const [duration, setDuration] = useState(course?.duration || "");
    const [studentCount, setStudentCount] = useState(course?.studentCount || "");
    const [resources, setResources] = useState(course?.resources || "");
    const [color, setColor] = useState(course?.color || "#3B82F6");
    const [emoji, setEmoji] = useState(course?.emoji || "");
    const [sortOrder, setSortOrder] = useState(course?.sortOrder?.toString() || "999");

    // Erişim Yönetimi
    const [accessEndDate, setAccessEndDate] = useState(course?.accessEndDate ? new Date(course.accessEndDate).toISOString().slice(0, 10) : "");
    const [accessDurationDays, setAccessDurationDays] = useState(course?.accessDurationDays?.toString() || "");

    // Zengin içerikler
    const [features, setFeatures] = useState<string[]>(() => {
        const p = parseJsonSafe(course?.features, [""]);
        return (!p || p.length === 0) ? [""] : p;
    });
    const [bentoFeatures, setBentoFeatures] = useState<{ icon: string; title: string; subtitle: string }[]>(() => {
        const p = parseJsonSafe(course?.bentoFeatures, []);
        return (!p || p.length === 0) ? [{ icon: "VideoCameraIcon", title: "", subtitle: "" }] : p;
    });
    const [learningOutcomes, setLearningOutcomes] = useState<string[]>(() => {
        const p = parseJsonSafe(course?.learningOutcomes, [""]);
        return (!p || p.length === 0) ? [""] : p;
    });
    const [curriculum, setCurriculum] = useState<any[]>(() => {
        const p = parseJsonSafe(course?.curriculum, [{ title: "", duration: "", lessons: [] }]);
        return (!p || p.length === 0) ? [{ title: "", duration: "", lessons: [] }] : p;
    });
    
    // Çoklu Eğitmen
    const [instructors, setInstructors] = useState<{ name: string; title: string; image: string; bio: string }[]>(
        (() => {
            const saved = parseJsonSafe(course?.instructor, null);
            if (Array.isArray(saved)) return saved;
            if (saved && saved.name) return [saved];
            return [{ name: "", title: "", image: "", bio: "" }];
        })()
    );
    const [instructorList, setInstructorList] = useState(course?.instructorList || "");

    // Varyasyon & Eklentiler
    const [variants, setVariants] = useState<{ id?: string; title: string; price: string; oldPrice: string; order: number }[]>(
        course?.variants?.map((v: any) => ({ id: v.id, title: v.title, price: v.price.toString(), oldPrice: v.oldPrice?.toString() || "", order: v.order })) || []
    );
    const [addons, setAddons] = useState<{ id?: string; title: string; price: string; order: number }[]>(
        course?.addons?.map((a: any) => ({ id: a.id, title: a.title, price: a.price.toString(), order: a.order })) || []
    );

    // Kuponlar
    const [coupons, setCoupons] = useState<{ code: string; type: string; amount: string; maxUses: string; expiresAt: string; isActive: boolean; isExisting?: boolean; id?: string }[]>(
        course?.coupons?.map(c => ({
            code: c.code, type: c.type, amount: String(c.amount), maxUses: c.maxUses?.toString() || "",
            expiresAt: c.expiresAt ? new Date(new Date(c.expiresAt).getTime() - new Date(c.expiresAt).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "", isActive: c.isActive, isExisting: true, id: c.id
        })) || []
    );

    const handleTitleChange = (v: string) => { setTitle(v); if (mode === "create") setSlug(slugify(v)); };

    // Eğitmen Helpers
    const addInstructor = () => setInstructors([...instructors, { name: "", title: "", image: "", bio: "" }]);
    const removeInstructor = (i: number) => setInstructors(instructors.filter((_, idx) => idx !== i));
    const updateInstructor = (i: number, field: string, val: string) => { const n = [...instructors]; (n[i] as any)[field] = val; setInstructors(n); };

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true); setError(null);
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.error) setError(data.error); else setImageUrl(data.url);
        } catch { setError("Görsel yüklenirken hata oluştu."); }
        finally { setUploading(false); }
    }

    async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            try {
                const fd = new FormData(); fd.append("file", files[i]);
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                const data = await res.json();
                if (!data.error) setGallery(prev => [...prev, data.url]);
            } catch {}
        }
        if (galleryInputRef.current) galleryInputRef.current.value = "";
    }

    async function handleIntroVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingIntroVideo(true);
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.error) setError(data.error); else setVideoUrl(data.url);
        } catch { setError("Video yüklenirken hata oluştu."); }
        finally { setUploadingIntroVideo(false); if (introVideoInputRef.current) introVideoInputRef.current.value = ""; }
    }

    async function handleInstructorPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || uploadingInstructorPhoto === null) return;
        const idx = uploadingInstructorPhoto;
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!data.error) updateInstructor(idx, "image", data.url);
        } catch {}
        finally { setUploadingInstructorPhoto(null); if (instructorPhotoInputRef.current) instructorPhotoInputRef.current.value = ""; }
    }

    async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !uploadingVideoKey) return;
        
        const [cStr, lStr] = uploadingVideoKey.split('-');
        const c = parseInt(cStr); const l = parseInt(lStr);
        
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.error) setError(data.error); 
            else updateLesson(c, l, "previewUrl", data.url);
        } catch { setError("Video yüklenirken hata oluştu."); }
        finally { 
            setUploadingVideoKey(null); 
            if (videoFileInputRef.current) videoFileInputRef.current.value = ""; 
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setSaving(true); setError(null);
        try {
            const fd = new FormData();
            fd.append("title", title);
            fd.append("slug", slug);
            fd.append("subtitle", subtitle);
            fd.append("description", description);
            fd.append("price", price);
            fd.append("oldPrice", oldPrice);
            fd.append("imageUrl", imageUrl);
            fd.append("gallery", JSON.stringify(gallery));
            fd.append("videoUrl", videoUrl);
            fd.append("category", categories.join(','));
            fd.append("type", type);
            fd.append("isActive", isActive.toString());
            fd.append("isCouponApplicable", isCouponApplicable.toString());
            fd.append("sortOrder", sortOrder);
            if (hours) fd.append("hours", hours);
            fd.append("questions", questions);
            fd.append("bookPrice", bookPrice);
            fd.append("badge", badge);
            fd.append("duration", duration);
            fd.append("studentCount", studentCount);
            fd.append("resources", resources);
            fd.append("features", JSON.stringify(features.filter(f => f.trim())));
            fd.append("bentoFeatures", JSON.stringify(bentoFeatures.filter(b => b.title.trim())));
            fd.append("learningOutcomes", JSON.stringify(learningOutcomes.filter(l => l.trim())));
            fd.append("curriculum", JSON.stringify(curriculum.filter(c => c.title?.trim() || (c.lessons && c.lessons.length > 0))));
            fd.append("instructor", JSON.stringify(instructors.filter(inst => inst.name.trim() !== "" || inst.title.trim() !== "" || inst.bio.trim() !== "" || inst.image.trim() !== "")));
            if (instructorList) fd.append("instructorList", instructorList);
            fd.append("variants", JSON.stringify(variants.filter(v => v.title.trim()).map(v => ({ ...v, price: parseFloat(v.price) || 0, oldPrice: parseFloat(v.oldPrice) || 0 }))));
            fd.append("addons", JSON.stringify(addons.filter(a => a.title.trim()).map(a => ({ ...a, price: parseFloat(a.price) || 0 }))));
            fd.append("accessEndDate", accessEndDate);
            fd.append("accessDurationDays", accessDurationDays);
            fd.append("flixUpsellText", JSON.stringify(flixUpsellData));
            fd.append("flixUpsellLink", flixUpsellLink);
            fd.append("coupons", JSON.stringify(coupons.map(c => ({
                code: c.code.toUpperCase().trim(), type: c.type, amount: parseFloat(c.amount) || 0,
                maxUses: c.maxUses ? parseInt(c.maxUses) : null,
                expiresAt: c.expiresAt || null, isActive: c.isActive,
                ...(c.isExisting && c.id ? { id: c.id } : {})
            }))));

            if (mode === "create") {
                await createCourse(fd);
                router.push("/admin/kurslar");
                router.refresh();
            } else if (course) {
                await updateCourse(course.id, fd);
                setHasChanges(false);
                setToast({ message: "Ürün başarıyla güncellendi!", type: "success" });
                setTimeout(() => setToast(null), 3000);
                router.refresh();
            }
        } catch (err: any) { 
            setError(err.message || "Bir hata oluştu"); 
            setToast({ message: err.message || "Bir hata oluştu, kaydedilemedi.", type: "error" });
            setTimeout(() => setToast(null), 3000);
        }
        finally { setSaving(false); }
    }

    const discountPercent = oldPrice && price ? Math.round((1 - parseFloat(price) / parseFloat(oldPrice)) * 100) : 0;

    // Dynamic list helpers
    const addFeature = () => setFeatures([...features, ""]);
    const removeFeature = (i: number) => setFeatures(features.filter((_: any, idx: number) => idx !== i));
    const updateFeature = (i: number, v: string) => { const n = [...features]; n[i] = v; setFeatures(n); };

    const addBentoFeature = () => setBentoFeatures([...bentoFeatures, { icon: "VideoCameraIcon", title: "", subtitle: "" }]);
    const removeBentoFeature = (i: number) => setBentoFeatures(bentoFeatures.filter((_, idx) => idx !== i));
    const updateBentoFeature = (i: number, field: string, v: string) => { const n = [...bentoFeatures]; (n[i] as any)[field] = v; setBentoFeatures(n); };

    const addOutcome = () => setLearningOutcomes([...learningOutcomes, ""]);
    const removeOutcome = (i: number) => setLearningOutcomes(learningOutcomes.filter((_: any, idx: number) => idx !== i));
    const updateOutcome = (i: number, v: string) => { const n = [...learningOutcomes]; n[i] = v; setLearningOutcomes(n); };

    const addCurr = () => setCurriculum([...curriculum, { title: "", duration: "", lessons: [] }]);
    const removeCurr = (i: number) => setCurriculum(curriculum.filter((_: any, idx: number) => idx !== i));
    const updateCurr = (i: number, field: string, v: string) => { const n = [...curriculum]; n[i] = { ...n[i], [field]: v }; setCurriculum(n); };
    
    // Ders yönetimi (2. katman)
    const addLesson = (currIdx: number) => {
        const n = [...curriculum];
        if (!n[currIdx].lessons) n[currIdx].lessons = [];
        n[currIdx].lessons.push({ title: "", duration: "", isPreview: false, previewUrl: "" });
        setCurriculum(n);
    };
    const removeLesson = (currIdx: number, lesIdx: number) => {
        const n = [...curriculum];
        n[currIdx].lessons = n[currIdx].lessons.filter((_: any, idx: number) => idx !== lesIdx);
        setCurriculum(n);
    };
    const updateLesson = (currIdx: number, lesIdx: number, field: string, val: any) => {
        const n = [...curriculum];
        n[currIdx].lessons[lesIdx] = { ...n[currIdx].lessons[lesIdx], [field]: val };
        setCurriculum(n);
    };

    const sections = [
        { id: "temel", label: "Temel Bilgiler", icon: AcademicCapIcon },
        { id: "pazarlama", label: "Pazarlama ve FLIX Yönlendirme (Upsell)", icon: FireIcon },
        { id: "fiyat", label: "Fiyatlandırma", icon: CurrencyDollarIcon },
        { id: "varyasyon", label: "Varyasyon / Ek", icon: RectangleGroupIcon },
        { id: "ozellikler", label: "Özellikler", icon: SparklesIcon },
        { id: "bento", label: "Bu Kursta Neler Var?", icon: RectangleGroupIcon },
        { id: "kazanimlar", label: "Kazanımlar", icon: CheckIcon },
        { id: "mufredat", label: "Müfredat", icon: ListBulletIcon },
        { id: "egitmen", label: "Eğitmen", icon: UserIcon },
        { id: "kuponlar", label: "Kuponlar", icon: TicketIcon },
    ];

    const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
    const labelCls = "block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleSubmit} onChangeCapture={() => setHasChanges(true)} className="space-y-6 max-w-5xl relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/kurslar" className="p-2 rounded-lg hover:bg-gray-100 transition">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {mode === "create" ? "Yeni Ürün Ekle" : "Ürünü Düzenle"}
                        </h1>
                        <p className="text-sm text-gray-500">Tüm detaylarıyla kurs, FLIX veya kamp oluşturun.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/kurslar" className="px-4 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition text-sm">İptal</Link>
                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B1221] text-white font-bold rounded-xl hover:bg-[#0B1221]/90 transition disabled:opacity-50 shadow-lg shadow-gray-300 text-sm">
                        {saving ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Kaydediliyor…</span> : <><CheckIcon className="h-4 w-4" />{mode === "create" ? "Oluştur" : "Kaydet"}</>}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"><XMarkIcon className="w-5 h-5 shrink-0" />{error}</div>}
            
            {/* Hidden Input for Video */}
            <input type="file" ref={videoFileInputRef} onChange={handleVideoUpload} accept="video/mp4,video/webm,video/ogg,video/quicktime" className="hidden" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* SOL NAVİGASYON */}
                <div className="lg:col-span-1 space-y-1">
                    {/* Ürün Tipi */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                        <label className={labelCls}>Ürün Tipi</label>
                        <div className="space-y-2 mt-2">
                            {TYPES.map((t) => {
                                const Icon = t.icon;
                                return (
                                    <button key={t.value} type="button" onClick={() => setType(t.value)}
                                        className={`w-full flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-xs font-bold ${type === t.value ? `${t.color} border-current` : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                                        <Icon className="w-4 h-4" /> {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bölüm Navigasyonu */}
                    <div className="bg-white rounded-xl border border-gray-200 p-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Bölümler</p>
                        {sections.map((s) => {
                            const Icon = s.icon;
                            return (
                                <button key={s.id} type="button" onClick={() => { setActiveSection(s.id); document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${activeSection === s.id ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"}`}>
                                    <Icon className="w-3.5 h-3.5" /> {s.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Görsel */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                        <h2 className="text-xs font-bold text-gray-700 flex items-center gap-1 mb-3"><PhotoIcon className="w-3.5 h-3.5 text-gray-400" /> Ürün Görseli</h2>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        {imageUrl ? (
                            <div className="relative group">
                                <img src={imageUrl} alt="" className="w-full h-32 object-cover rounded-lg border" />
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-2 py-1.5 bg-white text-gray-900 rounded text-[10px] font-bold">Değiştir</button>
                                    <button type="button" onClick={() => setImageUrl("")} className="px-2 py-1.5 bg-red-500 text-white rounded text-[10px] font-bold">Kaldır</button>
                                </div>
                            </div>
                        ) : (
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-1 text-gray-400">
                                {uploading ? <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                : <><CloudArrowUpIcon className="w-8 h-8" /><span className="text-[10px] font-bold">Görsel Yükle</span></>}
                            </button>
                        )}
                        <p className="text-[10px] text-gray-400 mt-2 text-center leading-tight">16:9 Oran • Maks 5MB • Önerilen: 1920x1080px veya 1280x720px</p>
                    </div>

                    {/* Durum + Kupon + Rozet + Kategori */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 mt-4">
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                                <span className="text-sm font-bold text-gray-700 block">Aktif</span>
                                <span className="text-[10px] text-gray-500">Sitede gösterilsin mi?</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                                <span className="text-sm font-bold text-gray-700 block">Kupon Kullanımı</span>
                                <span className="text-[10px] text-gray-500">Kuponlarla indirim yapılabilir mi?</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isCouponApplicable} onChange={(e) => setIsCouponApplicable(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className={labelCls}>Kategori Seçimi</label>
                                <button type="button" onClick={() => setIsAddingCategory(true)} className="px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 flex items-center gap-1 shrink-0 text-xs">
                                    <PlusIcon className="w-3.5 h-3.5" /> Yeni
                                </button>
                            </div>
                            <div className="border border-gray-200 rounded-lg bg-white p-3 max-h-48 overflow-y-auto space-y-2">
                                {dbCats.filter(c => (c as any).isActive !== false).map((c) => (
                                    <label key={c.slug} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input 
                                            type="checkbox" 
                                            value={c.slug}
                                            checked={categories.includes(c.slug)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCategories([...categories, c.slug]);
                                                } else {
                                                    setCategories(categories.filter(cat => cat !== c.slug));
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{(c as any).parentId ? `— ${c.name}` : c.name}</span>
                                    </label>
                                ))}
                                {existingCategories.filter(ec => !dbCats.find(c => c.slug === ec)).map(ec => (
                                    <label key={ec} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input 
                                            type="checkbox" 
                                            value={ec}
                                            checked={categories.includes(ec)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCategories([...categories, ec]);
                                                } else {
                                                    setCategories(categories.filter(cat => cat !== ec));
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{ec} (Eski)</span>
                                    </label>
                                ))}
                            </div>
                            
                            {/* Modal for adding category */}
                            {isAddingCategory && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 space-y-4">
                                        <h3 className="font-bold text-gray-900 text-lg">Yeni Kategori Ekle</h3>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Kategori Adı</label>
                                            <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} className={inputCls} placeholder="Örn: Kaymakamlık" autoFocus />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Üst Kategori (Opsiyonel)</label>
                                            <select id="newCatParentId" className={inputCls}>
                                                <option value="">Yok (Ana Kategori)</option>
                                                {dbCats.filter(c => !(c as any).parentId && (c as any).isActive !== false).map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button type="button" onClick={() => { setIsAddingCategory(false); setNewCatName(""); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200">İptal</button>
                                            <button type="button" disabled={!newCatName || addingCatLoading} onClick={async () => {
                                                setAddingCatLoading(true);
                                                try {
                                                    const fd = new FormData();
                                                    fd.append("name", newCatName);
                                                    const pId = (document.getElementById("newCatParentId") as HTMLSelectElement)?.value;
                                                    if (pId) fd.append("parentId", pId);
                                                    const newCat = await createCategory(fd);
                                                    setDbCats([...dbCats, newCat]);
                                                    setCategories([...categories, newCat.slug]);
                                                    setIsAddingCategory(false);
                                                    setNewCatName("");
                                                } catch (e: any) {
                                                    alert(e.message);
                                                } finally {
                                                    setAddingCatLoading(false);
                                                }
                                            }} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
                                                {addingCatLoading ? "Ekleniyor..." : "Ekle"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Tema Rengi */}
                        <div className="pt-3 border-t border-gray-100">
                            <label className={labelCls}>Tema Rengi</label>
                            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden w-full h-10">
                                 <input type="color" name="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-full cursor-pointer p-0 border-0" />
                                 <input type="hidden" name="color" value={color} />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <label className={labelCls}>Rozet</label>
                            <select value={badge} onChange={(e) => setBadge(e.target.value)} className={inputCls + " !py-2 bg-white"}>
                                {BADGES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                            </select>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <label className={labelCls}>Sıralama (Öncelik)</label>
                            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputCls} placeholder="999" min="0" />
                            <p className="text-[9px] text-gray-400 mt-1">Düşük sayılar (ör. 1, 2, 3) önce gösterilir. Varsayılan: 999</p>
                        </div>
                    </div>
                </div>

                {/* SAĞ — İÇERİK ALANI */}
                <div className="lg:col-span-3 space-y-6">

                    {/* ======================= TEMEL BİLGİLER ======================= */}
                    <div id="section-temel" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 border-t-4 border-t-blue-500 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><AcademicCapIcon className="w-4 h-4 text-gray-400" /> Temel Bilgiler</h2>
                        <div>
                            <label className={labelCls}>Kurs Adı *</label>
                            <RichTextEditor
                                value={title}
                                onChange={(val) => { setTitle(val); if (mode === "create") setSlug(slugify(val)); }}
                                minHeight="60px"
                                simple={true}
                                placeholder="Örn: Kaymakamlık Komple Paket 2025"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Kısa Tanıtım Yazısı</label>
                            <RichTextEditor 
                                value={subtitle || ""} 
                                onChange={setSubtitle} 
                                minHeight="80px"
                            />
                        </div>
                        {/* Slug otomatik üretilir, kullanıcıya gösterilmez */}
                        <input type="hidden" value={slug} />
                        <div>
                            <label className={labelCls}>Detaylı Açıklama</label>
                            <RichTextEditor 
                                value={description || ""} 
                                onChange={setDescription} 
                            />
                        </div>

                        {/* Tanıtım Videosu - Upload */}
                        <div>
                            <label className={labelCls}>Tanıtım Videosu</label>
                            <input type="file" ref={introVideoInputRef} onChange={handleIntroVideoUpload} accept="video/mp4,video/webm,video/ogg,video/quicktime" className="hidden" />
                            {videoUrl ? (
                                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <VideoCameraIcon className="w-5 h-5 text-green-600 shrink-0" />
                                    <span className="text-xs text-green-800 font-medium truncate flex-1">{videoUrl.split('/').pop()}</span>
                                    <button type="button" onClick={() => { introVideoInputRef.current?.click(); }} className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded hover:bg-green-200">Değiştir</button>
                                    <button type="button" onClick={() => setVideoUrl("")} className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100">Kaldır</button>
                                </div>
                            ) : (
                                <button type="button" onClick={() => introVideoInputRef.current?.click()} disabled={uploadingIntroVideo}
                                    className="w-full h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50/50 transition-all flex flex-col items-center justify-center gap-1 text-gray-400">
                                    {uploadingIntroVideo ? <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    : <><VideoCameraIcon className="w-6 h-6" /><span className="text-[10px] font-bold">Tanıtım Videosu Yükle (Max 5dk)</span></>}
                                </button>
                            )}
                            <p className="text-[10px] text-gray-400 mt-2">16:9 Oran • Maks 20MB • Önerilen: 1920x1080px (MP4/WebM)</p>
                        </div>

                        {/* Çoklu Görsel Galerisi */}
                        <div>
                            <label className={labelCls}>Kurs Görselleri</label>
                            <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} accept="image/*" multiple className="hidden" />
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                {gallery.map((url, gi) => (
                                    <div key={gi} className="relative group h-20 rounded-lg overflow-hidden border">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setGallery(gallery.filter((_, idx) => idx !== gi))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition">✕</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => galleryInputRef.current?.click()}
                                    className="h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-1 text-gray-400">
                                    <CloudArrowUpIcon className="w-5 h-5" />
                                    <span className="text-[9px] font-bold">Görsel Ekle</span>
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400">16:9 Oran • Maks 5MB • Önerilen: 1920x1080px veya 1280x720px</p>
                        </div>
                    </div>

                    {/* ======================= FİYATLANDIRMA ======================= */}
                    
                    {/* ======================= PAZARLAMA / UPSELL ======================= */}
                    <div id="section-pazarlama" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 border-t-4 border-t-red-500 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><FireIcon className="w-4 h-4 text-gray-400" /> Pazarlama ve FLIX Yönlendirme (Upsell)</h2>
                        <p className="text-xs text-gray-500">Bu alan doldurulursa, kurs detay sayfasının en üstünde dikkat çekici bir bildirim çubuğu (Smart Bar) çıkar. Öğrencileri daha üst paketlere (Örn: FLIX) yönlendirmek için harikadır.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Smart Bar İkon (Emoji)</label>
                                <input type="text" value={flixUpsellData.icon} onChange={(e) => setFlixUpsellData({...flixUpsellData, icon: e.target.value})} className={inputCls} maxLength={5} placeholder="Örn: 👑" />
                            </div>
                            <div>
                                <label className={labelCls}>Animasyon</label>
                                <select value={flixUpsellData.animation} onChange={(e) => setFlixUpsellData({...flixUpsellData, animation: e.target.value})} className={inputCls + " !py-[11px] bg-white"}>
                                    <option value="animate-pulse">Nefes Alma (Pulse)</option>
                                    <option value="animate-bounce">Zıplama (Bounce)</option>
                                    <option value="animate-none">Sabit (Animasyon Yok)</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Arka Plan Rengi</label>
                                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden w-full h-11">
                                     <input type="color" value={flixUpsellData.bgColor} onChange={(e) => setFlixUpsellData({...flixUpsellData, bgColor: e.target.value})} className="w-full h-full cursor-pointer p-0 border-0" />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Yazı Rengi</label>
                                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden w-full h-11">
                                     <input type="color" value={flixUpsellData.textColor} onChange={(e) => setFlixUpsellData({...flixUpsellData, textColor: e.target.value})} className="w-full h-full cursor-pointer p-0 border-0" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Smart Bar Metni</label>
                            <input type="text" value={flixUpsellData.text} onChange={(e) => setFlixUpsellData({...flixUpsellData, text: e.target.value})} className={inputCls} placeholder="Örn: Bu kurs Kaymakamlık FLIX aboneliğine dahildir." />
                        </div>
                        <div>
                            <label className={labelCls}>Yönlendirilecek Link</label>
                            <input type="text" value={flixUpsellLink} onChange={(e) => setFlixUpsellLink(e.target.value)} className={inputCls} placeholder="Örn: /flix/kaymakamlik-flix" />
                        </div>
                    </div>

                    <div id="section-fiyat" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 border-t-4 border-t-green-500 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><CurrencyDollarIcon className="w-4 h-4 text-gray-400" /> Fiyatlandırma</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Satış Fiyatı (₺) *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₺</span>
                                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" className={inputCls + " pl-8 font-semibold"} placeholder="14500" />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Eski Fiyat (₺) {discountPercent > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">%{discountPercent}</span>}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₺</span>
                                    <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} min="0" className={inputCls + " pl-8"} placeholder="18000" />
                                </div>
                            </div>
                        </div>
                        {type === "FLIX" && (
                            <div>
                                <label className={labelCls}><BookOpenIcon className="inline w-3.5 h-3.5 mr-1" /> Kitap Seti Fiyatı (₺)</label>
                                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₺</span>
                                <input type="number" value={bookPrice} onChange={(e) => setBookPrice(e.target.value)} min="0" className={inputCls + " pl-8"} placeholder="500" /></div>
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className={labelCls}><ClockIcon className="inline w-3.5 h-3.5 mr-1" /> Toplam Saat</label>
                                <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} className={inputCls} placeholder="640" /></div>
                            <div><label className={labelCls}>Toplam Soru</label>
                                <input type="text" value={questions} onChange={(e) => setQuestions(e.target.value)} className={inputCls} placeholder="12.000+" /></div>
                            <div><label className={labelCls}>Kaynak Sayısı</label>
                                <input type="text" value={resources} onChange={(e) => setResources(e.target.value)} className={inputCls} placeholder="120" /></div>
                        </div>
                    </div>

                    {/* ======================= ERİŞİM YÖNETİMİ ======================= */}
                    <div id="section-erisim" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
                        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <KeyIcon className="w-4 h-4 text-gray-400" /> Erişim Yönetimi
                        </h2>
                        <p className="text-xs text-gray-400 -mt-3">Bu kursu satın alan öğrencilerin erişim süresini belirleyin.</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Erişim Bitiş Tarihi</label>
                                <input 
                                    type="date" 
                                    value={accessEndDate} 
                                    onChange={(e) => setAccessEndDate(e.target.value)} 
                                    className={inputCls} 
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Sabit bitiş tarihi (ör: sınav günü). Tüm öğrenciler bu tarihe kadar erişir.</p>
                            </div>
                            <div>
                                <label className={labelCls}>veya Erişim Süresi (Gün)</label>
                                <input 
                                    type="number" 
                                    value={accessDurationDays} 
                                    onChange={(e) => setAccessDurationDays(e.target.value)} 
                                    min="0" 
                                    className={inputCls} 
                                    placeholder="365" 
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Satın alma tarihinden itibaren kaç gün. Boş = süresiz erişim.</p>
                            </div>
                        </div>

                        {(accessEndDate || accessDurationDays) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                                <KeyIcon className="w-4 h-4 text-blue-600 shrink-0" />
                                <p className="text-xs text-blue-700">
                                    {accessEndDate 
                                        ? <>Öğrenciler <strong>{new Date(accessEndDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> tarihine kadar erişebilecek.</>
                                        : <>Öğrenciler satın alma tarihinden itibaren <strong>{accessDurationDays} gün</strong> boyunca erişebilecek.</>
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ======================= VARYASYON VE EKLENTİLER ======================= */}
                    <div id="section-varyasyon" className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
                        {/* Eğitim Modeli (Online/Offline) */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><RectangleGroupIcon className="w-4 h-4 text-gray-400" /> Varyasyonlar (Örn: Online/Offline)</h2>
                                <button type="button" onClick={() => setVariants([...variants, { title: "", price: "", oldPrice: "", order: variants.length }])} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                                    <PlusIcon className="w-3.5 h-3.5" /> Varyasyon Ekle
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mb-4">Bir kursun farklı satış opsiyonlarını (farklı fiyatlarla) satmak için kullanın.</p>
                            <div className="space-y-3">
                                {variants.map((v, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <input type="text" value={v.title} onChange={(e) => { const n = [...variants]; n[i].title = e.target.value; setVariants(n); }} className={inputCls + " flex-1 !bg-white"} placeholder="Örn: Online Eğitim" />
                                        <div className="relative w-32"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₺</span><input type="number" value={v.price} onChange={(e) => { const n = [...variants]; n[i].price = e.target.value; setVariants(n); }} className={inputCls + " !bg-white pl-6"} placeholder="Fiyat" /></div>
                                        <div className="relative w-32"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₺</span><input type="number" value={v.oldPrice} onChange={(e) => { const n = [...variants]; n[i].oldPrice = e.target.value; setVariants(n); }} className={inputCls + " !bg-white pl-6"} placeholder="Eski Fiyat" /></div>
                                        <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {variants.length === 0 && <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-lg text-xs tracking-wider text-gray-400 font-bold uppercase cursor-pointer hover:bg-gray-50" onClick={() => setVariants([{ title: "Online Eğitim", price: price, oldPrice: oldPrice, order: 0 }])}>Bu Kursa Varyasyon Ekle</div>}
                            </div>
                        </div>

                        {/* Ekstra Addons (Kitap Seti vs) */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><RectangleGroupIcon className="w-4 h-4 text-gray-400" /> Ek Seçenekler (Upsell)</h2>
                                <button type="button" onClick={() => setAddons([...addons, { title: "", price: "", order: addons.length }])} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                                    <PlusIcon className="w-3.5 h-3.5" /> Seçenek Ekle
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mb-4">Öğrencinin sepete ekleyebileceği "A Kitap Seti", "B Eğitimi" gibi isteğe bağlı eklentiler.</p>
                            <div className="space-y-3">
                                {addons.map((a, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <input type="text" value={a.title} onChange={(e) => { const n = [...addons]; n[i].title = e.target.value; setAddons(n); }} className={inputCls + " flex-1 !bg-white"} placeholder="Örn: KPSS A Kitap Seti" />
                                        <div className="relative w-40"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">+₺</span><input type="number" value={a.price} onChange={(e) => { const n = [...addons]; n[i].price = e.target.value; setAddons(n); }} className={inputCls + " !bg-white pl-8"} placeholder="Ek Ücret" /></div>
                                        <button type="button" onClick={() => setAddons(addons.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ======================= ÖZELLİKLER ======================= */}
                    <div id="section-ozellikler" className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><SparklesIcon className="w-4 h-4 text-gray-400" /> Özellikler</h2>
                            <button type="button" onClick={addFeature} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                                <PlusIcon className="w-3.5 h-3.5" /> Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Kurs kartında görünecek özellikler (örn: "Bire Bir Koçluk", "Deneme Sınavları")</p>
                        <div className="space-y-2">
                            {features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs text-gray-300 w-5">{i + 1}.</span>
                                    <input type="text" value={f} onChange={(e) => updateFeature(i, e.target.value)} className={inputCls + " flex-1"} placeholder="Özellik yazın..." />
                                    {features.length > 1 && (
                                        <button type="button" onClick={() => removeFeature(i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ======================= BENTO ÖZELLİKLER (BU KURSTA NELER VAR?) ======================= */}
                    <div id="section-bento" className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><RectangleGroupIcon className="w-4 h-4 text-gray-400" /> Bu Kursta Neler Var? (Grid)</h2>
                            <button type="button" onClick={addBentoFeature} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                                <PlusIcon className="w-3.5 h-3.5" /> Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Kurs detay sayfasında kutu kutu (Bento grid) görünen özellikler. Başlık ve alt açıklama şeklinde görünür.</p>
                        <div className="space-y-3">
                            {bentoFeatures.map((b: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="w-40 shrink-0">
                                        <label className={labelCls}>İkon</label>
                                        <IconPicker 
                                            value={b.icon} 
                                            onChange={(val) => updateBentoFeature(i, "icon", val)} 
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <label className={labelCls}>Başlık</label>
                                                <input type="text" value={b.title} onChange={(e) => updateBentoFeature(i, "title", e.target.value)} className={inputCls + " !bg-white"} placeholder="Örn: 1600+ Saat Video" />
                                            </div>
                                            <div className="flex-1">
                                                <label className={labelCls}>Açıklama (Opsiyonel)</label>
                                                <input type="text" value={b.subtitle} onChange={(e) => updateBentoFeature(i, "subtitle", e.target.value)} className={inputCls + " !bg-white"} placeholder="Örn: 4K kalitesinde çekimler" />
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeBentoFeature(i)} className="p-2 mt-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition shrink-0">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ======================= KAZANIMLAR ======================= */}
                    <div id="section-kazanimlar" className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><CheckIcon className="w-4 h-4 text-gray-400" /> Kazanımlar</h2>
                            <button type="button" onClick={addOutcome} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition">
                                <PlusIcon className="w-3.5 h-3.5" /> Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Bu kursu alan öğrenci ne kazanır? (Detay sayfasında "Kazanımlar" bölümü)</p>
                        <div className="space-y-2">
                            {learningOutcomes.map((l: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <input type="text" value={l} onChange={(e) => updateOutcome(i, e.target.value)} className={inputCls + " flex-1"} placeholder="Kazanım yazın..." />
                                    {learningOutcomes.length > 1 && (
                                        <button type="button" onClick={() => removeOutcome(i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ======================= MÜFREDAT ======================= */}
                    <div id="section-mufredat" className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><ListBulletIcon className="w-4 h-4 text-gray-400" /> Müfredat Bölümleri</h2>
                            <button type="button" onClick={addCurr} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                                <PlusIcon className="w-3.5 h-3.5" /> Bölüm Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Kurs müfredatının ana bölümleri ve içindeki ders videoları.</p>
                        <div className="space-y-4">
                            {curriculum.map((c: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-bold text-gray-400 w-6">{i + 1}</span>
                                        <input type="text" value={c.title} onChange={(e) => updateCurr(i, "title", e.target.value)} className={inputCls + " flex-1 !bg-white"} placeholder="Bölüm Adı: Büyüme ve Kalkınma Modelleri" />
                                        <input type="text" value={c.duration} onChange={(e) => updateCurr(i, "duration", e.target.value)} className={inputCls + " w-28 !bg-white"} placeholder="Toplam Süre" />
                                        <button type="button" onClick={() => removeCurr(i)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {/* Dersler (İç Katman) */}
                                    <div className="pl-9 space-y-2">
                                        {(c.lessons || []).map((les: any, lesIdx: number) => (
                                            <div key={lesIdx} className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 w-12 text-center">Ders {lesIdx+1}</span>
                                                    <input type="text" value={les.title} onChange={(e) => updateLesson(i, lesIdx, "title", e.target.value)} className={inputCls + " flex-1 !py-1.5 !text-xs"} placeholder="Ders Başlığı" />
                                                    <input type="text" value={les.duration} onChange={(e) => updateLesson(i, lesIdx, "duration", e.target.value)} className={inputCls + " w-20 !py-1.5 !text-xs text-center"} placeholder="15:00" />
                                                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-200">
                                                        <input type="checkbox" checked={les.isPreview} onChange={(e) => updateLesson(i, lesIdx, "isPreview", e.target.checked)} className="text-purple-600 rounded w-3 h-3" />
                                                        Tanıtım
                                                    </label>
                                                    <button type="button" onClick={() => removeLesson(i, lesIdx)} className="p-1 px-1.5 text-gray-400 hover:text-red-500 rounded transition"><TrashIcon className="w-3.5 h-3.5" /></button>
                                                </div>
                                                {/* Tanıtım Videosu URL */}
                                                {les.isPreview && (
                                                    <div className="flex items-center gap-2 pl-14 mt-1">
                                                        <VideoCameraIcon className="w-4 h-4 text-red-500" />
                                                        <input type="text" value={les.previewUrl} onChange={(e) => updateLesson(i, lesIdx, "previewUrl", e.target.value)} className={inputCls + " flex-1 !py-1.5 !px-3 !text-[11px] border-red-200 bg-red-50 focus:border-red-400 font-mono"} placeholder="Video URL'si (veya yandaki butondan yükleyin)" />
                                                        
                                                        <button 
                                                            type="button" 
                                                            disabled={uploadingVideoKey === `${i}-${lesIdx}`}
                                                            onClick={() => { setUploadingVideoKey(`${i}-${lesIdx}`); videoFileInputRef.current?.click(); }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded text-[11px] font-bold transition disabled:opacity-50 shrink-0"
                                                        >
                                                            {uploadingVideoKey === `${i}-${lesIdx}` ? (
                                                                <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Yükleniyor...</>
                                                            ) : (
                                                                <><CloudArrowUpIcon className="w-3.5 h-3.5" />Video Yükle</>
                                                            )}
                                                        </button>
                                                        <p className="text-[9px] text-gray-500 font-medium">16:9 Oran • Maks 20MB • 1920x1080px</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addLesson(i)} className="text-[10px] font-bold text-gray-500 hover:text-purple-600 flex items-center gap-1 mt-1">
                                            + Alt Ders Ekle
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ======================= EĞİTMEN(LER) ======================= */}
                    <div id="section-egitmen" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 border-t-4 border-t-rose-500 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-400" /> Eğitmen Kadrosu</h2>
                            <button type="button" onClick={addInstructor} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                                <PlusIcon className="w-3.5 h-3.5" /> Eğitmen Ekle
                            </button>
                        </div>
                        <input type="file" ref={instructorPhotoInputRef} onChange={handleInstructorPhotoUpload} accept="image/*" className="hidden" />
                        <div className="space-y-4">
                            {instructors.map((inst, i) => (
                                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 relative">
                                    {instructors.length > 1 && <button type="button" onClick={() => removeInstructor(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>}
                                    <div className="flex items-center gap-4">
                                        {/* Fotoğraf Upload */}
                                        <div className="shrink-0">
                                            {inst.image ? (
                                                <div className="relative group">
                                                    <img src={inst.image} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                                                    <button type="button" onClick={() => { setUploadingInstructorPhoto(i); instructorPhotoInputRef.current?.click(); }} className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                        <CloudArrowUpIcon className="w-5 h-5 text-white" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => { setUploadingInstructorPhoto(i); instructorPhotoInputRef.current?.click(); }}
                                                    className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition">
                                                    <CloudArrowUpIcon className="w-5 h-5" />
                                                    <span className="text-[8px] font-bold">Foto</span>
                                                </button>
                                            )}
                                            <p className="text-[9px] text-gray-400 mt-1.5 text-center">1:1 Kare<br/>Maks 5MB (Önerilen 3MB)</p>
                                        </div>
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <div><label className={labelCls}>Ad Soyad</label>
                                                <input type="text" value={inst.name} onChange={(e) => updateInstructor(i, "name", e.target.value)} className={inputCls + " !bg-white !py-2"} placeholder="Prof. Dr. Ahmet Yılmaz" /></div>
                                            <div><label className={labelCls}>Unvan / Branş</label>
                                                <input type="text" value={inst.title} onChange={(e) => updateInstructor(i, "title", e.target.value)} className={inputCls + " !bg-white !py-2"} placeholder="İktisat Uzmanı" /></div>
                                        </div>
                                    </div>
                                    <div><label className={labelCls}>Kısa Biyografi</label>
                                        <textarea value={inst.bio} onChange={(e) => updateInstructor(i, "bio", e.target.value)} rows={2} className={inputCls + " resize-none !bg-white text-xs"} placeholder="Alanında 15+ yıl deneyimli, binlerce öğrenciyi başarıya ulaştırmış..." /></div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <label className={labelCls}>Detaylı Hoca Kadrosu Metni (Opsiyonel)</label>
                            <p className="text-xs text-gray-400 mb-2">Eğer kartlı yapı yerine "İktisat Grubu", "Maliye Grubu" gibi gruplandırılmış düz metin bir hoca listesi oluşturmak isterseniz bu alanı kullanabilirsiniz. Burası doldurulursa, ön yüzde kartlar yerine bu yazı görünür.</p>
                            <RichTextEditor 
                                value={instructorList || ""} 
                                onChange={setInstructorList} 
                                minHeight="120px"
                            />
                        </div>
                    </div>

                    {/* ======================= KUPONLAR ======================= */}
                    <div id="section-kuponlar" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 border-t-4 border-t-orange-500 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><TicketIcon className="w-4 h-4 text-gray-400" /> İndirim Kuponları</h2>
                            <button type="button" onClick={() => setCoupons([...coupons, { code: "", type: "PERCENT", amount: "", maxUses: "", expiresAt: "", isActive: true }])} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
                                <PlusIcon className="w-3.5 h-3.5" /> Kupon Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Bu ürüne özel indirim kuponları oluşturun. Kuponlar sadece bu kursta geçerli olacaktır.</p>
                        <div className="space-y-3">
                            {coupons.map((c, i) => (
                                <div key={i} className={`border rounded-xl p-4 space-y-3 ${c.isExisting ? 'bg-gray-50 border-gray-200' : 'bg-orange-50/30 border-orange-200'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TicketIcon className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs font-bold text-gray-600">{c.isExisting ? 'Mevcut Kupon' : 'Yeni Kupon'}</span>
                                            {c.isExisting && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Kullanım: {course?.coupons?.find(k => k.id === c.id)?.usedCount || 0}</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => { const n = [...coupons]; n[i] = { ...n[i], isActive: !n[i].isActive }; setCoupons(n); }} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${c.isActive ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${c.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </button>
                                            <button type="button" onClick={() => setCoupons(coupons.filter((_, idx) => idx !== i))} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <label className={labelCls}>Kupon Kodu *</label>
                                            <input type="text" value={c.code} required onChange={e => { const n = [...coupons]; n[i] = { ...n[i], code: e.target.value }; setCoupons(n); }} className={inputCls + " uppercase font-mono font-bold !py-2"} placeholder="YAZ2025" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Tip</label>
                                            <select value={c.type} onChange={e => { const n = [...coupons]; n[i] = { ...n[i], type: e.target.value }; setCoupons(n); }} className={inputCls + " !py-2 bg-white"}>
                                                <option value="PERCENT">Yüzde (%)</option>
                                                <option value="FIXED">Sabit (₺)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Miktar *</label>
                                            <input type="number" value={c.amount} required min="1" step="0.01" onChange={e => { const n = [...coupons]; n[i] = { ...n[i], amount: e.target.value }; setCoupons(n); }} className={inputCls + " !py-2"} placeholder={c.type === 'PERCENT' ? '20' : '500'} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Max Kullanım</label>
                                            <input type="number" value={c.maxUses} min="1" onChange={e => { const n = [...coupons]; n[i] = { ...n[i], maxUses: e.target.value }; setCoupons(n); }} className={inputCls + " !py-2"} placeholder="∞" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelCls} suppressHydrationWarning>Son Geçerlilik</label>
                                            <input type="datetime-local" suppressHydrationWarning value={c.expiresAt} onChange={e => { const n = [...coupons]; n[i] = { ...n[i], expiresAt: e.target.value }; setCoupons(n); }} className={inputCls + " !py-2"} />
                                        </div>
                                        <div className="flex items-end">
                                            <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono w-full">
                                                {c.code ? <span className="font-bold text-orange-600">{c.code.toUpperCase()}</span> : <span className="text-gray-300">KUPON_KODU</span>}
                                                {' → '}
                                                <span className="font-bold text-green-600">{c.type === 'PERCENT' ? `%${c.amount || '?'} indirim` : `₺${c.amount || '?'} indirim`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {coupons.length === 0 && (
                                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
                                    <TicketIcon className="w-8 h-8 mx-auto text-gray-200 mb-2" />
                                    <p className="text-xs text-gray-400 font-medium">Henüz kupon eklenmedi</p>
                                    <p className="text-[10px] text-gray-300 mt-1">Yukarıdaki &quot;Kupon Ekle&quot; butonuyla bu ürüne özel kuponlar oluşturabilirsiniz.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Alt Bar */}
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 -mx-6 px-6 py-3 flex items-center justify-between gap-3 z-50">
                <div className="flex items-center gap-2">
                    {hasChanges && <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg animate-pulse">Kaydedilmemiş değişiklikler var</span>}
                </div>
                <div className="flex items-center gap-3">
                <Link href="/admin/kurslar" className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition text-sm">İptal</Link>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B1221] text-white font-bold rounded-xl hover:bg-[#0B1221]/90 transition disabled:opacity-50 shadow-lg shadow-gray-300 text-sm">
                    {saving ? "Kaydediliyor…" : <><CheckIcon className="h-4 w-4" />{mode === "create" ? "Ürünü Oluştur" : "Değişiklikleri Kaydet"}</>}
                </button>
            </div>
            </div>

            {/* Toast Popup */}
            {toast && (
                <div className={`fixed bottom-20 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up-fade ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.type === "success" ? <CheckIcon className="w-6 h-6" /> : <XMarkIcon className="w-6 h-6" />}
                    <div>
                        <div className="font-bold text-sm">{toast.type === "success" ? "Başarılı!" : "Hata!"}</div>
                        <div className="text-xs opacity-90">{toast.message}</div>
                    </div>
                </div>
            )}
        </form>
    );
}
