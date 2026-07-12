const fs = require('fs');
const path = require('path');

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
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
                const buf = fs.readFileSync(fullPath);
                const content = buf.toString('utf8');
                if (content.includes('usedCategories')) {
                    console.log(`Found "usedCategories" in: ${fullPath}`);
                    const lines = content.split(/\r?\n/);
                    lines.forEach((line, i) => {
                        if (line.includes('usedCategories')) {
                            console.log(`  Line ${i+1}: ${line.trim()}`);
                        }
                    });
                }
            }
        }
    }
}

searchDir('c:/Users/Rüstem/Desktop/4t-akademi-yeni/src');
console.log('Search complete.');
