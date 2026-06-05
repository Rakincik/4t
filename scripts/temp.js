import axios from 'axios';
import * as cheerio from 'cheerio';
async function run() {
  const r = await axios.get('https://4takademi.com/kurs-kategori/uzaktan-egitim/');
  const $ = cheerio.load(r.data);
  const categories = [];
  $('.product-categories li a').each((i, el) => {
    categories.push($(el).text().trim());
  });
  console.log('--- FOUND CATEGORIES ---');
  console.log(categories);
}
run();
