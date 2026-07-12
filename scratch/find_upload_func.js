const fs = require('fs');
const filePath = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/sayfalar/anasayfa/page.tsx';

const buf = fs.readFileSync(filePath);
const content = buf.toString('utf8');
const lines = content.split(/\r?\n/);

lines.forEach((line, i) => {
    if (line.includes('uploadFile') || line.includes('function') || line.includes('const upload')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
