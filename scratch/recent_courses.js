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
            orderBy: {
                updatedAt: 'desc'
            },
            take: 10,
            select: {
                id: true,
                title: true,
                price: true,
                oldPrice: true,
                updatedAt: true
            }
        });
        console.log("=== RECENTLY UPDATED COURSES ===");
        courses.forEach(c => {
            console.log(`Course: "${c.title}" | Price: ${c.price} | OldPrice: ${c.oldPrice} | UpdatedAt: ${c.updatedAt}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
