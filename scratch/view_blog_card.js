const fs = require('fs');
const filePath = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/components/BlogCard.tsx';

try {
    const buf = fs.readFileSync(filePath);
    let content = '';
    if (buf[0] === 0xff && buf[1] === 0xfe) {
        content = buf.toString('utf16le');
    } else {
        content = buf.toString('utf8');
    }
    console.log(content);
} catch (e) {
    console.error("Error reading file:", e.message);
}
