const fs = require('fs');

const filePath = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/checkout/page.tsx';
const buf = fs.readFileSync(filePath);

let content = '';
if (buf[0] === 0xff && buf[1] === 0xfe) {
    content = buf.toString('utf16le');
} else {
    content = buf.toString('utf8');
}

const lines = content.split(/\r?\n/);
console.log(`Searching for "Sözleşmesi" in checkout page.tsx (${lines.length} lines)...`);
lines.forEach((line, i) => {
    if (line.includes('Sözleşme') || line.includes('Öğrenim') || line.includes('MADDE') || line.includes('max-h-') || line.includes('overflow-y-')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
