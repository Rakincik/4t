"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { 
    LinkIcon, 
    ListBulletIcon,
    QueueListIcon,
    Bars3BottomLeftIcon,
    Bars3Icon,
    Bars3BottomRightIcon,
    Bars3CenterLeftIcon,
    ChatBubbleBottomCenterTextIcon,
    InformationCircleIcon,
    CursorArrowRaysIcon,
    XMarkIcon,
    PhotoIcon,
    ArrowPathIcon,
    DocumentIcon
} from "@heroicons/react/24/outline";

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    minRows?: number;
}

export default function RichTextEditor({ value, onChange, placeholder, minRows = 3 }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);

    // Modal States
    const [isButtonModalOpen, setIsButtonModalOpen] = useState(false);
    const [btnText, setBtnText] = useState("");
    const [btnUrl, setBtnUrl] = useState("https://");
    const [btnTheme, setBtnTheme] = useState("primary");
    const [btnSize, setBtnSize] = useState("md");
    const [btnTarget, setBtnTarget] = useState("_self");

    // Color Picker State
    const colorInputRef = useRef<HTMLInputElement>(null);

    // Image Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Document Upload State
    const docInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);

    useEffect(() => {
        if (editorRef.current && !isInternalChange.current) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || "";
            }
        }
        isInternalChange.current = false;
    }, [value]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            isInternalChange.current = true;
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const exec = (cmd: string, val?: string) => {
        document.execCommand(cmd, false, val);
        editorRef.current?.focus();
        handleInput();
    };

    const addLink = () => {
        const url = prompt("URL girin:", "https://");
        if (url) exec("createLink", url);
    };

    const insertBlockquote = () => {
        const html = `<blockquote style="border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1.5rem 0; color: #4b5563; font-style: italic; background: #eff6ff; padding: 1rem; border-radius: 0 0.5rem 0.5rem 0;">Alıntı metninizi buraya yazın...</blockquote><p><br></p>`;
        exec("insertHTML", html);
    };

    const insertAlert = () => {
        const html = `<div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 1rem; margin: 1.5rem 0; border-radius: 0 0.5rem 0.5rem 0; color: #991b1b;"><strong style="color: #b91c1c;">Dikkat:</strong> Uyarı metninizi buraya yazın.</div><p><br></p>`;
        exec("insertHTML", html);
    };

    const insertButton = () => {
        if (!btnText || !btnUrl) return;
        
        let bgColor = "#3B82F6"; // var(--primary)
        let textColor = "#ffffff";
        if (btnTheme === "secondary") { bgColor = "#1F2937"; }
        else if (btnTheme === "danger") { bgColor = "#EF4444"; }
        else if (btnTheme === "success") { bgColor = "#10B981"; }

        let padding = "10px 20px";
        let fontSize = "14px";
        if (btnSize === "sm") { padding = "6px 12px"; fontSize = "12px"; }
        else if (btnSize === "lg") { padding = "14px 28px"; fontSize = "16px"; }

        const html = `&nbsp;<a href="${btnUrl}" target="${btnTarget}" style="display: inline-block; background-color: ${bgColor}; color: ${textColor}; padding: ${padding}; font-size: ${fontSize}; font-weight: bold; text-decoration: none; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0.5rem 0;">${btnText}</a>&nbsp;`;
        
        // Restore selection if lost, or just append
        editorRef.current?.focus();
        exec("insertHTML", html);
        
        setIsButtonModalOpen(false);
        setIsButtonModalOpen(false);
        setBtnText("");
        setBtnUrl("https://");
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) {
                editorRef.current?.focus();
                const html = `&nbsp;<img src="${data.url}" alt="Uploaded Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;" />&nbsp;<p><br></p>`;
                exec("insertHTML", html);
            } else {
                alert("Görsel yüklenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Görsel yüklenemedi.");
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 20 * 1024 * 1024) {
            alert("Dosya boyutu 20 MB'dan büyük olamaz.");
            return;
        }

        setIsUploadingDoc(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) {
                editorRef.current?.focus();
                
                // Eğer PDF ise iframe ile göm (indirmeyi zorlaştırmak için #toolbar=0 eklendi)
                // Eğer PPT ise Google Docs Viewer ile göm
                const isPdf = file.name.toLowerCase().endsWith('.pdf');
                const embedUrl = isPdf 
                    ? `${data.url}#toolbar=0` 
                    : `https://docs.google.com/viewer?url=${encodeURIComponent(data.url)}&embedded=true`;
                
                const html = `&nbsp;<div class="document-embed-wrapper" style="width: 100%; max-width: 100%; margin: 1.5rem 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); background: #f9fafb;"><div style="background: #f3f4f6; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; font-weight: bold; color: #4b5563; display: flex; align-items: center;"><svg style="width: 16px; height: 16px; margin-right: 6px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>${file.name}</div><iframe src="${embedUrl}" width="100%" height="600px" frameborder="0" style="border: none;" allowfullscreen></iframe></div>&nbsp;<p><br></p>`;
                
                exec("insertHTML", html);
            } else {
                alert("Dosya yüklenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Dosya yüklenemedi.");
        } finally {
            setIsUploadingDoc(false);
            if (docInputRef.current) {
                docInputRef.current.value = "";
            }
        }
    };

    const isActive = (cmd: string) => {
        try { return document.queryCommandState(cmd); } catch { return false; }
    };

    const btnCls = (active: boolean) =>
        `w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

    return (
        <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50/50">
                {/* Block Format */}
                <select 
                    onChange={(e) => exec("formatBlock", e.target.value)}
                    className="h-7 text-xs border border-gray-200 rounded px-1 outline-none focus:border-blue-400 bg-white"
                    defaultValue="P"
                >
                    <option value="P">Normal Metin</option>
                    <option value="H1">Başlık 1</option>
                    <option value="H2">Başlık 2</option>
                    <option value="H3">Başlık 3</option>
                </select>

                <div className="w-px h-4 bg-gray-200 mx-0.5" />

                {/* Text Formatting */}
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("bold"); }} className={btnCls(isActive("bold"))} title="Kalın"><strong>B</strong></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("italic"); }} className={btnCls(isActive("italic"))} title="İtalik"><em>I</em></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("underline"); }} className={btnCls(isActive("underline"))} title="Altı Çizili"><span className="underline">U</span></button>
                
                {/* Text Color */}
                <div className="relative flex items-center">
                    <input 
                        type="color" 
                        ref={colorInputRef} 
                        onChange={(e) => exec("foreColor", e.target.value)}
                        className="w-0 h-0 opacity-0 absolute"
                        title="Metin Rengi"
                    />
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); colorInputRef.current?.click(); }} className={btnCls(false)} title="Metin Rengi">
                        <span className="text-[14px] font-serif" style={{ color: "red" }}>A</span>
                    </button>
                </div>

                <div className="w-px h-4 bg-gray-200 mx-0.5" />

                {/* Alignment */}
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("justifyLeft"); }} className={btnCls(isActive("justifyLeft"))} title="Sola Hizala"><Bars3BottomLeftIcon className="w-4 h-4" /></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("justifyCenter"); }} className={btnCls(isActive("justifyCenter"))} title="Ortala"><Bars3Icon className="w-4 h-4" /></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("justifyRight"); }} className={btnCls(isActive("justifyRight"))} title="Sağa Hizala"><Bars3BottomRightIcon className="w-4 h-4" /></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("justifyFull"); }} className={btnCls(isActive("justifyFull"))} title="İki Yana Yasla"><Bars3CenterLeftIcon className="w-4 h-4" /></button>

                <div className="w-px h-4 bg-gray-200 mx-0.5" />

                {/* Lists & Quotes */}
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }} className={btnCls(isActive("insertUnorderedList"))} title="Liste"><ListBulletIcon className="w-4 h-4" /></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }} className={btnCls(isActive("insertOrderedList"))} title="Numaralı Liste"><QueueListIcon className="w-4 h-4" /></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); insertBlockquote(); }} className={btnCls(false)} title="Alıntı Ekle"><ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5" /></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); insertAlert(); }} className={btnCls(false)} title="Uyarı Kutusu Ekle"><InformationCircleIcon className="w-4 h-4 text-red-500" /></button>

                <div className="w-px h-4 bg-gray-200 mx-0.5" />

                {/* Links, Images & Buttons */}
                <button type="button" onMouseDown={e => { e.preventDefault(); addLink(); }} className={btnCls(false)} title="Link Ekle"><LinkIcon className="w-3.5 h-3.5" /></button>
                
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                <button type="button" onMouseDown={e => { e.preventDefault(); fileInputRef.current?.click(); }} disabled={isUploadingImage} className={`${btnCls(false)} ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''} ml-1`} title="Görsel Ekle">
                    {isUploadingImage ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : <PhotoIcon className="w-3.5 h-3.5" />}
                </button>

                <button type="button" onMouseDown={e => { e.preventDefault(); setIsButtonModalOpen(true); }} className="px-2 h-7 rounded flex items-center justify-center text-xs font-bold transition bg-blue-100 text-blue-700 hover:bg-blue-200 ml-1" title="Buton Ekle">
                    <CursorArrowRaysIcon className="w-3.5 h-3.5 mr-1" />
                    Buton
                </button>

                <input type="file" accept=".pdf,.ppt,.pptx" className="hidden" ref={docInputRef} onChange={handleDocUpload} />
                <button type="button" onMouseDown={e => { e.preventDefault(); docInputRef.current?.click(); }} disabled={isUploadingDoc} className={`px-2 h-7 rounded flex items-center justify-center text-xs font-bold transition bg-purple-100 text-purple-700 hover:bg-purple-200 ml-1 ${isUploadingDoc ? 'opacity-50 cursor-not-allowed' : ''}`} title="Doküman (PDF/PPT) Ekle">
                    {isUploadingDoc ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin mr-1" /> : <DocumentIcon className="w-3.5 h-3.5 mr-1" />}
                    Dosya Yükle
                </button>

                <div className="ml-auto flex items-center gap-2">
                    <span className="text-[9px] text-gray-400 font-medium hidden sm:inline-block">Görsel: Maks 2MB | Dosya: Maks 20MB</span>
                    <button type="button" onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }} className="w-7 h-7 rounded flex items-center justify-center text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 transition" title="Formatı Temizle">
                        ✕
                    </button>
                </div>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="px-4 py-3 text-sm text-gray-800 outline-none min-h-[4rem] prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:underline [&_b]:font-bold [&_i]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
                style={{ minHeight: `${minRows * 1.5}rem` }}
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />

            {/* Button Modal */}
            {isButtonModalOpen && (
                <div className="absolute top-0 left-0 w-full h-full bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-4 w-full max-w-sm relative">
                        <button onClick={() => setIsButtonModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Buton Ekle</h4>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Buton Metni</label>
                                <input type="text" value={btnText} onChange={(e) => setBtnText(e.target.value)} placeholder="Örn: Kayıt Ol" className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Link URL</label>
                                <input type="text" value={btnUrl} onChange={(e) => setBtnUrl(e.target.value)} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Tema</label>
                                    <select value={btnTheme} onChange={(e) => setBtnTheme(e.target.value)} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 outline-none">
                                        <option value="primary">Mavi (Primary)</option>
                                        <option value="secondary">Siyah (Dark)</option>
                                        <option value="danger">Kırmızı (Dikkat)</option>
                                        <option value="success">Yeşil (Başarı)</option>
                                    </select>
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Boyut</label>
                                    <select value={btnSize} onChange={(e) => setBtnSize(e.target.value)} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 outline-none">
                                        <option value="sm">Küçük</option>
                                        <option value="md">Normal</option>
                                        <option value="lg">Büyük</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Açılış</label>
                                <select value={btnTarget} onChange={(e) => setBtnTarget(e.target.value)} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 outline-none">
                                    <option value="_self">Aynı Sekmede</option>
                                    <option value="_blank">Yeni Sekmede (_blank)</option>
                                </select>
                            </div>
                            <button onClick={insertButton} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                                Editöre Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                [data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
