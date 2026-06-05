"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Kurumsal Renk Paleti (Custom Colors)
const brandColors = [
  "#000000", "#FFFFFF", "#DC2626", "#EF4444", "#9333EA", "#A855F7", "#3B82F6", "#60A5FA", "#22C55E", "#EAB308", 
  "#111827", "#1F2937", "#374151", "#6B7280", "#9CA3AF", "#F3F4F6", "#0B1221"
];

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    minHeight?: string;
    simple?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = "120px", simple = false }: RichTextEditorProps) {
    const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");

    const modules = useMemo(() => {
        if (simple) {
            return {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': brandColors }, { 'background': brandColors }],
                    ['clean']
                ]
            };
        }

        return {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': brandColors }, { 'background': brandColors }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
                handlers: {
                    image: function (this: any) {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.click();

                        input.onchange = async () => {
                            const file = input.files ? input.files[0] : null;
                            if (file) {
                                const fd = new FormData();
                                fd.append("file", file);
                                try {
                                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                                    const data = await res.json();
                                    if (data.url) {
                                        const range = this.quill.getSelection();
                                        this.quill.insertEmbed(range ? range.index : 0, 'image', data.url);
                                    } else {
                                        alert("Görsel yüklenirken bir hata oluştu: " + (data.error || "Bilinmeyen hata"));
                                    }
                                } catch (err) {
                                    alert("Görsel yüklenirken sunucuya bağlanılamadı.");
                                }
                            }
                        };
                    }
                }
            }
        };
    }, [simple]);

    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm flex flex-col">
            {/* Önizleme Modu Kontrol Çubuğu */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between z-10 relative">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Görünüm Modu (Önizleme İçin)
                </span>
                <div className="flex bg-white rounded-md border border-gray-200 p-0.5">
                    <button
                        type="button"
                        onClick={() => setPreviewMode("light")}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors ${previewMode === "light" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                        <SunIcon className="w-3.5 h-3.5" />
                        Açık
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewMode("dark")}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors ${previewMode === "dark" ? "bg-[#0B1221] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                        <MoonIcon className="w-3.5 h-3.5" />
                        Koyu
                    </button>
                </div>
            </div>

            {/* Editör */}
            <div 
                className={`transition-colors duration-300 editor-wrapper ${previewMode === "dark" ? "dark-mode-editor bg-[#0B1221] text-white" : "light-mode-editor bg-white text-gray-900"}`}
                style={{ '--editor-min-height': minHeight } as React.CSSProperties}
            >
                <ReactQuill 
                    theme="snow" 
                    value={value} 
                    onChange={onChange} 
                    modules={modules}
                    placeholder={placeholder}
                />
            </div>
            
            <style jsx global>{`
                .editor-wrapper .ql-toolbar.ql-snow {
                    background-color: #f9fafb !important; /* bg-gray-50 */
                    border: none !important;
                    border-bottom: 1px solid #e5e7eb !important; /* border-gray-200 */
                }
                .editor-wrapper .ql-container.ql-snow {
                    border: none !important;
                    font-family: inherit !important;
                    font-size: 0.875rem !important; /* text-sm */
                }
                .editor-wrapper .ql-editor {
                    min-height: var(--editor-min-height) !important;
                }
                /* Koyu Mod Override'ları */
                .dark-mode-editor .ql-editor.ql-blank::before {
                    color: rgba(255, 255, 255, 0.4) !important;
                }
                .dark-mode-editor .ql-editor p,
                .dark-mode-editor .ql-editor h1,
                .dark-mode-editor .ql-editor h2,
                .dark-mode-editor .ql-editor h3,
                .dark-mode-editor .ql-editor li {
                    color: #ffffff;
                }
                /* Renk seçicide beyaz rengin görünür olması için ince çerçeve */
                .ql-color-picker .ql-picker-options .ql-picker-item[data-value="#FFFFFF"],
                .ql-color-picker .ql-picker-options .ql-picker-item[data-value="#ffffff"] {
                    border: 1px solid #e5e7eb !important;
                }
            `}</style>
        </div>
    );
}
