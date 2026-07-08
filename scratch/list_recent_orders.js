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

async function listOrders() {
    const prisma = getPrisma();
    console.log("=== Listing Recent Orders ===");
    try {
        const orders = await prisma.order.findMany({
            orderBy: { id: 'desc' },
            take: 5
        });
        console.log(`Found ${orders.length} orders:`);
        orders.forEach(o => {
            console.log(`ID: ${o.id} | Status: ${o.status} | Total: ${o.totalAmount} | Notes: ${o.notes}`);
        });
    } catch (error) {
        console.error("Error listing orders:", error);
    } finally {
        await prisma.$disconnect();
    }
}

listOrders();
