const axios = require('axios');
const cheerio = require('cheerio');

async function scrape() {
    console.log("Fetching: https://4takademi.com/kurs-kategori/uzaktan-egitim/");
    const { data } = await axios.get("https://4takademi.com/kurs-kategori/uzaktan-egitim/");
    
    const $ = cheerio.load(data);
    
    // WooCommerce default class is usually .product
    const products = [];
    $('.product').each((i, el) => {
        if(i > 3) return; // limit to 4
        
        const title = $(el).find('.woocommerce-loop-product__title').text().trim() || $(el).find('h2, h3').text().trim();
        const link = $(el).find('a').attr('href');
        const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
        const priceText = $(el).find('.price').text().trim();
        
        products.push({ title, link, img, priceText });
    });
    
    console.log("Found products:");
    console.log(JSON.stringify(products, null, 2));
}

scrape().catch(console.error);
