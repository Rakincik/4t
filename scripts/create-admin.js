require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await hash("admin123", 12);

    const admin = await prisma.user.create({
        data: {
            email: "admin@4takademi.com",
            password: hashedPassword,
            name: "Admin",
            role: "ADMIN",
        },
    });

    console.log("✅ Admin user created!");
    console.log("   Email:", admin.email);
    console.log("   Password: admin123");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
