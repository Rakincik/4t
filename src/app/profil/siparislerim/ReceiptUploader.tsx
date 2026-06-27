"use client";

import React, { useState } from "react";
import { 
    ArrowUpTrayIcon, 
    CheckIcon, 
    EyeIcon, 
    ArrowPathIcon,
    ExclamationTriangleIcon,
    CreditCardIcon,
    DocumentDuplicateIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from "@heroicons/react/24/solid";

interface ReceiptUploaderProps {
    orderId: string;
    initialReceiptUrl?: string | null;
}

export default function ReceiptUploader({ orderId, initialReceiptUrl }: ReceiptUploaderProps) {
    const [receiptUrl, setReceiptUrl] = useState<string | null>(initialReceiptUrl || null);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showIban, setShowIban] = useState(false);
    
    const [copiedIban, setCopiedIban] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    const iban = "TR00 0000 0000 0000 0000 0000 00"; // İLERİDE GERÇEK IBAN İLE DEĞİŞTİRİLEBİLİR
    const accountName = "4T Akademi Yayıncılık Ltd. Şti.";

    function copyIban() {
        navigator.clipboard.writeText(iban);
        setCopiedIban(true);
        setTimeout(() => setCopiedIban(false), 2000);
    }

    function copyCode() {
        navigator.clipboard.writeText(orderId);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setErrorMsg("");

        // Validate size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setErrorMsg("Dosya boyutu 10MB'tan küçük olmalıdır.");
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            // 1. Upload
            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.error || "Dosya yüklenemedi.");
            }

            const uploadedUrl = uploadData.url;

            // 2. Save
            const dbRes = await fetch("/api/user/orders/upload-receipt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, receiptUrl: uploadedUrl })
            });
            const dbData = await dbRes.json();

            if (!dbRes.ok) {
                throw new Error(dbData.error || "Dekont siparişe kaydedilemedi.");
            }

            setReceiptUrl(uploadedUrl);
        } catch (err: any) {
            console.error("Receipt upload error:", err);
            setErrorMsg(err.message || "Yükleme sırasında bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="mt-2 w-full max-w-[280px] sm:max-w-xs text-left">
            <div className="flex flex-wrap items-center gap-2">
                {/* Collapsible IBAN Info Toggle */}
                <button
                    type="button"
                    onClick={() => setShowIban(!showIban)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                >
                    <CreditCardIcon className="w-3.5 h-3.5" />
                    {showIban ? "Banka Bilgilerini Gizle" : "Banka Bilgilerini Göster"}
                    {showIban ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                </button>

                {/* Upload Status & Actions */}
                {receiptUrl ? (
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                            <CheckIcon className="w-3 h-3" />
                            Dekont İletildi
                        </div>
                        <a 
                            href={receiptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-dark transition"
                            title="Dekontu Gör"
                        >
                            <EyeIcon className="w-4 h-4" />
                        </a>
                        <label className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-dark transition cursor-pointer" title="Dekontu Değiştir">
                            <ArrowPathIcon className="w-4 h-4" />
                            <input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                onChange={handleFileChange} 
                                disabled={uploading} 
                                className="hidden" 
                            />
                        </label>
                    </div>
                ) : (
                    <label className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border border-dashed border-[#DC2626]/30 text-[#DC2626] bg-red-50/50 hover:bg-red-50 hover:border-[#DC2626]/50 transition cursor-pointer select-none ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                        <ArrowUpTrayIcon className="w-3.5 h-3.5" />
                        {uploading ? "Yükleniyor..." : "Dekont Yükle"}
                        <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            onChange={handleFileChange} 
                            disabled={uploading} 
                            className="hidden" 
                        />
                    </label>
                )}
            </div>

            {/* Error Message */}
            {errorMsg && (
                <div className="text-[10px] text-rose-600 font-semibold flex items-center gap-0.5 mt-1">
                    <ExclamationTriangleIcon className="w-3 h-3" />
                    {errorMsg}
                </div>
            )}

            {/* Expander IBAN Box */}
            {showIban && (
                <div className="mt-2 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-2 animate-fade-in shadow-sm">
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Alıcı</span>
                        <span className="font-bold text-gray-800">{accountName}</span>
                    </div>

                    <div>
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Banka / IBAN</span>
                        <div className="flex items-center justify-between gap-2 mt-0.5 bg-white border border-gray-100 rounded-lg p-1.5">
                            <code className="font-mono font-bold text-gray-800 break-all select-all text-[10px]">
                                {iban}
                            </code>
                            <button
                                type="button"
                                onClick={copyIban}
                                className="p-1 text-gray-400 hover:text-blue-600 transition"
                                title="IBAN Kopyala"
                            >
                                <DocumentDuplicateIcon className="w-4 h-4" />
                            </button>
                        </div>
                        {copiedIban && (
                            <span className="text-[9px] font-bold text-emerald-600 mt-0.5 block">IBAN panoya kopyalandı!</span>
                        )}
                    </div>

                    <div className="border-t border-gray-200/50 pt-2">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Transfer Açıklaması</span>
                        <div className="flex items-center justify-between gap-2 mt-0.5 bg-amber-50/50 border border-amber-100 rounded-lg p-1.5">
                            <span className="font-mono font-bold text-amber-800 text-[10px] truncate">
                                {orderId}
                            </span>
                            <button
                                type="button"
                                onClick={copyCode}
                                className="p-1 text-amber-600 hover:text-amber-800 transition"
                                title="Açıklama Kodunu Kopyala"
                            >
                                <DocumentDuplicateIcon className="w-4 h-4" />
                            </button>
                        </div>
                        {copiedCode && (
                            <span className="text-[9px] font-bold text-emerald-600 mt-0.5 block">Kod panoya kopyalandı!</span>
                        )}
                        <p className="text-[9px] text-amber-700 font-medium mt-1 leading-normal">
                            ⚠️ Havale/EFT yaparken açıklama kısmına bu kodu yazmanız onay sürecini hızlandıracaktır.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
