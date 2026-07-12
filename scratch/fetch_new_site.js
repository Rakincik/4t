const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    try {
        console.log("Fetching live Yeni Next.js site kamplar page...");
        const { data } = await axios.get("https://www.4takademi.com/kamplar", {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        const $ = cheerio.load(data);
        
        console.log("Parsing HTML...");
        $('h3').each((i, el) => {
            const title = $(el).text().trim();
            // Find parent or container to check price
            const card = $(el).closest('.group');
            if (card.length > 0) {
                const price = card.find('.text-blue-900').text().trim();
                const oldPrice = card.find('.line-through').text().trim();
                const installment = card.find('.text-green-700, .text-green-800').text().trim();
                console.log(`Product: "${title}" | Price: "${price}" | OldPrice: "${oldPrice}" | Installment: "${installment}"`);
            } else {
                console.log(`Heading: "${title}"`);
            }
        });
    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
