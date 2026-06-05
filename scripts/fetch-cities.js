const fs = require('fs');

async function fetchCities() {
  try {
    const res = await fetch('https://turkiyeapi.dev/api/v1/provinces');
    const db = await res.json();
    
    // Transform into a compact format: [ { name: "Adana", districts: ["Seyhan", "Çukurova"] } ]
    const data = db.data.map(prov => ({
      name: prov.name,
      districts: prov.districts.map(d => d.name)
    })).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

    fs.writeFileSync('./public/iller.json', JSON.stringify(data, null, 2));
    console.log('Iller başarıyla public/iller.json konumuna kaydedildi!');
  } catch (err) {
    console.error('Hata:', err);
  }
}

fetchCities();
