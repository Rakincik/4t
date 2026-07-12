"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    PlayCircleIcon,
    PlusIcon,
    CheckCircleIcon,
    ClockIcon,
    ArrowLeftIcon,
    LockClosedIcon,
    ShoppingCartIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    XMarkIcon
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/components/cart/cartStore";

/* ===================================================== */
/* HELPERS & TYPES                                       */
/* ===================================================== */
function parseJson(val: any, fb: any) {
    if (Array.isArray(val) || (typeof val === "object" && val !== null)) return val;
    if (typeof val === "string") { try { return JSON.parse(val); } catch { return fb; } }
    return fb;
}

export default function FlixDetailClient({ course }: { course: any }) {

    const episodes = parseJson(course.episodes, []);
    const cast = parseJson(course.cast, []);
    const features = parseJson(course.features, []);
    const tags = parseJson(course.tags, []);
    const isMainFlix = course.slug.startsWith("4t-flix-kurum-sinavlari-ve-kpss-a-egitimi-");
    let variants = course.variants && course.variants.length > 0 
        ? course.variants.sort((a: any, b: any) => a.order - b.order) 
        : [{ id: "v_base", title: "Varsayılan", price: course.price, oldPrice: course.oldPrice }];

    if (isMainFlix) {
        variants = [
            { id: "aylik", title: "1 Aylık", price: 3900, oldPrice: 4100, slug: "4t-flix-kurum-sinavlari-ve-kpss-a-egitimi-aylik-abonelik" },
            { id: "3aylik", title: "3 Aylık", price: 9500, oldPrice: 55000, slug: "4t-flix-kurum-sinavlari-ve-kpss-a-egitimi-3-aylik-abonelik" },
            { id: "6aylik", title: "6 Aylık", price: 17000, oldPrice: 55000, slug: "4t-flix-kurum-sinavlari-ve-kpss-a-egitimi-6-aylik-abonelik" },
            { id: "yillik", title: "Yıllık", price: 30000, oldPrice: 55000, slug: "4t-flix-kurum-sinavlari-ve-kpss-a-egitimi-yillik-abonelik" }
        ];
    }

    const { add } = useCart();
    const router = useRouter();
    const [withBook, setWithBook] = useState(false);
    
    const initialVariantId = isMainFlix 
        ? (variants.find(v => v.slug === course.slug)?.id || variants[0]?.id)
        : (variants[0]?.id);

    const [selectedVariantId, setSelectedVariantId] = useState(initialVariantId);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const selectedVariant = variants.find((v: any) => v.id === selectedVariantId) || variants[0];

    const handleVariantChange = (v: any) => {
        if (isMainFlix) {
            router.push(`/flix/${v.slug}`);
        } else {
            setSelectedVariantId(v.id);
        }
    };
    
    const bookPrice = course.bookPrice || 0;
    const basePrice = selectedVariant.price;
    const originalPrice = selectedVariant.oldPrice || basePrice;
    const totalPrice = withBook ? basePrice + bookPrice : basePrice;

    const product = {
        id: `flix-${course.id}-${selectedVariantId}${withBook ? '-book' : ''}`,
        slug: course.slug,
        title: withBook ? `${course.title} (${selectedVariant.title}) + Kitap Seti` : `${course.title} (${selectedVariant.title})`,
        price: totalPrice,
        originalPrice: originalPrice,
        imageUrl: course.imageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop",
        category: "FLIX",
        qty: 1,
        isCouponApplicable: course.isCouponApplicable,
        isInstallmentApplicable: course.isInstallmentApplicable ?? true
    };

    const handleAddToCart = () => { add(product, { openDrawer: true }); };
    const handleBuyNow = () => { add(product, { openDrawer: false }); router.push("/sepet"); };

    /* ===================================================== */
    /* PURCHASE CARD COMPONENT (Internal)                    */
    /* ===================================================== */
    function renderPurchaseCard() {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="w-full lg:w-[420px] max-w-lg bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#DC2626]/20 rounded-full blur-3xl group-hover:bg-[#DC2626]/30 transition-colors"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        {course.badge && <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2 py-1 rounded">{course.badge.toUpperCase()}</span>}
                        <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                            <ShieldCheckIcon className="w-3 h-3" />
                            Hemen Teslim
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <ClockIcon className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-[11px] text-blue-300 font-medium">Seçilen: {selectedVariant.title}</span>
                    </div>

                    {variants.length > 1 && (
                        <div className="mb-4">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Abonelik Süresi</div>
                            <div className="grid grid-cols-2 gap-1.5">
                                {variants.map((v: any) => (
                                    <button
                                        key={v.id}
                                        onClick={() => handleVariantChange(v)}
                                        className={`py-2 px-1 rounded-lg text-[11px] leading-tight font-bold transition-all border text-center ${
                                            selectedVariantId === v.id
                                                ? "bg-blue-600 border-blue-500 text-white shadow-md"
                                                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                        }`}
                                    >
                                        {v.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {bookPrice > 0 && (
                        <div className="mb-5">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Kitaplı Seçenek</div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setWithBook(false)}
                                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                                        !withBook
                                            ? "bg-gray-700 border-gray-600 text-white shadow-md"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                    }`}
                                >
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    Sadece Abonelik
                                </button>
                                <button
                                    onClick={() => setWithBook(true)}
                                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                                        withBook
                                            ? "bg-[#DC2626] border-red-500 text-white shadow-md"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                    }`}
                                >
                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                    Kitap Dahil
                                </button>
                            </div>
                            {withBook && (
                                <div className="text-[10px] text-green-400 mt-1.5 flex items-center gap-1">
                                    <CheckCircleIcon className="w-3 h-3" />
                                    Kitap Seti Dahil (+₺{bookPrice.toLocaleString("tr-TR")})
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-5 space-y-1.5 text-sm">
                        {originalPrice > basePrice && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Ürün toplamı</span>
                                <span className="text-gray-400 line-through">₺{originalPrice.toLocaleString("tr-TR")}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-500">İndirimli fiyat</span>
                            <span className="text-white font-bold">₺{basePrice.toLocaleString("tr-TR")}</span>
                        </div>
                        {withBook && bookPrice > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Kitap seti</span>
                                <span className="text-white font-bold">+₺{bookPrice.toLocaleString("tr-TR")}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-white/10">
                            <span className="text-white font-bold">Genel toplam</span>
                            <span className="text-2xl font-black text-white">₺{totalPrice.toLocaleString("tr-TR")}</span>
                        </div>
                        </div>

                    <button
                        onClick={handleBuyNow}
                        className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 hover:shadow-red-900/60 transition-all hover:-translate-y-1 active:translate-y-0 text-lg"
                    >
                        <ShoppingCartIcon className="w-5 h-5" />
                        Satın Al
                    </button>

                    <button
                        onClick={handleAddToCart}
                        className="w-full mt-3 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl border border-white/10 transition-colors text-sm"
                    >
                        Sepete Ekle
                    </button>

                    {features && features.length > 0 ? (
                        <div className="mt-5 pt-5 border-t border-white/10 space-y-2.5">
                            {features.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-5 pt-5 border-t border-white/10 space-y-2.5">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Süre Boyunca Sınırsız Erişim</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Tüm Platformlardan İzleme</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    /* ===================================================== */
    /* DETAIL HERO (Internal)                                */
    /* ===================================================== */
    function DetailHero() {
        return (
            <section className="relative min-h-0 lg:min-h-[80vh] w-full pt-20 lg:pt-32 pb-10 lg:pb-20 flex items-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/70 to-[#0B1221]/30 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-[#0B1221]/80 to-transparent z-10"></div>
                    <Image
                        fill
                        sizes="100vw"
                        src={course.imageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop"}
                        className="object-cover opacity-60"
                        alt={course.title}
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">
                        <div className="flex-1 max-w-2xl order-last lg:order-first min-w-0 w-full">
                            <a href="/flix" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                                <ArrowLeftIcon className="w-5 h-5" />
                                Kataloğa Dön
                            </a>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    {course.badge && <span className="bg-[#DC2626] text-white text-xs font-bold px-2 py-1 rounded">{course.badge.toUpperCase()}</span>}
                                    {tags.length > 0 && <span className="text-gray-300 text-[10px] px-1 rounded uppercase tracking-widest">{tags[0]}</span>}
                                    <span className="border border-gray-500 text-gray-300 text-[10px] px-1 rounded">HD</span>
                                </div>

                                <h1 
                                    className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-none mb-6 [&>p]:inline break-normal [word-break:normal] text-pretty whitespace-normal"
                                    dangerouslySetInnerHTML={{ __html: (course.title || "").replace(/&nbsp;|\u00A0/g, " ") }}
                                />

                                {(course.subtitle || course.description) && (() => {
                                    const descriptionText = course.subtitle || course.description || "";
                                    const cleanText = descriptionText.replace(/<[^>]*>/g, "");
                                    const isLongDescription = cleanText.length > 150;

                                    if (!isLongDescription) {
                                        return (
                                            <div 
                                                className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 font-light break-normal [word-break:normal] text-pretty prose prose-invert max-w-none whitespace-normal"
                                                dangerouslySetInnerHTML={{ __html: descriptionText.replace(/&nbsp;|\u00A0/g, " ") }}
                                            />
                                        );
                                    }

                                    return (
                                        <div className="relative mb-6">
                                            <div 
                                                className={`text-gray-300 text-base md:text-lg leading-relaxed font-light break-normal [word-break:normal] text-pretty prose prose-invert max-w-none whitespace-normal transition-all duration-300 overflow-hidden ${
                                                    !isDescriptionExpanded ? "max-h-[80px] md:max-h-none" : "max-h-[1000px]"
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: descriptionText.replace(/&nbsp;|\u00A0/g, " ") }}
                                            />
                                            {!isDescriptionExpanded && (
                                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0B1221] to-transparent pointer-events-none md:hidden" />
                                            )}
                                            <button
                                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                                className="text-white text-xs font-bold underline hover:text-gray-300 transition-colors md:hidden mt-2 block cursor-pointer"
                                            >
                                                {isDescriptionExpanded ? "Daha Az Göster" : "Devamını Oku..."}
                                            </button>
                                        </div>
                                    );
                                })()}

                                <div className="flex flex-wrap gap-4 items-center">
                                    {course.videoUrl && (
                                        <a href={course.videoUrl} target="_blank" className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                                            <PlayCircleIcon className="w-8 h-8" />
                                            <span>Önizleme</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        <div className="hidden lg:flex w-auto justify-end sticky top-28 self-start">
                            {renderPurchaseCard()}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* ===================================================== */
    /* TABS & EPISODES (Internal)                            */
    /* ===================================================== */
    function EpisodesList() {
        const [activeTab, setActiveTab] = useState(course.description ? "aciklama" : "dersler");
        
        // Tab check
        const showDescription = !!course.description;
        const showEpisodes = episodes && episodes.length > 0;
        const showCast = cast && cast.length > 0;
        const showFeatures = features && features.length > 0;
        const showTags = tags && tags.length > 0;
        
        if (!showDescription && !showEpisodes && !showCast && !showTags && !showFeatures) return null;

        return (
            <section className="bg-[#0B1221] pb-24 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="border-b border-white/10 mb-8 sticky top-0 bg-[#0B1221] z-30 pt-4">
                        <div className="flex gap-8">
                            {showDescription && (
                                <button onClick={() => setActiveTab("aciklama")} className={`pb-4 text-lg font-bold transition-colors border-b-4 ${activeTab === "aciklama" ? "text-white border-[#DC2626]" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                                    Detaylı Açıklama
                                </button>
                            )}
                            <button onClick={() => setActiveTab("dersler")} className={`pb-4 text-lg font-bold transition-colors border-b-4 ${activeTab === "dersler" ? "text-white border-[#DC2626]" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                                Ders İçeriği
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* LEFT: CONTENT */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* DETAYLI AÇIKLAMA TAB */}
                            {activeTab === "aciklama" && showDescription && (
                                <div 
                                    className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&_strong]:text-white [&_u]:underline"
                                    dangerouslySetInnerHTML={{ __html: (course.description || "").replace(/&nbsp;|\u00A0/g, " ") }}
                                />
                            )}

                            {/* DERS İÇERİĞİ TAB */}
                            {activeTab === "dersler" && (
                                showEpisodes ? (
                                    <>
                                        <div className="flex items-center justify-between text-white mb-4">
                                            <h3 className="font-bold text-xl">Ders Bölümleri</h3>
                                            <span className="text-sm text-gray-500">{episodes.length} Bölüm</span>
                                        </div>

                                        {episodes.map((ep: any, i: number) => {
                                            const isPlayable = ep.isPreview;
                                            return (
                                            <a 
                                                key={i} 
                                                href={ep.isPreview && ep.previewUrl ? ep.previewUrl : undefined} 
                                                target={ep.isPreview ? "_blank" : undefined}
                                                className={`group flex items-center gap-6 p-6 rounded-xl transition-colors border-b border-white/5 last:border-0 border-transparent ${!isPlayable ? 'opacity-60 hover:opacity-100 hover:bg-white/5 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}`}
                                            >
                                                <div className="text-gray-500 font-black text-2xl group-hover:text-white transition-colors">{i+1}</div>
                                                <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-gray-800 shrink-0">
                                                    <Image fill sizes="160px" src={course.imageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop"} className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {!isPlayable ? <LockClosedIcon className="w-8 h-8 text-gray-400 drop-shadow-lg" /> : <PlayCircleIcon className="w-10 h-10 text-white drop-shadow-lg" />}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#DC2626] transition-colors flex items-center gap-2">
                                                            {ep.title}
                                                            {!isPlayable && <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-normal uppercase">Kilitli</span>}
                                                            {ep.isPreview && <span className="text-[10px] bg-red-900/50 border border-red-500/30 text-red-400 px-2 py-0.5 rounded font-normal uppercase">Tanıtım</span>}
                                                        </h4>
                                                        {ep.duration && <span className="text-gray-500 text-sm text-right">{ep.duration}</span>}
                                                    </div>
                                                    {ep.description && <div className="text-gray-400 text-sm line-clamp-2 [&>p]:inline" dangerouslySetInnerHTML={{ __html: ep.description }} />}
                                                </div>
                                            </a>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <div className="text-gray-500 py-10 border border-dashed border-gray-800 rounded-xl text-center">
                                        Bu pakete ait ders listesi yakında eklenecektir.
                                    </div>
                                )
                            )}
                        </div>

                        {/* RIGHT: INFO */}
                        <div className="space-y-8">
                            {showFeatures && (
                                <div>
                                    <h4 className="text-gray-500 text-sm font-bold mb-4 uppercase tracking-wider">Platform Özellikleri</h4>
                                    <div className="space-y-3">
                                        {features.map((feature: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {showCast && (
                                <div>
                                    <h4 className="text-gray-500 text-sm font-bold mb-4 uppercase tracking-wider">Eğitmen Kadrosu</h4>
                                    <div className="space-y-3">
                                        {cast.map((person: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                                {person.img ? (
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0"><Image fill sizes="40px" src={person.img} className="object-cover grayscale group-hover:grayscale-0 transition-all" alt={person.name} /></div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm font-bold">{person.name?.charAt(0)}</div>
                                                )}
                                                <div>
                                                    <div className="text-white font-bold text-sm">{person.name}</div>
                                                    <div className="text-gray-500 text-xs">{person.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {showTags && (
                                <div>
                                    <h4 className="text-gray-500 text-sm font-bold mb-4 uppercase tracking-wider">Kategoriler & Etiketler</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full hover:bg-white/20 transition-colors">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <MainHeader />
            <DetailHero />

            {/* MOBILE ONLY: Inline Variant & Addon Selector */}
            <div className="block lg:hidden bg-[#0F172A] border-y border-white/5 py-6 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-lg mx-auto bg-black/40 border border-white/10 p-5 rounded-2xl">
                        {/* Variant Selection */}
                        {variants.length > 1 && (
                            <div className="mb-5">
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2.5">Abonelik Süresi</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {variants.map((v: any) => (
                                        <button
                                            key={v.id}
                                            onClick={() => handleVariantChange(v)}
                                            className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                                                selectedVariantId === v.id
                                                    ? "bg-blue-600 border-blue-500 text-white shadow-md"
                                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                            }`}
                                        >
                                            {v.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Book selection */}
                        {bookPrice > 0 && (
                            <div className="mb-2">
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2.5">Kitaplı Seçenek</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setWithBook(false)}
                                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                            !withBook
                                                ? "bg-gray-700 border-gray-600 text-white shadow-md"
                                                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                        }`}
                                    >
                                        Sadece Abonelik
                                    </button>
                                    <button
                                        onClick={() => setWithBook(true)}
                                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                            withBook
                                                ? "bg-[#DC2626] border-red-500 text-white shadow-md"
                                                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                        }`}
                                    >
                                        Kitap Dahil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EpisodesList />
            
            {/* MOBILE STICKY BOTTOM BAR (Native App Feel) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0B1221] border-t border-white/10 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between gap-4 animate-slide-up">
                <div>
                    <div className="text-xs text-gray-400 line-through">{originalPrice > basePrice && `₺${originalPrice.toLocaleString('tr-TR')}`}</div>
                    <div className="text-2xl font-black text-white">₺{totalPrice.toLocaleString('tr-TR')}</div>
                </div>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#DC2626] hover:bg-red-700 font-bold text-white py-3.5 rounded-xl shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
                >
                  Satın Al
                </button>
            </div>

            <Footer />
        </>
    );
}
