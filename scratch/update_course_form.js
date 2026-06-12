const fs = require('fs');
const file = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/kurslar/CourseForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add color borders to sections
const colors = {
    temel: 'blue',
    fiyat: 'green',
    varyasyon: 'purple',
    ozellikler: 'yellow',
    bento: 'pink',
    kazanimlar: 'cyan',
    mufredat: 'indigo',
    egitmen: 'rose',
    kuponlar: 'orange'
};
for(const [id, color] of Object.entries(colors)) {
    content = content.replace(
        new RegExp(`<div id="section-${id}" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">`),
        `<div id="section-${id}" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 border-t-4 border-t-${color}-500 shadow-sm">`
    );
}

// 2. Add state variables
content = content.replace(
    'const [activeSection, setActiveSection] = useState("temel");',
    'const [activeSection, setActiveSection] = useState("temel");\n    const [hasChanges, setHasChanges] = useState(false);\n    const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);'
);

// 3. Update handleSubmit
content = content.replace(
    /if \(mode === "create"\) await createCourse\(fd\);\s*else if \(course\) await updateCourse\(course\.id, fd\);\s*router\.push\("\/admin\/kurslar"\); router\.refresh\(\);\s*\} catch \(err: any\) \{ setError\(err\.message \|\| "Bir hata oluştu"\); \}\s*finally \{ setSaving\(false\); \}/,
    `if (mode === "create") {
                await createCourse(fd);
                router.push("/admin/kurslar");
                router.refresh();
            } else if (course) {
                await updateCourse(course.id, fd);
                setHasChanges(false);
                setToast({ message: "Ürün başarıyla güncellendi!", type: "success" });
                setTimeout(() => setToast(null), 3000);
                router.refresh();
            }
        } catch (err: any) { 
            setError(err.message || "Bir hata oluştu"); 
            setToast({ message: err.message || "Bir hata oluştu, kaydedilemedi.", type: "error" });
            setTimeout(() => setToast(null), 3000);
        }
        finally { setSaving(false); }`
);

// 4. Update form tag
content = content.replace(
    '<form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">',
    '<form onSubmit={handleSubmit} onChangeCapture={() => setHasChanges(true)} className="space-y-6 max-w-5xl relative">'
);

// 5. Update Sticky Alt Bar
content = content.replace(
    '<div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 -mx-6 px-6 py-3 flex items-center justify-end gap-3">',
    `<div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 -mx-6 px-6 py-3 flex items-center justify-between gap-3 z-50">
                <div className="flex items-center gap-2">
                    {hasChanges && <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg animate-pulse">Kaydedilmemiş değişiklikler var</span>}
                </div>
                <div className="flex items-center gap-3">`
);
content = content.replace(
    '<button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B1221] text-white font-bold rounded-xl hover:bg-[#0B1221]/90 transition disabled:opacity-50 shadow-lg shadow-gray-300 text-sm">',
    '<button type="submit" disabled={saving || (!hasChanges && mode !== "create")} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B1221] text-white font-bold rounded-xl hover:bg-[#0B1221]/90 transition disabled:opacity-50 shadow-lg shadow-gray-300 text-sm">'
);

// 6. Fix closing div for sticky bar and add toast
content = content.replace(
    '</form>',
    `            </div>
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
console.log('Done!');
