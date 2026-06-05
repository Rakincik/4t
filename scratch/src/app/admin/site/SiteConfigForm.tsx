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

            <div className="flex items-center gap-4 pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary/90 transition disabled:opacity-50"
                >
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>

                {saved && (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                        <CheckIcon className="h-5 w-5" />
                        Kaydedildi!
                    </span>
                )}
            </div>
        </form>
    );
}
