const fs = require('fs');

const filePath = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/page.tsx';
const buf = fs.readFileSync(filePath);

let content = '';
if (buf[0] === 0xff && buf[1] === 0xfe) {
    content = buf.toString('utf16le');
} else {
    content = buf.toString('utf8');
}

const lines = content.split(/\r?\n/);
console.log(`Searching for blog section in homepage page.tsx (${lines.length} lines)...`);
let outputting = false;
let depth = 0;
lines.forEach((line, i) => {
    if (line.includes('cms?.blog') || line.includes('blogTitle') || line.includes('BlogCard')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
