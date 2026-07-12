const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const apiFiles = walk('c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/api');
console.log(`Found ${apiFiles.length} files in API folder.`);
apiFiles.forEach(file => {
    if (file.includes('page-content') || file.includes('content') || file.includes('settings')) {
        console.log("Matching file path:", file);
    }
});
