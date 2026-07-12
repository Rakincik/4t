const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    try {
        console.log("Fetching live WordPress kamp category page...");
        const { data } = await axios.get("https://4takademi.com/kurs-kategori/kamp/");
        const $ = cheerio.load(data);
        
        $('.product').each((i, el) => {
            const title = $(el).find('.woocommerce-loop-product__title').text().trim() || $(el).find('h2').text().trim();
            const price = $(el).find('.price').text().trim();
            console.log(`Product: "${title}" | Price HTML: "${price}"`);
        });
    } catch (e) {
        console.error(e.message);
    }
}

run();
