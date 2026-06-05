"use client";

import React, { useState, useEffect } from "react";
import {
    ClockIcon,
    ArrowUturnLeftIcon,
    XMarkIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Version {
    id: string;
    label: string | null;
    createdAt: string;
}

interface VersionHistoryProps {
    pageSlug: string;
    onRestore: () => void; // Geri alma sonrası editor'ü yeniden yükle
}

export default function VersionHistory({ pageSlug, onRestore }: VersionHistoryProps) {
    const [open, setOpen] = useState(false);
    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState<string | null>(null);
    const [restored, setRestored] = useState(false);

    useEffect(() => {
        if (open) {
            setLoading(true);
            fetch(`/api/admin/page-versions?page=${pageSlug}`)
                .then((r) => r.json())
                .then((d) => setVersions(d.versions || []))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [open, pageSlug]);

    const handleRestore = async (versionId: string) => {
        if (!confirm("Bu versiyona geri dönmek istediğinize emin misiniz?")) return;
        setRestoring(versionId);
        try {
            await fetch("/api/admin/page-versions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ versionId }),
            });
            setRestored(true);
            setTimeout(() => {
                setRestored(false);
                setOpen(false);
                onRestore();
            }, 1500);
        } catch (e) {
            console.error(e);
        } finally {
            setRestoring(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        const time = d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

        if (mins < 1) return "Az önce";
        if (mins < 60) return `${mins} dk önce`;
        if (hours < 24) return `${hours} saat önce, ${time}`;
        if (days < 7) return `${days} gün önce, ${time}`;
        return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }) + ` ${time}`;
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-blue-600 transition uppercase tracking-wider"
            >
                <ClockIcon className="w-3.5 h-3.5" />
                Geçmiş
            </button>

            {/* Slide-over Panel */}
            {open && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    {/* Panel */}
                    <div className="relative w-80 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-blue-600" />
                                <h3 className="text-sm font-bold text-gray-900">Versiyon Geçmişi</h3>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 transition">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Restored Success */}
                        {restored && (
                            <div className="mx-4 mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-700">Geri alındı! Yenileniyor...</span>
                            </div>
                        )}

                        {/* Version List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {loading ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                                    <p className="text-xs text-gray-400 mt-3">Yükleniyor...</p>
                                </div>
                            ) : versions.length === 0 ? (
                                <div className="text-center py-10">
                                    <ClockIcon className="w-10 h-10 text-gray-200 mx-auto" />
                                    <p className="text-sm text-gray-400 mt-3">Henüz kaydedilmiş versiyon yok.</p>
                                    <p className="text-xs text-gray-300 mt-1">İlk kayıtta otomatik oluşturulacak.</p>
                                </div>
                            ) : (
                                versions.map((v, i) => (
                                    <div
                                        key={v.id}
                                        className={`relative p-3 rounded-xl border transition group ${
                                            i === 0
                                                ? "border-blue-200 bg-blue-50/50"
                                                : "border-gray-100 hover:border-gray-200 bg-white"
                                        }`}
                                    >
                                        {/* Timeline dot */}
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${i === 0 ? "bg-blue-500" : "bg-gray-300"}`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-gray-500">
                                                        {formatDate(v.createdAt)}
                                                    </span>
                                                    {i === 0 && (
                                                        <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold uppercase">
                                                            Güncel
                                                        </span>
                                                    )}
                                                </div>
                                                {v.label && (
                                                    <p className="text-xs text-gray-600 mt-1 truncate">{v.label}</p>
                                                )}
                                                {i > 0 && (
                                                    <button
                                                        onClick={() => handleRestore(v.id)}
                                                        disabled={restoring === v.id}
                                                        className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition opacity-0 group-hover:opacity-100"
                                                    >
                                                        <ArrowUturnLeftIcon className="w-3 h-3" />
                                                        {restoring === v.id ? "Geri alınıyor..." : "Bu Versiyona Dön"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-gray-200">
                            <p className="text-[9px] text-gray-400 text-center">
                                Son {versions.length} versiyon gösteriliyor • Otomatik kaydedilir
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
