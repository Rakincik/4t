"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeftIcon, CheckIcon, XMarkIcon, CloudArrowUpIcon, PlusIcon, TrashIcon,
    FireIcon, BookOpenIcon, ClockIcon, PlayCircleIcon, UsersIcon,
    TagIcon, FilmIcon, UserIcon, TicketIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { stripHtml } from "@/lib/htmlUtils";
import RichTextEditor from "@/app/components/RichTextEditor";

interface FlixPackage {
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
    isActive: boolean;
    hours: string | null;
    questions: string | null;
    bookPrice: number | null;
    badge: string | null;
    features: any;
    episodes: any;
    cast: any;
    tags: any;
    variants?: any;
    coupons?: any;
    instructorList?: string | null;
    sortOrder?: number;
    isCouponApplicable?: boolean;
}

interface FlixFormProps {
    mode: "create" | "edit";
    pkg?: FlixPackage;
    onSave: (formData: FormData) => Promise<any>;
}



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

function parseJson(val: any, fb: any) {
    if (Array.isArray(val) || (typeof val === "object" && val !== null)) return val;
    if (typeof val === "string") { try { return JSON.parse(val); } catch { return fb; } }
    return fb;
}

const BADGES = ["", "En Popüler", "Çok Satan", "Yeni", "Yeni Sezon", "Kampanya", "Sınırlı"];

export default function FlixForm({ mode, pkg, onSave }: FlixFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const introVideoInputRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingIntroVideo, setUploadingIntroVideo] = useState(false);
    const videoFileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingVideoKey, setUploadingVideoKey] = useState<number | null>(null);
    const castPhotoInputRef = useRef<HTMLInputElement>(null);
    const [uploadingCastPhoto, setUploadingCastPhoto] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);

    // Temel
    const [title, setTitle] = useState(pkg?.title || "");
    const [slug, setSlug] = useState(pkg?.slug || "");
    const [subtitle, setSubtitle] = useState(pkg?.subtitle || "");
    const [description, setDescription] = useState(pkg?.description || "");
    const [price, setPrice] = useState(pkg?.price?.toString() || "");
    const [oldPrice, setOldPrice] = useState(pkg?.oldPrice?.toString() || "");
    const [imageUrl, setImageUrl] = useState(pkg?.imageUrl || "");
    const [videoUrl, setVideoUrl] = useState(pkg?.videoUrl || "");
    const [hours, setHours] = useState(pkg?.hours || "");
    const [questions, setQuestions] = useState(pkg?.questions || "");
    const [bookPrice, setBookPrice] = useState(pkg?.bookPrice?.toString() || "");
    const [badge, setBadge] = useState(pkg?.badge || "");
    const [isActive, setIsActive] = useState(pkg?.isActive ?? true);
    const [isCouponApplicable, setIsCouponApplicable] = useState(pkg?.isCouponApplicable ?? true);
    const [sortOrder, setSortOrder] = useState(pkg?.sortOrder?.toString() || "999");

    // FLIX'e özel
    const [features, setFeatures] = useState<string[]>(parseJson(pkg?.features, [""]));
    const [episodes, setEpisodes] = useState<{ title: string; duration: string; description: string; isPreview?: boolean; previewUrl?: string }[]>(
        parseJson(pkg?.episodes, [{ title: "", duration: "", description: "", isPreview: false, previewUrl: "" }])
    );
    const [cast, setCast] = useState<{ name: string; role: string; img: string }[]>(
        parseJson(pkg?.cast, [{ name: "", role: "", img: "" }])
    );
    const [tags, setTags] = useState<string[]>(parseJson(pkg?.tags, [""]));
    const [instructorList, setInstructorList] = useState(pkg?.instructorList || "");
    const [variants, setVariants] = useState<{ id?: string; title: string; price: string; oldPrice: string; order: number; accessDurationDays?: string }[]>(
        pkg?.variants?.map((v: any) => ({ id: v.id, title: v.title, price: v.price.toString(), oldPrice: v.oldPrice?.toString() || "", order: v.order, accessDurationDays: v.accessDurationDays?.toString() || "" })) || []
    );
    const [coupons, setCoupons] = useState<{ code: string; type: string; amount: string; maxUses: string; expiresAt: string; isActive: boolean; isExisting?: boolean; id?: string }[]>(
        pkg?.coupons?.map((c: any) => ({
            id: c.id,
            code: c.code,
            type: c.type,
            amount: c.amount.toString(),
            maxUses: c.maxUses?.toString() || "",
            expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 16) : "",
            isActive: c.isActive,
            isExisting: true
        })) || []
    );

    const handleTitleChange = (v: string) => { setTitle(v); if (mode === "create") setSlug(slugify(v + "-flix")); };

    // Variant Helpers
    const addVariant = () => setVariants([...variants, { title: "", price: "", oldPrice: "", order: variants.length, accessDurationDays: "" }]);
    const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
    const updateVariant = (i: number, field: string, val: string) => { const n = [...variants]; (n[i] as any)[field] = val; setVariants(n); };

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; if (!file) return;
        setUploading(true); setError(null);
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.error) setError(data.error); else setImageUrl(data.url);
        } catch { setError("Görsel yüklenemedi."); }
        finally { setUploading(false); }
    }

    async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || uploadingVideoKey === null) return;
        
        const i = uploadingVideoKey;
        
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.error) setError(data.error); 
            else { const n = [...episodes]; n[i].previewUrl = data.url; setEpisodes(n); }
        } catch { setError("Video yüklenirken hata oluştu."); }
        finally { 
            setUploadingVideoKey(null); 
            if (videoFileInputRef.current) videoFileInputRef.current.value = ""; 
        }
    }

    async function handleCastPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || uploadingCastPhoto === null) return;
        const idx = uploadingCastPhoto;
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!data.error) {
                const n = [...cast];
                n[idx].img = data.url;
                setCast(n);
            }
        } catch {}
        finally { setUploadingCastPhoto(null); if (castPhotoInputRef.current) castPhotoInputRef.current.value = ""; }
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
            fd.append("videoUrl", videoUrl);
            fd.append("category", "flix");
            fd.append("type", "FLIX");
            fd.append("isActive", isActive.toString());
            fd.append("isCouponApplicable", isCouponApplicable.toString());
            fd.append("sortOrder", sortOrder);
            fd.append("hours", hours);
            fd.append("questions", questions);
            fd.append("bookPrice", bookPrice);
            fd.append("badge", badge);
            fd.append("features", JSON.stringify(features.filter(f => f.trim() !== "")));
            fd.append("episodes", JSON.stringify(episodes.filter(ep => ep.title.trim() !== "" || ep.duration.trim() !== "" || (ep.description && ep.description.replace(/<[^>]*>/g, '').trim() !== ''))));
            fd.append("cast", JSON.stringify(cast.filter(c => c.name.trim() !== "" || c.role.trim() !== "" || c.img.trim() !== "")));
            fd.append("tags", JSON.stringify(tags.filter(t => t.trim() !== "")));
            if (instructorList) fd.append("instructorList", instructorList);
            fd.append("variants", JSON.stringify(variants.filter(v => v.title.trim())));
            fd.append("coupons", JSON.stringify(coupons.map(c => ({
                id: c.id,
                code: c.code.trim().toUpperCase(),
                type: c.type,
                amount: parseFloat(c.amount) || 0,
                maxUses: c.maxUses ? parseInt(c.maxUses) : null,
                expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString() : null,
                isActive: c.isActive
            }))));
            await onSave(fd);
            if (mode === "create") {
                setToast({ message: "Paket başarıyla oluşturuldu! Yönlendiriliyorsunuz...", type: "success" });
                setTimeout(() => {
                    router.push("/admin/flix");
                    router.refresh();
                }, 1500);
            } else {
                setHasChanges(false);
                setToast({ message: "Paket başarıyla güncellendi!", type: "success" });
                setTimeout(() => setToast(null), 3000);
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || "Hata oluştu");
            setToast({ message: err.message || "Bir hata oluştu, kaydedilemedi.", type: "error" });
            setTimeout(() => setToast(null), 3000);
        }
        finally { setSaving(false); }
    }

    const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition";
    const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleSubmit} onChangeCapture={() => setHasChanges(true)} className="space-y-6 max-w-5xl relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/flix" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeftIcon className="h-5 w-5 text-gray-500" /></Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{mode === "create" ? "Yeni FLIX Paketi" : "FLIX Düzenle"}</h1>
                        <p className="text-sm text-gray-500">Video eğitim paketi oluşturun veya düzenleyin.</p>
                    </div>
                </div>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-50 shadow-lg text-sm">
                    {saving ? "Kaydediliyor…" : <><CheckIcon className="h-4 w-4" />{mode === "create" ? "Oluştur" : "Kaydet"}</>}
                </button>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

            {/* Hidden Input for Video */}
            <input type="file" ref={videoFileInputRef} onChange={handleVideoUpload} accept="video/mp4,video/webm,video/ogg,video/quicktime" className="hidden" />
            <input type="file" ref={castPhotoInputRef} onChange={handleCastPhotoUpload} accept="image/*" className="hidden" />
            <input type="file" ref={introVideoInputRef} onChange={handleIntroVideoUpload} accept="video/mp4,video/webm,video/ogg,video/quicktime" className="hidden" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SOL — ANA İÇERİK */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Paket Bilgileri */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><FireIcon className="w-4 h-4 text-purple-500" /> Paket Bilgileri</h2>
                        <div>
                            <label className={labelCls}>Paket Adı *</label>
                            <RichTextEditor 
                                value={title} 
                                onChange={handleTitleChange} 
                                minHeight="60px"
                                simple={true}
                                placeholder="Örn: Kaymakamlık FLIX"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Kısa Açıklama</label>
                            <RichTextEditor 
                                value={subtitle || ""} 
                                onChange={setSubtitle} 
                                minHeight="100px"
                                placeholder="Mülki İdare Amirliği sınavına özel tüm dersler."
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className={labelCls}>URL Slug *</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-400 text-xs font-mono">/flix/</span>
                                    <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className={inputCls + " rounded-l-none font-mono"} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Detaylı Açıklama (Detay Sayfası)</label>
                            <RichTextEditor 
                                value={description || ""} 
                                onChange={setDescription} 
                                minHeight="150px"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Önizleme Videosu (Tanıtım)</label>
                            {videoUrl ? (
                                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center shrink-0">
                                        <PlayCircleIcon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-green-800 truncate">Video Yüklendi</p>
                                        <a href={videoUrl} target="_blank" rel="noreferrer" className="text-[10px] text-green-600 hover:underline truncate block">{videoUrl}</a>
                                    </div>
                                    <button type="button" onClick={() => setVideoUrl("")} className="p-1.5 hover:bg-green-200 rounded-lg transition-colors text-green-700">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button type="button" onClick={() => introVideoInputRef.current?.click()} className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all gap-2 cursor-pointer bg-gray-50">
                                    {uploadingIntroVideo 
                                    ? <span className="text-xs">Yükleniyor...</span> 
                                    : <><FilmIcon className="w-6 h-6" /><span className="text-[10px] font-bold">Tanıtım Videosu Yükle (Max 5dk)</span></>}
                                </button>
                            )}
                            <p className="text-[10px] text-gray-400 mt-2">16:9 Oran • Maks 30MB • Önerilen: 1920x1080px (MP4/WebM)</p>
                        </div>
                    </div>

                    {/* Fiyatlandırma */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><BookOpenIcon className="w-4 h-4 text-purple-500" /> Fiyatlandırma & Abonelik</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Mevcut Fiyat (₺)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className={inputCls} placeholder="12500" />
                            </div>
                            <div>
                                <label className={labelCls}>Eski Fiyat (₺)</label>
                                <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className={inputCls} placeholder="18000" />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}><span className="text-purple-600">Opsiyonel:</span> Kitap Seti Farkı (₺)</label>
                            <input type="number" value={bookPrice} onChange={(e) => setBookPrice(e.target.value)} className={inputCls} placeholder="2000" />
                            <p className="text-[10px] text-gray-400 mt-1">Sadece kitap eklentisi fiyatı girilecekse (tüm varyasyonlarda geçerli olur).</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelCls}><ClockIcon className="inline w-3.5 h-3.5 mr-1" /> Toplam Ders Saati</label>
                                <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} className={inputCls} placeholder="3.500+" /></div>
                            <div><label className={labelCls}><PlayCircleIcon className="inline w-3.5 h-3.5 mr-1" /> Video Çözümlü Soru</label>
                                <input type="text" value={questions} onChange={(e) => setQuestions(e.target.value)} className={inputCls} placeholder="12.000+" /></div>
                        </div>
                        {/* Varyasyonlar (Süre Seçenekleri) */}
                        <div className="mt-6 border-t border-gray-100 pt-5">
                            <div className="flex items-center justify-between mb-3">
                                <label className={labelCls + " !mb-0"}>Abonelik Süresi Seçenekleri</label>
                                <button type="button" onClick={addVariant} className="text-[10px] font-bold text-white bg-[#0B1221] px-2 py-1 rounded hover:bg-gray-800 transition">+ Ekle</button>
                            </div>
                            <p className="text-[10px] text-gray-500 mb-3">Eğer 3 Aylık, 6 Aylık gibi seçenekler eklemek istiyorsanız yukarıdaki fiyata ek olarak buradan varyasyon girebilirsiniz.</p>
                            
                            <div className="space-y-3">
                                {variants.map((v: any, i: number) => (
                                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 relative">
                                        <button type="button" onClick={() => removeVariant(i)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                        <input type="text" value={v.title} onChange={(e) => updateVariant(i, "title", e.target.value)} className={inputCls + " !py-1.5 !text-xs"} placeholder="Örn: 3 Aylık Erişim" />
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                            <input type="number" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} className={inputCls + " !py-1.5 !text-xs"} placeholder="Fiyat (₺)" />
                                            <input type="number" value={v.oldPrice} onChange={(e) => updateVariant(i, "oldPrice", e.target.value)} className={inputCls + " !py-1.5 !text-xs"} placeholder="Eski Fiyat (₺)" />
                                            <input type="number" value={v.accessDurationDays || ""} onChange={(e) => updateVariant(i, "accessDurationDays", e.target.value)} className={inputCls + " !py-1.5 !text-xs"} placeholder="Süre (Gün) Örn: 90" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Platform Özellikleri */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><FilmIcon className="w-4 h-4 text-purple-500" /> Platform Özellikleri</h2>
                            <button type="button" onClick={() => setFeatures([...features, ""])} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <PlusIcon className="w-3.5 h-3.5" /> Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">FLIX sayfasında gösterilecek özellikler (örn: "20.000+ Saat Ders Videosu", "Sınırsız Tekrar Hakkı")</p>
                        <div className="space-y-2">
                            {features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <input type="text" value={f} onChange={(e) => { const n = [...features]; n[i] = e.target.value; setFeatures(n); }} className={inputCls + " flex-1"} placeholder="Özellik yazın..." />
                                    {features.length > 1 && <button type="button" onClick={() => setFeatures(features.filter((_: any, idx: number) => idx !== i))} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ders Bölümleri (Episodes) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><PlayCircleIcon className="w-4 h-4 text-purple-500" /> Ders Bölümleri</h2>
                            <button type="button" onClick={() => setEpisodes([...episodes, { title: "", duration: "", description: "" }])} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <PlusIcon className="w-3.5 h-3.5" /> Bölüm Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">FLIX detay sayfasındaki ders listesi — Netflix tarzı bölüm/sezon yapısı</p>
                        <div className="space-y-3">
                            {episodes.map((ep, i) => (
                                <div key={i} className="bg-gray-50 rounded-lg border border-gray-100 p-3 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-400 w-6">{i + 1}</span>
                                        <input type="text" value={ep.title} onChange={(e) => { const n = [...episodes]; n[i] = { ...n[i], title: e.target.value }; setEpisodes(n); }} className={inputCls + " flex-1 !bg-white"} placeholder="Anayasa Hukuku: Temel Kavramlar" />
                                        <input type="text" value={ep.duration} onChange={(e) => { const n = [...episodes]; n[i] = { ...n[i], duration: e.target.value }; setEpisodes(n); }} className={inputCls + " w-24 !bg-white"} placeholder="45dk" />
                                        
                                        <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-200">
                                            <input type="checkbox" checked={ep.isPreview || false} onChange={(e) => { const n = [...episodes]; n[i] = { ...n[i], isPreview: e.target.checked }; setEpisodes(n); }} className="text-purple-600 rounded w-3 h-3" />
                                            Tanıtım
                                        </label>

                                        {episodes.length > 1 && <button type="button" onClick={() => setEpisodes(episodes.filter((_: any, idx: number) => idx !== i))} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>}
                                    </div>
                                    {ep.isPreview && (
                                        <div className="flex items-center gap-2 pl-9 mt-1">
                                            <PlayCircleIcon className="w-4 h-4 text-red-500" />
                                            <input type="text" value={ep.previewUrl || ""} onChange={(e) => { const n = [...episodes]; n[i] = { ...n[i], previewUrl: e.target.value }; setEpisodes(n); }} className={inputCls + " flex-1 !bg-red-50 !border-red-200 max-w-sm !py-1 text-xs font-mono"} placeholder="Video URL'si (veya yandaki butondan yükleyin)" />
                                            <button 
                                                type="button" 
                                                disabled={uploadingVideoKey === i}
                                                onClick={() => { setUploadingVideoKey(i); videoFileInputRef.current?.click(); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded text-[11px] font-bold transition disabled:opacity-50 shrink-0"
                                            >
                                                {uploadingVideoKey === i ? (
                                                    <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Yükleniyor...</>
                                                ) : (
                                                    <><CloudArrowUpIcon className="w-3.5 h-3.5" />Video Yükle</>
                                                )}
                                            </button>
                                            <p className="text-[9px] text-gray-500 font-medium">16:9 Oran • Maks 20MB • 1920x1080px (MP4)</p>
                                        </div>
                                    )}
                                    <RichTextEditor 
                                        value={ep.description} 
                                        onChange={(val) => { const n = [...episodes]; n[i] = { ...n[i], description: val }; setEpisodes(n); }} 
                                        simple={true}
                                        minHeight="80px"
                                        placeholder="Bu derste temel kavramlar işlenecektir..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Eğitmen Kadrosu (Cast) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><UsersIcon className="w-4 h-4 text-purple-500" /> Eğitmen Kadrosu</h2>
                            <button type="button" onClick={() => setCast([...cast, { name: "", role: "", img: "" }])} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <PlusIcon className="w-3.5 h-3.5" /> Eğitmen Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Detay sayfasında gösterilen eğitmen kadrosu</p>
                        <div className="space-y-3">
                            {cast.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-100 p-3">
                                    <UserIcon className="w-5 h-5 text-gray-300 shrink-0" />
                                    <input type="text" value={c.name} onChange={(e) => { const n = [...cast]; n[i] = { ...n[i], name: e.target.value }; setCast(n); }} className={inputCls + " flex-1 !bg-white"} placeholder="Ahmet Albayrak" />
                                    <input type="text" value={c.role} onChange={(e) => { const n = [...cast]; n[i] = { ...n[i], role: e.target.value }; setCast(n); }} className={inputCls + " w-36 !bg-white"} placeholder="Anayasa Hukuku" />
                                    {c.img ? (
                                        <div className="relative group shrink-0">
                                            <img src={c.img} className="w-10 h-10 rounded-full object-cover border" />
                                            <button type="button" onClick={() => { setUploadingCastPhoto(i); castPhotoInputRef.current?.click(); }} className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <CloudArrowUpIcon className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => { setUploadingCastPhoto(i); castPhotoInputRef.current?.click(); }}
                                            className="w-10 h-10 shrink-0 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-500 transition">
                                            <CloudArrowUpIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                    {cast.length > 1 && <button type="button" onClick={() => setCast(cast.filter((_: any, idx: number) => idx !== i))} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>}
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

                    {/* Kuponlar */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <TicketIcon className="w-4 h-4 text-purple-500" /> Kupon Yönetimi
                            </h2>
                            <button 
                                type="button" 
                                onClick={() => setCoupons([...coupons, { code: "", type: "PERCENT", amount: "", maxUses: "", expiresAt: "", isActive: true }])} 
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                            >
                                <PlusIcon className="w-3.5 h-3.5" /> Kupon Ekle
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Bu pakete özel geçerli indirim kuponları oluşturun.</p>
                        
                        {coupons.length === 0 ? (
                            <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-xs">
                                Henüz bu pakete özel bir kupon oluşturulmamış. "Kupon Ekle" butonunu kullanarak oluşturabilirsiniz.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {coupons.map((c, i) => (
                                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 relative">
                                        <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                                            <span className="text-[11px] font-bold text-gray-500 uppercase">KUPON #{i + 1}</span>
                                            <div className="flex items-center gap-2">
                                                {c.isExisting && (
                                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                                                        Kullanım: {pkg?.coupons?.find((k: any) => k.id === c.id)?.usedCount || 0}
                                                    </span>
                                                )}
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const n = [...coupons];
                                                        n[i] = { ...n[i], isActive: !n[i].isActive };
                                                        setCoupons(n);
                                                    }} 
                                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${c.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                                >
                                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${c.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setCoupons(coupons.filter((_, idx) => idx !== i))} 
                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                            <div className="lg:col-span-2">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kupon Kodu *</label>
                                                <input 
                                                    type="text" 
                                                    value={c.code} 
                                                    required 
                                                    onChange={e => {
                                                        const n = [...coupons];
                                                        n[i] = { ...n[i], code: e.target.value };
                                                        setCoupons(n);
                                                    }} 
                                                    className={inputCls + " uppercase font-mono font-bold !py-1.5 !text-xs"} 
                                                    placeholder="KAMPANYA20" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tür</label>
                                                <select 
                                                    value={c.type} 
                                                    onChange={e => {
                                                        const n = [...coupons];
                                                        n[i] = { ...n[i], type: e.target.value };
                                                        setCoupons(n);
                                                    }} 
                                                    className={inputCls + " !py-1.5 !text-xs bg-white"}
                                                >
                                                    <option value="PERCENT">Yüzde (%)</option>
                                                    <option value="FIXED">Sabit (₺)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Miktar *</label>
                                                <input 
                                                    type="number" 
                                                    value={c.amount} 
                                                    required 
                                                    min="1" 
                                                    step="0.01" 
                                                    onChange={e => {
                                                        const n = [...coupons];
                                                        n[i] = { ...n[i], amount: e.target.value };
                                                        setCoupons(n);
                                                    }} 
                                                    className={inputCls + " !py-1.5 !text-xs"} 
                                                    placeholder={c.type === 'PERCENT' ? '20' : '500'} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Limit (Adet)</label>
                                                <input 
                                                    type="number" 
                                                    value={c.maxUses} 
                                                    min="1" 
                                                    onChange={e => {
                                                        const n = [...coupons];
                                                        n[i] = { ...n[i], maxUses: e.target.value };
                                                        setCoupons(n);
                                                    }} 
                                                    className={inputCls + " !py-1.5 !text-xs"} 
                                                    placeholder="Sınırsız" 
                                                />
                                            </div>
                                            <div className="lg:col-span-2">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Son Geçerlilik Tarihi</label>
                                                <input 
                                                    type="datetime-local" 
                                                    suppressHydrationWarning 
                                                    value={c.expiresAt} 
                                                    onChange={e => {
                                                        const n = [...coupons];
                                                        n[i] = { ...n[i], expiresAt: e.target.value };
                                                        setCoupons(n);
                                                    }} 
                                                    className={inputCls + " !py-1.5 !text-xs"} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* SAĞ PANEL */}
                <div className="space-y-6">
                    {/* Görsel */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                        <h2 className="text-xs font-bold text-gray-700">Paket Görseli</h2>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        {imageUrl ? (
                            <div className="relative group">
                                <img src={imageUrl} alt="" className="w-full h-40 object-cover rounded-lg border" />
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-2 py-1.5 bg-white text-gray-900 rounded text-[10px] font-bold">Değiştir</button>
                                    <button type="button" onClick={() => setImageUrl("")} className="px-2 py-1.5 bg-red-500 text-white rounded text-[10px] font-bold">Kaldır</button>
                                </div>
                            </div>
                        ) : (
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 transition flex flex-col items-center justify-center gap-1 text-gray-400">
                                {uploading ? <span className="text-xs">Yükleniyor...</span> : <><CloudArrowUpIcon className="w-8 h-8" /><span className="text-[10px] font-bold">Görsel Yükle</span></>}
                            </button>
                        )}
                        <p className="text-[10px] text-gray-400 mt-2 text-center leading-tight">16:9 Oran • Maks 5MB • Önerilen: 1920x1080px veya 1280x720px</p>
                    </div>

                    {/* Durum + Kupon + Rozet */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
                        
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
                            <label className={labelCls}>Rozet</label>
                            <select value={badge} onChange={(e) => setBadge(e.target.value)} className={inputCls + " !py-2 bg-white"}>
                                {BADGES.map((b) => <option key={b} value={b}>{b || "Yok"}</option>)}
                            </select>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <label className={labelCls}>Sıralama (Öncelik)</label>
                            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputCls} placeholder="999" min="0" />
                            <p className="text-[9px] text-gray-400 mt-1">Düşük sayılar (ör. 1, 2, 3) önce gösterilir. Varsayılan: 999</p>
                        </div>
                    </div>

                    {/* Etiketler */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold text-gray-700 flex items-center gap-1"><TagIcon className="w-3.5 h-3.5" /> Etiketler</h2>
                            <button type="button" onClick={() => setTags([...tags, ""])} className="text-xs text-purple-600 font-bold">+ Ekle</button>
                        </div>
                        <p className="text-[10px] text-gray-400">Detay sayfasında gösterilecek kategori etiketleri</p>
                        <div className="space-y-2">
                            {tags.map((t: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input type="text" value={t} onChange={(e) => { const n = [...tags]; n[i] = e.target.value; setTags(n); }} className={inputCls + " flex-1 !py-1.5 text-xs"} placeholder="Hukuk" />
                                    {tags.length > 1 && <button type="button" onClick={() => setTags(tags.filter((_: any, idx: number) => idx !== i))} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-3.5 h-3.5" /></button>}
                                </div>
                            ))}
                        </div>
                    </div>
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
