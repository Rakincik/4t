/**
 * Admin Kullanıcısı Oluşturma Script'i
 * 
 * Kullanım:
 * npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/create-admin.ts
 * 
 * veya package.json'a script ekleyip:
 * npm run create-admin
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@4takademi.com";
    const password = "admin123"; // Değiştirin!
    const name = "Admin";

    // Check if admin exists
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        console.log("Admin user already exists:", email);
        return;
    }

    const hashedPassword = await hash(password, 12);

    const admin = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: "ADMIN",
        },
    });

    console.log("✅ Admin user created successfully!");
    console.log("   Email:", admin.email);
    console.log("   Password:", password);
    console.log("\n⚠️  Lütfen ilk girişten sonra şifrenizi değiştirin!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
