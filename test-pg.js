const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://4takademi:secret@localhost:5434/4takademi'
});
async function run() {
  await client.connect();
  const res = await client.query('SELECT * FROM "PageContent"');
  console.log(res.rows);
  const heroRes = await client.query('SELECT * FROM "HeroSlide"');
  console.log("HeroSlides:", heroRes.rows);
  await client.end();
}
run().catch(console.error);
