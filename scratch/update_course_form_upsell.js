const fs = require('fs');
const file = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/kurslar/CourseForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add states
content = content.replace(
    'const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);',
    'const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);\n    const [flixUpsellText, setFlixUpsellText] = useState((course as any)?.flixUpsellText || "");\n    const [flixUpsellLink, setFlixUpsellLink] = useState((course as any)?.flixUpsellLink || "");'
);

// Add to formData
content = content.replace(
    'fd.append("accessDurationDays", accessDurationDays);',
    'fd.append("accessDurationDays", accessDurationDays);\n            fd.append("flixUpsellText", flixUpsellText);\n            fd.append("flixUpsellLink", flixUpsellLink);'
);

// Add section to navigation
content = content.replace(
    '{ id: "temel", label: "Temel Bilgiler", icon: AcademicCapIcon },',
    '{ id: "temel", label: "Temel Bilgiler", icon: AcademicCapIcon },\n        { id: "pazarlama", label: "Pazarlama (Upsell)", icon: FireIcon },'
);

// Add FireIcon import
if(!content.includes('FireIcon')) {
    content = content.replace('UsersIcon,', 'UsersIcon, FireIcon,');
}

// Render the UI in form
const sectionUI = `
                    {/* ======================= PAZARLAMA / UPSELL ======================= */}
                    <div id="section-pazarlama" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 border-t-4 border-t-red-500 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><FireIcon className="w-4 h-4 text-gray-400" /> Pazarlama ve FLIX Yönlendirme (Upsell)</h2>
                        <p className="text-xs text-gray-500">Bu alan doldurulursa, kurs detay sayfasının en üstünde dikkat çekici bir bildirim çubuğu (Smart Bar) çıkar. Öğrencileri daha üst paketlere (Örn: FLIX) yönlendirmek için harikadır.</p>
                        <div>
                            <label className={labelCls}>Smart Bar Metni</label>
                            <input type="text" value={flixUpsellText} onChange={(e) => setFlixUpsellText(e.target.value)} className={inputCls} placeholder="Örn: Bu kurs Kaymakamlık FLIX aboneliğine dahildir. FLIX ile tüm kampa %40 avantajla sahip olun!" />
                        </div>
                        <div>
                            <label className={labelCls}>Yönlendirilecek Link</label>
                            <input type="text" value={flixUpsellLink} onChange={(e) => setFlixUpsellLink(e.target.value)} className={inputCls} placeholder="Örn: /flix/kaymakamlik-flix" />
                        </div>
                    </div>`;

content = content.replace(
    '<div id="section-fiyat"',
    sectionUI + '\n\n                    <div id="section-fiyat"'
);

fs.writeFileSync(file, content);
console.log('CourseForm updated!');
