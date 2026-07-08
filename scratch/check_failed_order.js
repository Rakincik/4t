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

async function checkOrder() {
    const prisma = getPrisma();
    const orderId = "cnqwe73260000eo8suhzqz9zu3";
    console.log("=== Checking Order ===", orderId);
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });
        if (order) {
            console.log("Status:", order.status);
            console.log("Notes:", order.notes);
            console.log("Total Amount:", order.totalAmount);
            console.log("Customer Phone:", order.customerPhone);
            console.log("Customer Name:", order.customerName);
        } else {
            console.log("Order not found by ID. Checking by orderNumber...");
            const order2 = await prisma.order.findFirst({
                where: { orderNumber: orderId }
            });
            if (order2) {
                console.log("Status:", order2.status);
                console.log("Notes:", order2.notes);
                console.log("Total Amount:", order2.totalAmount);
            } else {
                console.log("Order not found anywhere.");
            }
        }
    } catch (error) {
        console.error("Error checking order:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkOrder();
