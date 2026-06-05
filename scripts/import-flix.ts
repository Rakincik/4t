// scripts/import-flix.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import prisma from '../src/lib/prisma';

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
    console.log("🚀 FLIX Aktarım Botu Başlıyor...");
    
    // Yalnızca 1 sayfa var gibi görünüyor flix kategorisinde, ama garanti olsun diye 2 sayfa tarıyoruz.
    let totalAdded = 0;
    
    for(let page = 1; page <= 2; page++) {
        const pageUrl = page === 1 
            ? "https://4takademi.com/kurs-kategori/4t-flix/" 
            : `https://4takademi.com/kurs-kategori/4t-flix/page/${page}/`;
            
        console.log(`\n📄 FLIX Sayfası Taranıyor: ${pageUrl}`);
        
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
            
            if (productLinks.length === 0) {
                console.log("🔍 Bu sayfada paket bulunamadı, tarama tamamlanıyor.");
                break;
            }
            
            console.log(`🔍 Bu sayfada ${productLinks.length} FLIX paketi bulundu. Kaydediliyor...`);
            
            for (const link of productLinks) {
                const detail = await scrapeCourseDetail(link);
                
                if (detail && detail.title && detail.price > 0) {
                    let baseSlug = generateSlug(detail.title);
                    
                    const existing = await prisma.course.findFirst({
                        where: { OR: [ { slug: baseSlug }, { title: detail.title } ]}
                    });

                    if (!existing) {
                        await prisma.course.create({
                            data: {
                                title: detail.title,
                                slug: baseSlug,
                                description: detail.description,
                                subtitle: 'Sinematik Eğitim Deneyimi',
                                price: detail.price,
                                oldPrice: detail.oldPrice,
                                imageUrl: detail.imageUrl,
                                type: 'FLIX', // Flix olarak kaydediyoruz!
                                category: "4t-flix", 
                                isActive: true,
                            }
                        });
                        totalAdded++;
                        console.log(`   ✅ DB'ye Eklendi: ${detail.title}`);
                    } else {
                        // Zaten varsa türünü FLIX olarak güncelle
                        await prisma.course.update({
                            where: { id: existing.id },
                            data: {
                                type: 'FLIX',
                                category: "4t-flix",
                                subtitle: 'Sinematik Eğitim Deneyimi'
                            }
                        });
                        totalAdded++;
                        console.log(`   ✅ Güncellendi (Tür FLIX yapıldı): ${detail.title}`);
                    }
                }
                await new Promise(r => setTimeout(r, 600)); // Rate limit olmaması için bekle
            }
            
        } catch (error: any) {
             if (error.response && error.response.status === 404) break;
             console.error(`Sayfa işlenirken hata (Page ${page}):`, error.message);
        }
    }
    
    console.log(`\n🎉 MUHTEŞEM! Toplam ${totalAdded} adet FLIX Paketi direkt olarak veritabanına eklendi!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
