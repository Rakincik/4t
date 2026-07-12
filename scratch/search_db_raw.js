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
            where: {
                OR: [
                    { price: 3748 },
                    { price: 9902 },
                    { oldPrice: 3748 },
                    { oldPrice: 9902 }
                ]
            }
        });
        console.log(`Found courses in db: ${courses.length}`);
        courses.forEach(c => {
            console.log(`Course: "${c.title}" | Price: ${c.price} | OldPrice: ${c.oldPrice}`);
        });

        const variants = await prisma.courseVariant.findMany({
            where: {
                OR: [
                    { price: 3748 },
                    { price: 9902 },
                    { oldPrice: 3748 },
                    { oldPrice: 9902 }
                ]
            }
        });
        console.log(`Found variants in db: ${variants.length}`);
        variants.forEach(v => {
            console.log(`Variant: "${v.title}" | Price: ${v.price} | OldPrice: ${v.oldPrice}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
