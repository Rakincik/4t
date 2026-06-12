const fs = require('fs');
const file = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/flix/FlixForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add state variables
content = content.replace(
    'const [error, setError] = useState<string | null>(null);',
    'const [error, setError] = useState<string | null>(null);\n    const [hasChanges, setHasChanges] = useState(false);\n    const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);'
);

// Update handleSubmit
content = content.replace(
    /await onSave\(fd\);\s*router\.push\("\/admin\/flix"\); router\.refresh\(\);\s*\} catch \(err: any\) \{ setError\(err\.message \|\| "Hata oluştu"\); \}\s*finally \{ setSaving\(false\); \}/,
    `await onSave(fd);
            if (mode === "create") {
                router.push("/admin/flix");
                router.refresh();
            } else {
                setHasChanges(false);
                setToast({ message: "Paket başarıyla güncellendi!", type: "success" });
                setTimeout(() => setToast(null), 3000);
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || "Hata oluştu");
            setToast({ message: err.message || "Bir hata oluştu, kaydedilemedi.", type: "error" });
            setTimeout(() => setToast(null), 3000);
        }
        finally { setSaving(false); }`
);

// Update form tag
content = content.replace(
    '<form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">',
    '<form onSubmit={handleSubmit} onChangeCapture={() => setHasChanges(true)} className="space-y-6 max-w-5xl relative">'
);

// Disable top button
content = content.replace(
    '<button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-50 shadow-lg text-sm">',
    '<button type="submit" disabled={saving || (!hasChanges && mode !== "create")} className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-50 shadow-lg text-sm">'
);

// Sticky bar
content = content.replace(
    '<div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 -mx-6 px-6 py-3 flex items-center justify-end gap-3 mt-6">',
    `<div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 -mx-6 px-6 py-3 flex items-center justify-between gap-3 mt-6 z-50">
                    <div className="flex items-center gap-2">
                        {hasChanges && <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg animate-pulse">Kaydedilmemiş değişiklikler var</span>}
                    </div>
                    <div className="flex items-center gap-3">`
);

content = content.replace(
    '<button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-50 shadow-lg text-sm">',
    '<button type="submit" disabled={saving || (!hasChanges && mode !== "create")} className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-50 shadow-lg text-sm">'
);

// Toast
content = content.replace(
    '</form>',
    `               </div>
                </div>

                {/* Toast Popup */}
                {toast && (
                    <div className={\`fixed bottom-20 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up-fade \${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}\`}>
                        {toast.type === "success" ? <CheckIcon className="w-6 h-6" /> : <XMarkIcon className="w-6 h-6" />}
                        <div>
                            <div className="font-bold text-sm">{toast.type === "success" ? "Başarılı!" : "Hata!"}</div>
                            <div className="text-xs opacity-90">{toast.message}</div>
                        </div>
                    </div>
                )}
        </form>`
);

fs.writeFileSync(file, content);
console.log('Flix updated!');
