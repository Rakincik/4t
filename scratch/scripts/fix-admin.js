const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://4takademi:secret@localhost:5432/4takademi';
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        // Check if admin exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'admin@4takademi.com' }
        });

        if (existingUser) {
            console.log('Existing user found:', existingUser.email);
            console.log('Password hash:', existingUser.password);
            const match = await bcrypt.compare('admin123', existingUser.password);
            console.log('Password "admin123" match:', match);

            if (!match) {
                // Update password with proper hash
                const newHash = await bcrypt.hash('admin123', 10);
                await prisma.user.update({
                    where: { email: 'admin@4takademi.com' },
                    data: { password: newHash }
                });
                console.log('Password updated with new hash:', newHash);
            }
        } else {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = await prisma.user.create({
                data: {
                    email: 'admin@4takademi.com',
                    name: 'Admin',
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            console.log('Admin user created:', admin.email);
        }
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main().catch(console.error);
