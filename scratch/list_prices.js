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
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                oldPrice: true,
                variants: true
            }
        });
        console.log("=== COURSES ===");
        courses.forEach(c => {
            console.log(`Course: "${c.title}" (ID: ${c.id})`);
            console.log(`  Price: ${c.price} | Old Price: ${c.oldPrice}`);
            if (c.variants && c.variants.length > 0) {
                console.log(`  Variants:`);
                c.variants.forEach(v => {
                    console.log(`    - "${v.title}": Price: ${v.price} | Old Price: ${v.oldPrice}`);
                });
            }
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
