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
        const variants = await prisma.courseVariant.findMany({
            include: {
                course: {
                    select: {
                        title: true
                    }
                }
            }
        });
        console.log("=== COURSE VARIANTS ===");
        variants.forEach(v => {
            console.log(`Variant: "${v.title}" | Price: ${v.price} | Old Price: ${v.oldPrice} | Course: "${v.course?.title}" (ID: ${v.courseId})`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
