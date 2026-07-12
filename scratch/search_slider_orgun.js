const fs = require('fs');

const files = [
    'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/sayfalar/orgun-egitim/page.tsx',
    'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/sayfalar/orgun-egitim/[slug]/page.tsx'
];

files.forEach(filePath => {
    try {
        const buf = fs.readFileSync(filePath);
        const content = buf.toString('utf8');
        const lines = content.split(/\r?\n/);
        console.log(`\n--- Searching in ${filePath} (${lines.length} lines) ---`);
        lines.forEach((line, i) => {
            if (line.includes('slides') || line.includes('image') || line.includes('imageUrl') || line.includes('items') || line.includes('s.image')) {
                if (i < 300) {
                    console.log(`Line ${i + 1}: ${line.trim()}`);
                }
            }
        });
    } catch (e) {
        console.error("Error reading file:", filePath, e.message);
    }
});
