const fs = require('fs');

const filePath = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/prisma/schema.prisma';
const buf = fs.readFileSync(filePath);
const content = buf.toString('utf8');

const lines = content.split(/\r?\n/);
lines.forEach((line, i) => {
    if (line.includes('model') || line.includes('Slide') || line.includes('Hero')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
