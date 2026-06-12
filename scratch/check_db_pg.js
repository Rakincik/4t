const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/4takademi' });
async function main() {
    const res = await pool.query('SELECT "pageSlug", "sectionKey", content, metadata FROM "PageContent"');
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
}
main();
