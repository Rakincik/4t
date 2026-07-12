const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

function getPrisma() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

async function run() {
    const prisma = getPrisma();
    try {
        const c1 = await prisma.course.findUnique({
            where: { id: "cmo1zoa6l001pg0suodmtpfn4" }
        });
        console.log("=== COURSE 1 ===");
        console.log(JSON.stringify(c1, null, 2));

        const c2 = await prisma.course.findFirst({
            where: { title: { contains: "VMY – Premium" } }
        });
        console.log("=== COURSE 2 ===");
        console.log(JSON.stringify(c2, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
