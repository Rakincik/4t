const fs = require('fs');

const filePath = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/kurslar/CourseForm.tsx';
const buf = fs.readFileSync(filePath);

let content = '';
if (buf[0] === 0xff && buf[1] === 0xfe) {
    content = buf.toString('utf16le');
} else if (buf[0] === 0xfe && buf[1] === 0xff) {
    // Big endian utf-16 is not natively supported well as string encoding in Node, but let's swap
    const temp = Buffer.alloc(buf.length);
    for (let i = 0; i < buf.length; i += 2) {
        temp[i] = buf[i+1];
        temp[i+1] = buf[i];
    }
    content = temp.toString('utf16le');
} else {
    content = buf.toString('utf8');
}

const lines = content.split(/\r?\n/);
console.log(`Searching for "price" in CourseForm.tsx (${lines.length} lines)...`);
let matchCount = 0;
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('price') || line.toLowerCase().includes('fiyat')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
        matchCount++;
    }
});
console.log(`Found ${matchCount} matches.`);
