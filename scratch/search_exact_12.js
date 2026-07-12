const fs = require('fs');

const files = [
    'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/flix/FlixClient.tsx',
    'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/flix/[slug]/FlixDetailClient.tsx'
];

files.forEach(file => {
    console.log(`\n=== FILE: ${file} ===`);
    const buf = fs.readFileSync(file);
    const content = buf.toString('utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, i) => {
        if (line.includes('12') || line.toLowerCase().includes('taksit')) {
            console.log(`  Line ${i+1}: ${line.trim()}`);
        }
    });
});
