const fs = require('fs');
const filePath = 'c:/Users/Rüstem/Desktop/4t-akademi-yeni/src/app/admin/kurslar/CourseForm.tsx';

const buf = fs.readFileSync(filePath);
const content = buf.toString('utf8');
const lines = content.split(/\r?\n/);

lines.forEach((line, i) => {
    if (line.includes('sections =') || line.includes('const sections')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
