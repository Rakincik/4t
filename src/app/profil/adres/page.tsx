"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
    MapPinIcon,
    IdentificationIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/solid";

export default function AdresPage() {
    // Address & Billing States
    const [tcNo, setTcNo] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [address, setAddress] = useState("");
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Cities and Districts Data
    const [citiesData, setCitiesData] = useState<{ name: string; districts: string[] }[]>([]);

    // Fetch cities data
    useEffect(() => {
        fetch("/iller.json")
            .then(r => r.json())
            .then(setCitiesData)
            .catch(err => console.error("Error loading cities data:", err));
    }, []);

    // Get districts based on selected city
    const availableDistricts = useMemo(() => {
        if (!city) return [];
        const found = citiesData.find(c => c.name === city);
        return found ? found.districts : [];
    }, [city, citiesData]);

    // Fetch user details
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/user/profile");
                if (res.ok) {
                    const data = await res.json();
                    setTcNo(data.tcNo || "");
                    setCity(data.city || "");
                    setDistrict(data.district || "");
                    setAddress(data.address || "");
                }
            } catch (err) {
                console.error("Error loading address info:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    // Handle form save
    async function handleSaveAddress(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg("");
        setErrorMsg("");

        if (tcNo && tcNo.trim().length !== 11) {
            setErrorMsg("T.C. Kimlik numarası 11 hane olmalıdır.");
            setSaving(false);
            return;
        }

        if (address && address.trim().length < 10) {
            setErrorMsg("Açık adresiniz en az 10 karakter olmalıdır.");
            setSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tcNo, city, district, address }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Adres bilgileri kaydedilemedi.");
            }

            setSuccessMsg("Adres ve Fatura bilgileriniz başarıyla kaydedildi.");
        } catch (err: any) {
            setErrorMsg(err.message || "Bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-3xl"></div>
                <div className="h-96 bg-gray-200 rounded-3xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-[#0B1221] to-[#1e293b] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-2">Adres & Fatura Bilgileri</h1>
                    <p className="text-gray-300">
                        Fatura ve kitap gönderimleriniz için adres bilgilerinizi buradan güncel tutabilirsiniz.
                    </p>
                </div>
            </div>

            {/* Address Form Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <MapPinIcon className="w-6 h-6 text-[#DC2626]" />
                    Adres Detayları
                </h2>

                <form onSubmit={handleSaveAddress} className="space-y-5 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* TC Number */}
                        <div className="sm:col-span-2">
                            <label className="text-xs font-bold text-gray-500 mb-2 block flex items-center gap-1">
                                <IdentificationIcon className="w-4 h-4 text-gray-400" />
                                T.C. Kimlik No (Zorunlu)
                            </label>
                            <input
                                type="text"
                                value={tcNo}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                                    setTcNo(v);
                                }}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all font-mono"
                                placeholder="T.C. Kimlik Numaranız"
                                maxLength={11}
                                inputMode="numeric"
                                required
                            />
                        </div>

                        {/* City Select */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">İl</label>
                            <select
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    setDistrict(""); // reset district
                                }}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all"
                                required
                            >
                                <option value="">İl Seçiniz</option>
                                {citiesData.map(c => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* District Select */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">İlçe</label>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all"
                                disabled={!city}
                                required
                            >
                                <option value="">İlçe Seçiniz</option>
                                {availableDistricts.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Full Address Textarea */}
                        <div className="sm:col-span-2">
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Açık Adres</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={4}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all resize-none"
                                placeholder="Mahalle, Sokak, Daire, Bina detayları..."
                                required
                            />
                        </div>
                    </div>

                    {successMsg && (
                        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                            {successMsg}
                        </div>
                    )}

                    {errorMsg && (
                        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-bold border border-red-100 flex items-center gap-2">
                            <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto rounded-2xl px-6 py-3 font-bold text-white bg-[#DC2626] hover:bg-[#b91c1c] disabled:opacity-60 transition-all duration-200 cursor-pointer"
                    >
                        {saving ? "Kaydediliyor..." : "Adres Bilgilerini Kaydet"}
                    </button>
                </form>
            </div>
        </div>
    );
}
