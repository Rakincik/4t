const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

function getPrisma() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

async function checkCourses() {
    console.log("=== Checking Courses in Database ===");
    const prisma = getPrisma();
    try {
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                isActive: true
            }
        });
        console.log(`Found ${courses.length} courses:`);
        courses.forEach(c => {
            console.log(`ID: ${c.id} | Title: ${c.title} | Price: ${c.price} | Active: ${c.isActive}`);
        });
    } catch (error) {
        console.error("Error checking courses:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCourses();
