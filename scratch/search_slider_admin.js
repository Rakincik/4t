const fs = require('fs');
const filePath = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/sayfalar/anasayfa/page.tsx';

const buf = fs.readFileSync(filePath);
const content = buf.toString('utf8');
const lines = content.split(/\r?\n/);

console.log(`Searching in admin/sayfalar/anasayfa/page.tsx (${lines.length} lines)...`);
lines.forEach((line, i) => {
    if (line.includes('slides') || line.includes('image') || line.includes('imageUrl') || line.includes('items')) {
        if (i < 400) { // output limit
            console.log(`Line ${i + 1}: ${line.trim()}`);
        }
    }
});
