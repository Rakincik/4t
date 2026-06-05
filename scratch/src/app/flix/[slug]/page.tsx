// Dosya Yolu: app/flix/[slug]/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    PlayCircleIcon,
    PlusIcon,
    CheckCircleIcon,
    ClockIcon,
    HandThumbUpIcon,
    ShareIcon,
    ArrowLeftIcon,
    StarIcon,
    LockClosedIcon,
    ShoppingCartIcon,
    CreditCardIcon,
    ShieldCheckIcon
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/components/cart/cartStore";

/* ===================================================== */
/* HELPERS                                               */
/* ===================================================== */
const EPISODES = [
    { id: 1, title: "1. Anayasa Hukuku: Temel Kavramlar", duration: "45dk", watched: true, locked: false },
    { id: 2, title: "2. İdare Hukuku: İdari İşlemler", duration: "50dk", watched: false, locked: true },
    { id: 3, title: "3. Ceza Hukuku: Suç Teorisi", duration: "40dk", watched: false, locked: true },
    { id: 4, title: "4. Medeni Hukuk: Kişiler Hukuku", duration: "55dk", watched: false, locked: true },
    { id: 5, title: "5. Borçlar Hukuku: Sözleşmeler", duration: "60dk", watched: false, locked: true },
];

const CAST = [
    { name: "Ahmet Albayrak", role: "Anayasa Hukuku", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" },
    { name: "Yüksel Bilgili", role: "İktisat", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop" },
    { name: "Zeynep Yılmaz", role: "Muhasebe", img: "https://images.unsplash.com/photo-1573496359-136d475583dc?q=80&w=200&auto=format&fit=crop" },
];

/* ===================================================== */
/* PURCHASE CARD COMPONENT                               */
/* ===================================================== */
function PurchaseCard() {
    const { add } = useCart();
    const router = useRouter();

    // Mock Product Data (Gerçekte props veya API'den gelir)
    const product = {
        id: "flix-adli-hakimlik-2024",
        slug: "adli-hakimlik-flix",
        title: "Adli Hakimlik FLIX 2024",
        price: 12500,
        originalPrice: 18000,
        imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop",
        category: "FLIX"
    };

    const handleAddToCart = () => {
        add(product, { openDrawer: true });
    };

    const handleBuyNow = () => {
        add(product, { openDrawer: false });
        router.push("/sepet");
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-sm bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group"
        >
            {/* Glow Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#DC2626]/20 rounded-full blur-3xl group-hover:bg-[#DC2626]/30 transition-colors"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2 py-1 rounded">KAMPANYA</span>
                    <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                        <ShieldCheckIcon className="w-3 h-3" />
                        Hemen Teslim
                    </span>
                </div>

                <div className="mb-6">
                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-gray-400 text-lg line-through font-medium">18.000 ₺</span>
                        <span className="text-white text-4xl font-black tracking-tight">12.500 ₺</span>
                    </div>
                    <div className="text-gray-400 text-xs font-medium flex items-center gap-1">
                        <CreditCardIcon className="w-3 h-3" />
                        Bonus'a özel 9 taksit imkanı
                    </div>
                </div>

                <button
                    onClick={handleBuyNow}
                    className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 hover:shadow-red-900/60 transition-all hover:-translate-y-1 active:translate-y-0 text-lg"
                >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Paketi Satın Al
                </button>

                <button
                    onClick={handleAddToCart}
                    className="w-full mt-3 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl border border-white/10 transition-colors text-sm"
                >
                    Sepete Ekle
                </button>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                        <span>365 Gün Sınırsız Erişim</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                        <span>1200+ Video Ders & Soru</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Dijital PDF Arşivi</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ===================================================== */
/* DETAIL HERO                                           */
/* ===================================================== */
function DetailHero() {
    return (
        <section className="relative min-h-[90vh] w-full pt-32 pb-20 flex items-center">
            {/* Backdrop */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/70 to-[#0B1221]/30 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-[#0B1221]/80 to-transparent z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-60"
                    alt="Backdrop"
                />
            </div>

            <div className="container mx-auto px-6 relative z-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left Content */}
                    <div className="flex-1 max-w-2xl">
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
                                <span className="bg-[#DC2626] text-white text-xs font-bold px-2 py-1 rounded">YENİ SEZON</span>
                                <span className="text-green-400 text-sm font-bold">%98 Eşleşme</span>
                                <span className="text-gray-300 text-sm">2024</span>
                                <span className="border border-gray-500 text-gray-300 text-[10px] px-1 rounded">HD</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6">
                                Adli Hakimlik <br /> FLIX
                            </h1>

                            <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                                Hakimlik sınavına hazırlananlar için özel olarak kurgulandı.
                                Anayasa, İdare, Ceza ve Medeni Hukuk derslerinin tamamı,
                                sınav formatına birebir uyumlu, yeni nesil anlatımla karşınızda.
                                Satın alarak hemen izlemeye başlayın.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                                    <PlayCircleIcon className="w-8 h-8" />
                                    <span>Önizleme</span>
                                </button>
                                <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-lg font-bold backdrop-blur-md transition-colors border border-white/10">
                                    <PlusIcon className="w-6 h-6" />
                                    <span>Listem</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Purchase Card */}
                    <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                        <PurchaseCard />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ===================================================== */
/* TABS & EPISODES                                       */
/* ===================================================== */
function EpisodesList() {
    const [activeTab, setActiveTab] = useState("dersler");

    return (
        <section className="bg-[#0B1221] pb-24 relative z-20">
            <div className="container mx-auto px-6">
                <div className="border-b border-white/10 mb-8 sticky top-0 bg-[#0B1221] z-30 pt-4">
                    <div className="flex gap-8">
                        {["Dersler", "Benzerleri", "Detaylar"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`pb-4 text-lg font-bold transition-colors border-b-4 ${activeTab === tab.toLowerCase() ? "text-white border-[#DC2626]" : "text-gray-500 border-transparent hover:text-gray-300"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* EPISODES LEFT */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between text-white mb-4">
                            <h3 className="font-bold text-xl">1. Sezon: Genel Hukuk</h3>
                            <span className="text-sm text-gray-500">12 Bölüm</span>
                        </div>

                        {EPISODES.map((ep) => (
                            <div key={ep.id} className={`group flex items-center gap-6 p-6 rounded-xl transition-colors border-b border-white/5 last:border-0 border-transparent ${ep.locked ? 'opacity-60 hover:opacity-100 hover:bg-white/5 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}`}>
                                <div className="text-gray-500 font-black text-2xl group-hover:text-white transition-colors">{ep.id}</div>
                                <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-gray-800 shrink-0">
                                    <img src={`https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {ep.locked ? (
                                            <LockClosedIcon className="w-8 h-8 text-gray-400 drop-shadow-lg" />
                                        ) : (
                                            <PlayCircleIcon className="w-10 h-10 text-white drop-shadow-lg" />
                                        )}
                                    </div>
                                    {/* Progress Bar (Only for unlocked/watched) */}
                                    {ep.watched && !ep.locked && <div className="absolute bottom-0 left-0 h-1 bg-[#DC2626] w-full"></div>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#DC2626] transition-colors flex items-center gap-2">
                                            {ep.title}
                                            {ep.locked && <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-normal uppercase">Kilitli</span>}
                                        </h4>
                                        <span className="text-gray-500 text-sm text-right">{ep.duration}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {ep.locked ? "Bu dersi izlemek için paketi satın almalısınız." : "Bu derste temel kavramlar işlenecektir. Hukukun kaynakları ve normlar hiyerarşisi detaylandırılacaktır."}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="p-8 bg-gradient-to-r from-red-900/20 to-transparent border border-red-500/20 rounded-2xl flex items-center justify-between mt-8">
                            <div>
                                <h4 className="text-white font-bold text-lg mb-1">Tüm İçeriğe Erişin</h4>
                                <p className="text-gray-400 text-sm">1200+ Video ve Soru Çözümü sizi bekliyor.</p>
                            </div>
                            <button className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                                Paketi Satın Al
                            </button>
                        </div>
                    </div>

                    {/* INFO RIGHT */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-gray-500 text-sm font-bold mb-4 uppercase tracking-wider">Eğitmen Kadrosu</h4>
                            <div className="space-y-3">
                                {CAST.map((person, i) => (
                                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                        <img src={person.img} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                        <div>
                                            <div className="text-white font-bold text-sm">{person.name}</div>
                                            <div className="text-gray-500 text-xs">{person.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-gray-500 text-sm font-bold mb-4 uppercase tracking-wider">Kategoriler</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full hover:bg-white/20 cursor-pointer transition-colors">Hukuk</span>
                                <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full hover:bg-white/20 cursor-pointer transition-colors">Adli Yargı</span>
                                <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full hover:bg-white/20 cursor-pointer transition-colors">2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ===================================================== */
/* PAGE MAIN                                             */
/* ===================================================== */
export default function FlixDetailPage() {
    return (
        <main className="min-h-screen bg-[#0B1221] font-sans selection:bg-[#DC2626] selection:text-white">
            <MainHeader />
            <DetailHero />
            <EpisodesList />
            <Footer />
        </main>
    );
}
