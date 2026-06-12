"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    PhoneIcon, ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import VersionHistory from "@/app/admin/components/VersionHistory";
import AdminBackButton from "@/app/admin/components/AdminBackButton";

export default function IletisimEditorPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [hasChanges, setHasChanges] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const [email, setEmail] = useState("destek@4takademi.com");
    const [phone, setPhone] = useState("(0312) 433 40 44");
    const [whatsappDisplay, setWhatsappDisplay] = useState("(0553) 172 40 44 (WhatsApp)");
    const [whatsapp, setWhatsapp] = useState("905531724044");
    const [address, setAddress] = useState("İlkbahar Mah. 593 Sk. No:2 Çankaya/ANKARA");
    const [mapsEmbed, setMapsEmbed] = useState("https://www.google.com/maps/embed?pb=!1m18...");
    
    // YENİ ALANLAR - HERO
    const [heroBadge, setHeroBadge] = useState("7/24 dönüş hedefi • Danışman destekli yönlendirme");
    const [heroTitle, setHeroTitle] = useState("Bize Ulaşın");
    const [heroDesc, setHeroDesc] = useState("Kurs seçimi, kayıt, ödeme veya teknik destek… Ne lazımsa hızlıca çözelim. En hızlı yol: WhatsApp.");
    const [heroBtn1, setHeroBtn1] = useState("Formu Doldur");
    const [heroBtn2, setHeroBtn2] = useState("WhatsApp’tan Yaz");
    const [heroBtn3, setHeroBtn3] = useState("Hemen Ara");
    
    // YENİ ALANLAR - FORM VE KARTLAR
    const [formTitle, setFormTitle] = useState("Ücretsiz Danışmanlık / Destek");
    const [formDesc, setFormDesc] = useState("Formu doldurun, ekibimiz sizi arayıp en doğru paketi netleştirsin.");
    const [formSuccess, setFormSuccess] = useState("Mesajın ulaştı ✅");
    const [formSuccessDesc, setFormSuccessDesc] = useState("En kısa sürede dönüş yapacağız. Acilse WhatsApp’tan yazabilirsin.");
    const [formKvkk, setFormKvkk] = useState("Formu göndererek KVKK kapsamında iletişim kurulmasını kabul etmiş olursunuz.");
    const [mapTitle, setMapTitle] = useState("Haritadayız");
    const [mapDesc, setMapDesc] = useState("Ankara kampüsümüze yol tarifi alabilirsiniz.");

    const loadData = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/page-content?page=iletisim");
            const data = await res.json();
            if (data.contact?.metadata) {
                const m = data.contact.metadata;
                if (m.email) setEmail(m.email);
                if (m.phone) setPhone(m.phone);
                if (m.whatsappDisplay) setWhatsappDisplay(m.whatsappDisplay);
                if (m.whatsapp) setWhatsapp(m.whatsapp);
                if (m.address) setAddress(m.address);
                if (m.mapsEmbed) setMapsEmbed(m.mapsEmbed);
                
                if (m.heroBadge) setHeroBadge(m.heroBadge);
                if (m.heroTitle) setHeroTitle(m.heroTitle);
                if (m.heroDesc) setHeroDesc(m.heroDesc);
                if (m.heroBtn1) setHeroBtn1(m.heroBtn1);
                if (m.heroBtn2) setHeroBtn2(m.heroBtn2);
                if (m.heroBtn3) setHeroBtn3(m.heroBtn3);
                
                if (m.formTitle) setFormTitle(m.formTitle);
                if (m.formDesc) setFormDesc(m.formDesc);
                if (m.formSuccess) setFormSuccess(m.formSuccess);
                if (m.formSuccessDesc) setFormSuccessDesc(m.formSuccessDesc);
                if (m.formKvkk) setFormKvkk(m.formKvkk);
                if (m.mapTitle) setMapTitle(m.mapTitle);
                if (m.mapDesc) setMapDesc(m.mapDesc);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); setHasChanges(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData, reloadKey]);

    useEffect(() => { if (!loading) setHasChanges(true); }, [email, phone, whatsappDisplay, whatsapp, address, mapsEmbed, heroBadge, heroTitle, heroDesc, heroBtn1, heroBtn2, heroBtn3, formTitle, formDesc, formSuccess, formSuccessDesc, formKvkk, mapTitle, mapDesc]);

    const handleSave = useCallback(async () => {
        setSaving(true); setSaveStatus("saving");
        try {
            await fetch("/api/admin/page-content", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageSlug: "iletisim",
                    sections: {
                        contact: { 
                            title: "İletişim Bilgileri", 
                            content: null, 
                            metadata: { 
                                email, phone, whatsappDisplay, whatsapp, address, mapsEmbed,
                                heroBadge, heroTitle, heroDesc, heroBtn1, heroBtn2, heroBtn3,
                                formTitle, formDesc, formSuccess, formSuccessDesc, formKvkk, mapTitle, mapDesc
                            } 
                        },
                    },
                }),
            });
            setSaveStatus("saved"); setHasChanges(false);
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
        finally { setSaving(false); }
    }, [email, phone, whatsappDisplay, whatsapp, address, mapsEmbed, heroBadge, heroTitle, heroDesc, heroBtn1, heroBtn2, heroBtn3, formTitle, formDesc, formSuccess, formSuccessDesc, formKvkk, mapTitle, mapDesc]);

    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white";
    const labelCls = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1";

    if (loading) return <div className="flex items-center justify-center h-[calc(100vh-120px)]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" /></div>;

    return (
        <div style={{ height: "calc(100vh - 120px)" }}>
            <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="w-52 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
                    <div className="px-4 py-4 border-b border-gray-200">
                        <div className="mb-4">
                            <AdminBackButton fallbackUrl="/admin/sayfalar" fullWidth={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-900">İletişim</h2>
                            <VersionHistory pageSlug="iletisim" onRestore={() => { setReloadKey(k => k + 1); setLoading(true); }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Sayfa İçerik Editörü</p>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        <button className="w-full px-4 py-3 flex items-center gap-3 text-left transition bg-white border-r-2 border-blue-600 shadow-sm">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-500"><PhoneIcon className="w-4 h-4" /></div>
                            <p className="text-xs font-semibold truncate text-gray-900">İletişim Bilgileri</p>
                        </button>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200">
                        <button onClick={handleSave} disabled={saving || !hasChanges} className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${saveStatus === "saved" ? "bg-emerald-500 text-white" : hasChanges ? "bg-[#0B1221] text-white hover:bg-[#1a2744]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                            {saveStatus === "saving" && <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />}
                            {saveStatus === "saving" ? "Kaydediliyor..." : saveStatus === "saved" ? "✓ Kaydedildi!" : hasChanges ? "💾 Kaydet" : "Değişiklik Yok"}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
                    <div className="max-w-3xl space-y-6">
                        {/* HERO BÖLÜMÜ */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Sayfa Üst Bölümü (Hero)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelCls}>Üst Rozet</label><input className={inputCls} value={heroBadge} onChange={e => setHeroBadge(e.target.value)} /></div>
                                <div><label className={labelCls}>Ana Başlık</label><input className={inputCls} value={heroTitle} onChange={e => setHeroTitle(e.target.value)} /></div>
                            </div>
                            <div><label className={labelCls}>Açıklama</label><textarea className={inputCls} value={heroDesc} onChange={e => setHeroDesc(e.target.value)} rows={2} /></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className={labelCls}>Buton 1 (Form)</label><input className={inputCls} value={heroBtn1} onChange={e => setHeroBtn1(e.target.value)} /></div>
                                <div><label className={labelCls}>Buton 2 (WhatsApp)</label><input className={inputCls} value={heroBtn2} onChange={e => setHeroBtn2(e.target.value)} /></div>
                                <div><label className={labelCls}>Buton 3 (Ara)</label><input className={inputCls} value={heroBtn3} onChange={e => setHeroBtn3(e.target.value)} /></div>
                            </div>
                        </div>

                        {/* TEMEL İLETİŞİM */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Temel İletişim Bilgileri</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelCls}>E-Posta</label><input className={inputCls} value={email} onChange={e => setEmail(e.target.value)} /></div>
                                <div><label className={labelCls}>Telefon</label><input className={inputCls} value={phone} onChange={e => setPhone(e.target.value)} /></div>
                                <div><label className={labelCls}>WhatsApp Gösterim Metni</label><input className={inputCls} value={whatsappDisplay} onChange={e => setWhatsappDisplay(e.target.value)} /></div>
                                <div><label className={labelCls}>WhatsApp Numara (Koduyla)</label><input className={inputCls} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} /></div>
                            </div>
                            <div><label className={labelCls}>Açık Adres</label><textarea className={inputCls} value={address} onChange={e => setAddress(e.target.value)} rows={2} /></div>
                            <div>
                                <label className={labelCls}>Google Haritalar Embed Linki (src içeriği)</label>
                                <input 
                                    className={inputCls} 
                                    value={mapsEmbed} 
                                    onChange={e => {
                                        let val = e.target.value;
                                        if (val.includes("<iframe") && val.includes("src=")) {
                                            const match = val.match(/src="([^"]+)"/);
                                            if (match && match[1]) {
                                                val = match[1];
                                            }
                                        }
                                        setMapsEmbed(val);
                                    }} 
                                    placeholder="https://www.google.com/maps/embed?pb=..." 
                                />
                                <p className="text-[10px] text-red-500 mt-1 font-medium flex items-center gap-1">
                                    <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                    DİKKAT: Tarayıcıdaki normal linki değil, haritadan "Paylaş &gt; Harita Yerleştir" deyip "src" içindeki "embed" linkini kopyalamalısınız.
                                </p>
                            </div>
                        </div>

                        {/* FORM & DİĞER */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Form ve Diğer Metinler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelCls}>Form Başlık</label><input className={inputCls} value={formTitle} onChange={e => setFormTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>Form Açıklama</label><input className={inputCls} value={formDesc} onChange={e => setFormDesc(e.target.value)} /></div>
                                <div><label className={labelCls}>Başarılı Gönderim Başlığı</label><input className={inputCls} value={formSuccess} onChange={e => setFormSuccess(e.target.value)} /></div>
                                <div><label className={labelCls}>Başarılı Gönderim Açıklaması</label><input className={inputCls} value={formSuccessDesc} onChange={e => setFormSuccessDesc(e.target.value)} /></div>
                            </div>
                            <div><label className={labelCls}>KVKK Uyarı Metni</label><input className={inputCls} value={formKvkk} onChange={e => setFormKvkk(e.target.value)} /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div><label className={labelCls}>Harita Başlığı</label><input className={inputCls} value={mapTitle} onChange={e => setMapTitle(e.target.value)} /></div>
                                <div><label className={labelCls}>Harita Açıklaması</label><input className={inputCls} value={mapDesc} onChange={e => setMapDesc(e.target.value)} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
