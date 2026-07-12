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
        const flixCourses = await prisma.course.findMany({
            where: { title: { startsWith: '4T FLIX' } },
            select: { slug: true, title: true, id: true }
        });
        console.log("=== FLIX SLUGS ===");
        console.log(JSON.stringify(flixCourses, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
