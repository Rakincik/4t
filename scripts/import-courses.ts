// scripts/import-courses.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

function generateSlug(text: string): string {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function scrapeCourseDetail(url: string) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        const title = $('h1.product_title').text().trim() || $('h1').first().text().trim();
        
        let priceText = $('p.price').text().trim();
        let price = 0;
        let oldPrice = null;
        
        if (priceText) {
            const prices = priceText.match(/[\d\.]+(?=,\d{2})/g);
            if (prices && prices.length > 0) {
                if(prices.length === 1) {
                    price = parseFloat(prices[0].replace(/\./g, ''));
                } else {
                    oldPrice = parseFloat(prices[0].replace(/\./g, ''));
                    price = parseFloat(prices[prices.length - 1].replace(/\./g, ''));
                }
            }
        }
        
        const imageUrl = $('.woocommerce-product-gallery__image img').attr('src') 
                        || $('.woocommerce-product-gallery__image img').attr('data-src')
                        || $('img.attachment-woocommerce_single').attr('src')
                        || $('img.attachment-shop_single').attr('src');
                        
        let description = $('#tab-description').html() || $('.elementor-widget-theme-post-content').html() || '';
        description = description.trim();

        return {
            title,
            price,
            oldPrice,
            imageUrl,
            description,
        };
    } catch (e: any) {
        return null;
    }
}

async function main() {
    console.log("🚀 Otomatik Veri Aktarım Botu Başlıyor...");
    
    const allCourses = [];
    
    for(let page = 1; page <= 9; page++) {
        const pageUrl = page === 1 
            ? "https://4takademi.com/kurs-kategori/uzaktan-egitim/" 
            : `https://4takademi.com/kurs-kategori/uzaktan-egitim/page/${page}/`;
            
        console.log(`\n📄 Sayfa Taraniyor: ${pageUrl}`);
        
        try {
            const { data } = await axios.get(pageUrl);
            const $ = cheerio.load(data);
            
            const productLinks: string[] = [];
            $('.product').each((i, el) => {
                const link = $(el).find('a').first().attr('href');
                if (link && !productLinks.includes(link)) {
                    productLinks.push(link);
                }
            });
            
            console.log(`🔍 Bu sayfada ${productLinks.length} kurs bulundu. Kaydediliyor...`);
            
            for (const link of productLinks) {
                const detail = await scrapeCourseDetail(link);
                
                if (detail && detail.title && detail.price > 0) {
                    let baseSlug = generateSlug(detail.title);
                    allCourses.push({
                        title: detail.title,
                        slug: baseSlug, // Final unique check can be done on server
                        description: detail.description,
                        price: detail.price,
                        oldPrice: detail.oldPrice,
                        imageUrl: detail.imageUrl,
                        type: 'KURS',
                        category: "uzaktan-egitim", 
                        isActive: true,
                    });
                    console.log(`   ✅ Çekildi: ${detail.title}`);
                }
                await new Promise(r => setTimeout(r, 300));
            }
            
        } catch (error: any) {
             if (error.response && error.response.status === 404) break;
        }
    }
    
    fs.writeFileSync('./kurslar_backup.json', JSON.stringify(allCourses, null, 2), 'utf-8');
    console.log(`\n🎉 BİTTİ! Toplam ${allCourses.length} adet kurs başarıyla 'kurslar_backup.json' dosyasına KAYDEDİLDİ!`);
}

main().catch(console.error);
