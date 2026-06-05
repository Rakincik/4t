"use client";

import { useState } from "react";
import { updateSiteConfig } from "./actions";
import { CheckIcon } from "@heroicons/react/24/outline";

interface SiteConfig {
    id: string;
    siteName: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    workingHours: string;
    footerText: string | null;
    headerAnnouncement: string | null;
}

export default function SiteConfigForm({ config }: { config: SiteConfig }) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    async function handleSubmit(formData: FormData) {
        setSaving(true);
        setSaved(false);

        await updateSiteConfig(formData);

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Adı
                </label>
                <input
                    name="siteName"
                    defaultValue={config.siteName}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Top Bar Anons Metni
                </label>
                <input
                    name="headerAnnouncement"
                    defaultValue={config.headerAnnouncement || ""}
                    placeholder="Geleceğe Hazırlık..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                    </label>
                    <input
                        name="phone"
                        defaultValue={config.phone}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp (Sadece rakam)
                    </label>
                    <input
                        name="whatsapp"
                        defaultValue={config.whatsapp}
                        placeholder="905551234567"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                </label>
                <input
                    name="email"
                    type="email"
                    defaultValue={config.email}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres
                </label>
                <textarea
                    name="address"
                    rows={2}
                    defaultValue={config.address}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Çalışma Saatleri
                </label>
                <input
                    name="workingHours"
                    defaultValue={config.workingHours}
                    placeholder="09:00 - 19:00"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Footer Alt Yazısı (opsiyonel)
                </label>
                <textarea
                    name="footerText"
                    rows={2}
                    defaultValue={config.footerText || ""}
                    placeholder="© 2024 4T Akademi. Tüm hakları saklıdır."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div className="flex items-center gap-4 pt-4 sticky bottom-4 bg-white p-4 border border-gray-200 mt-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-xl z-10 justify-between">
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white hover:bg-blue-700 transition shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
                    >
                        {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                    </button>

                    {saved && (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                            <CheckIcon className="h-5 w-5" />
                            Değişiklikler Kaydedildi!
                        </span>
                    )}
                </div>
            </div>
        </form>
    );
}
