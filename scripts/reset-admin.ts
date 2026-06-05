import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@4takademi.com";
  const plainPassword = "4tAkademi.2026"; // User requested password

  const hash = await bcrypt.hash(plainPassword, 10);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { password: hash, role: "ADMIN" }
    });
    console.log(`Admin password has been reset to: ${plainPassword}`);
  } else {
    await prisma.user.create({
      data: {
        email,
        name: "Admin",
        password: hash,
        role: "ADMIN"
      }
    });
    console.log(`Admin user created with password: ${plainPassword}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
