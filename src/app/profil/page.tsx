"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
    UserCircleIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    LockClosedIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/solid";

export default function ProfilPage() {
    const { data: session, update: updateSession } = useSession();

    // Profile States
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState("");
    const [profileError, setProfileError] = useState("");

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Fetch user details
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/user/profile");
                if (res.ok) {
                    const data = await res.json();
                    setName(data.name || "");
                    setPhone(data.phone || "");
                    setEmail(data.email || "");
                }
            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setLoadingProfile(false);
            }
        }
        fetchProfile();
    }, []);

    // Save profile details
    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSavingProfile(true);
        setProfileSuccess("");
        setProfileError("");

        if (name.trim().length < 3) {
            setProfileError("Ad Soyad en az 3 karakter olmalıdır.");
            setSavingProfile(false);
            return;
        }

        if (phone && phone.replace(/\D/g, "").length < 10) {
            setProfileError("Geçerli bir telefon numarası giriniz.");
            setSavingProfile(false);
            return;
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Profil güncellenemedi.");
            }

            setProfileSuccess("Profil bilgileriniz başarıyla güncellendi.");
            
            // Sync with next-auth session
            if (session) {
                await updateSession({
                    ...session,
                    user: {
                        ...session.user,
                        name: name
                    }
                });
            }
        } catch (err: any) {
            setProfileError(err.message || "Bir hata oluştu.");
        } finally {
            setSavingProfile(false);
        }
    }

    // Save password
    async function handleSavePassword(e: React.FormEvent) {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordSuccess("");
        setPasswordError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Tüm şifre alanları zorunludur.");
            setSavingPassword(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Yeni şifre en az 6 karakter olmalıdır.");
            setSavingPassword(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Yeni şifreler eşleşmiyor.");
            setSavingPassword(false);
            return;
        }

        try {
            const res = await fetch("/api/user/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Şifre güncellenemedi.");
            }

            setPasswordSuccess("Şifreniz başarıyla değiştirildi.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setPasswordError(err.message || "Bir hata oluştu.");
        } finally {
            setSavingPassword(false);
        }
    }

    if (loadingProfile) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-3xl"></div>
                <div className="h-96 bg-gray-200 rounded-3xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-[#0B1221] to-[#1e293b] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-2">Hoş Geldin, {name}!</h1>
                    <p className="text-gray-300">Öğrenci panelinden kişisel bilgilerini ve şifreni yönetebilirsin.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Form */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <UserCircleIcon className="w-6 h-6 text-[#DC2626]" />
                        Kişisel Bilgiler
                    </h2>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Ad Soyad</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all"
                                placeholder="Ad Soyad"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">E-posta Adresi (Değiştirilemez)</label>
                            <div className="flex items-center gap-2 w-full rounded-2xl border border-gray-100 bg-gray-50 p-3 text-gray-500">
                                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-sm">{email}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Telefon</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <PhoneIcon className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                                        setPhone(v);
                                    }}
                                    className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all font-mono"
                                    placeholder="05xx xxx xx xx"
                                    maxLength={11}
                                    inputMode="tel"
                                />
                            </div>
                        </div>

                        {profileSuccess && (
                            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100 flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                                {profileSuccess}
                            </div>
                        )}

                        {profileError && (
                            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-bold border border-red-100 flex items-center gap-2">
                                <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                                {profileError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="w-full sm:w-auto rounded-2xl px-6 py-3 font-bold text-white bg-[#DC2626] hover:bg-[#b91c1c] disabled:opacity-60 transition-all duration-200 cursor-pointer"
                        >
                            {savingProfile ? "Kaydediliyor..." : "Bilgileri Kaydet"}
                        </button>
                    </form>
                </div>

                {/* Password Form */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <LockClosedIcon className="w-6 h-6 text-[#DC2626]" />
                        Şifre Değiştir
                    </h2>

                    <form onSubmit={handleSavePassword} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Mevcut Şifre</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all"
                                placeholder="••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Yeni Şifre</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all"
                                placeholder="••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Yeni Şifre (Tekrar)</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#DC2626] transition-all"
                                placeholder="••••••"
                                required
                            />
                        </div>

                        {passwordSuccess && (
                            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100 flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                                {passwordSuccess}
                            </div>
                        )}

                        {passwordError && (
                            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-bold border border-red-100 flex items-center gap-2">
                                <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                                {passwordError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="w-full sm:w-auto rounded-2xl px-6 py-3 font-bold text-white bg-[#DC2626] hover:bg-[#b91c1c] disabled:opacity-60 transition-all duration-200 cursor-pointer"
                        >
                            {savingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
