const fs = require('fs');
const path = require('path');

const target1 = '3748';
const target2 = '9902';

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                searchDir(fullPath);
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.css')) {
                const buf = fs.readFileSync(fullPath);
                let content = '';
                if (buf[0] === 0xff && buf[1] === 0xfe) {
                    content = buf.toString('utf16le');
                } else {
                    content = buf.toString('utf8');
                }
                if (content.includes(target1) || content.includes(target2)) {
                    console.log(`Found match in file: ${fullPath}`);
                    const lines = content.split(/\r?\n/);
                    lines.forEach((line, i) => {
                        if (line.includes(target1) || line.includes(target2)) {
                            console.log(`  Line ${i+1}: ${line.trim()}`);
                        }
                    });
                }
            }
        }
    }
}

searchDir('c:/Users/Rüstem/Desktop/4t-akademi-yeni');
console.log('Search complete.');
