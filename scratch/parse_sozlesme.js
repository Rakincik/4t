const fs = require('fs');
const path = require('path');

function parseSozlesme() {
    const xmlPath = path.join(__dirname, '..', 'word', 'document.xml');
    if (!fs.existsSync(xmlPath)) {
        console.error("document.xml not found!");
        return;
    }

    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    
    // Match <w:t>...</w:t> tags
    const wtRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;
    let match;
    let paragraphs = [];
    let currentParagraph = "";

    // We can also split by <w:p> to separate paragraphs!
    const wpList = xmlContent.split(/<w:p\b[^>]*>/);
    
    for (const wp of wpList) {
        let pText = "";
        let wtMatch;
        const pRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;
        while ((wtMatch = pRegex.exec(wp)) !== null) {
            pText += wtMatch[1];
        }
        if (pText.trim()) {
            paragraphs.push(pText.trim());
        }
    }

    const cleanText = paragraphs.join('\n\n');
    fs.writeFileSync(path.join(__dirname, 'sozlesme.txt'), cleanText, 'utf8');
    console.log("Successfully extracted text to scratch/sozlesme.txt! Total paragraphs:", paragraphs.length);
}

parseSozlesme();
