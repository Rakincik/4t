const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding new distinct header menus...");
  const defaultMenus = [
      { slug: "header-uzaktan", title: "Uzaktan Eğitim (Header)" },
      { slug: "header-orgun", title: "Ankara Örgün (Header)" },
      { slug: "header-flix", title: "4T Flix (Header)" },
      { slug: "header-blog", title: "Blog (Header)" },
      { slug: "header-hakkimizda", title: "Hakkımızda (Header)" }
  ];

  for (const menu of defaultMenus) {
      const existing = await prisma.menu.findUnique({ where: { slug: menu.slug } });
      if (!existing) {
          await prisma.menu.create({ data: menu });
          console.log(`Created: ${menu.slug}`);
      } else {
          console.log(`Already exists: ${menu.slug}`);
      }
  }

  // Delete the old generic header-main to prevent confusion
  try {
    await prisma.menu.delete({ where: { slug: 'header-main' } });
    console.log("Deleted old 'header-main' menu.");
  } catch (e) {
    if (e.code === 'P2025') {
       console.log("Old 'header-main' not found, skipping delete.");
    } else {
       console.error("Error deleting old header-main: ", e);
    }
  }
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
