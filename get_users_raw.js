const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://4takademi:secret@localhost:5432/4takademi'
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT * FROM "User"');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
