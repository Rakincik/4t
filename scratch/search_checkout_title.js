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
console.log(`Searching for "Satın" in checkout page.tsx (${lines.length} lines)...`);
lines.forEach((line, i) => {
    if (line.includes('Satın') || line.includes('Bilgiler') || line.includes('secure') || line.includes('checkout') || line.includes('mt-') || line.includes('pt-') || line.includes('py-')) {
        if (i < 500) { // Limit output
            console.log(`Line ${i + 1}: ${line.trim()}`);
        }
    }
});
