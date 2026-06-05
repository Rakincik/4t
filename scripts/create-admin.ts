/**
 * Admin Kullanıcısı Oluşturma Script'i
 * Kullanım: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://4takademi:secret@localhost:5432/4takademi";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
        await pool.end();
    });
