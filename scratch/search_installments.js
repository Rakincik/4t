const fs = require("fs");
const path = require("path");

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (file !== "node_modules" && file !== ".next" && file !== ".git") {
                results = results.concat(walk(fullPath));
            }
        } else {
            if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".js") || file.endsWith(".html") || file.endsWith(".json")) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk("c:\\Users\\Rüstem\\Desktop\\4t-akademi-yeni\\src");
files.forEach(file => {
    const content = fs.readFileSync(file, "utf8");
    if (content.toLowerCase().includes("12 taksit") || content.toLowerCase().includes("taksit ( aylık")) {
        console.log(`Found in: ${file}`);
    }
});
